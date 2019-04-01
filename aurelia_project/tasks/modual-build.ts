
import * as fs from 'fs';
import * as pathModule from 'path';
import { memoize } from "lodash";
import { parseScript } from "esprima";
import { generate } from "escodegen";
import { Visitor, VisitorOption, replace } from "estraverse";
import { unitTestRunner } from "../aurelia.json";
import { Node } from 'estree';

const moduleHash: StringMap<{ file: number, coverage: number }> = {};
let coverageMap: StringMap<{ start: number, end: number }[]> = {};
function hashCode(str: string) {
  return str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
}
function isNodeCovered(node: Node, coverage: Boolean[]) {
  return node.range ? !coverage.slice(node.range[0], node.range[1]).every((val) => !val) : true;
}
function getVisitor(coveredChars: Boolean[], moduleId: string): Visitor {
  if (moduleId.includes('bootstrap')) {
    debugger;
  }
  const exemptions = unitTestRunner.exempt[moduleId] || [];
  return {
    enter(node: Node) {
      switch (node.type) {
        case "FunctionDeclaration":
          if (exemptions.includes(node.id && node.id.name)) {
            return VisitorOption.Skip;
          }
          break;
        case "BlockStatement":
          node.body = node.body.filter((bodyNode) => {
            switch (bodyNode.type) {
              case "FunctionDeclaration":
              case "ClassDeclaration":
              case "VariableDeclaration":
                return true;
              default:
                break;
            }
            return isNodeCovered(bodyNode, coveredChars);
          });
          return node;
        case "CallExpression":
          if (node.callee.type === "MemberExpression") {
            if (node.callee.property.type === "Identifier") {
              if (node.callee.property.name == "executeInTest") {
                return {
                  "type": "ExpressionStatement",
                  "expression": {
                    "type": "Literal",
                    "value": null,
                    "raw": "null"
                  }
                };
              }
            }
          }
          break;
      }
    }
  };
}

function omitUncoveredJS(contents: string, coverage: { start: number, end: number }[], moduleId: string) {
  const visitor = getVisitor(coverage.reduce((previous, current) => {
    for (let index = current.start; index < current.end; index++) {
      previous[index] = true;
    }
    return previous;
  }, [] as Boolean[]), moduleId);
  const ast = parseScript(contents, { range: true });
  const newAst = replace(ast, visitor);
  return generate(newAst);
}

function writeFile(path: string,
  bundleContents: string | { output: string, testConfig: string, prodConfig: string },
  res: () => void,
  rej: (err: any) => void,
  project: typeof import('../aurelia.json')) {
  const pathArr = path.split(project.platform.output);
  let modulePath = pathArr.slice(1).join(project.platform.output).replace(/\\/g, '/');
  modulePath = modulePath.charAt(0) === '/' ? modulePath.slice(1) : modulePath;

  let contents: string;
  let testConfig: string = "";
  let prodConfig: string = "";
  if (typeof bundleContents === "string") {
    contents = bundleContents;
  } else {
    contents = bundleContents.output;
    testConfig = bundleContents ? bundleContents.testConfig : "";
    prodConfig = bundleContents ? bundleContents.prodConfig : "";
  }
  const newFileHash = hashCode(contents);
  const newCoverageHash = hashCode(JSON.stringify(coverageMap[modulePath] || []));

  if (moduleHash[modulePath] && moduleHash[modulePath].file === newFileHash && moduleHash[modulePath].coverage === newCoverageHash) {
    return res();
  }
  moduleHash[modulePath] = { file: newFileHash, coverage: newCoverageHash };

  return Promise.all([
    new Promise((res, rej) => {
      fs.writeFile(
        path,
        contents + testConfig,
        (err) => {
          err ? rej(err) : res();
        }
      );
    }),
    new Promise((res, rej) => {
      if (!coverageMap[modulePath]) {
        return res();
      }
      const prodPath = pathModule.resolve(pathArr[0], `${project.prodPlatform.output}\\${modulePath}`);
      ensureDirectoryExistence(prodPath);
      if (modulePath.slice(-3) === ".js") {
        contents = omitUncoveredJS(contents, coverageMap[modulePath], modulePath);
      }
      if (modulePath.slice(-4) === ".css") {
        contents = coverageMap[modulePath].reduce((previous, current) => {
          for (let index = current.start; index < current.end; index++) {
            previous[index] = contents[index];
          }
          return previous;
        }, [] as string[]).join('');
      }
      fs.writeFile(
        prodPath,
        contents + prodConfig,
        (err) => {
          err ? rej(err) : res();
        }
      );
    })
  ]).then(res).catch(rej);
}

function ensureDirectoryExistence(filePath) {
  const dirname = pathModule.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

const writeBundle = memoize((bundle, project: typeof import('../aurelia.json'), prod?: boolean) => {
  let work = Promise.resolve();
  const loaderOptions = bundle.bundler.loaderOptions;
  const files: { contents: string }[] = [];
  bundle.prepend = (bundle.prepend || []);
  if (bundle.prepend.length) {
    work = work.then(() => addFilesInOrder(bundle, bundle.prepend, files));
  }
  const out = {
    testConfig: "",
    prodConfig: "",
    output: "",
  };

  if (loaderOptions.configTarget === bundle.config.name || bundle.config.pullConfig) {
    bundle.bundler.loaderConfig.bundles = null;
    bundle.bundler.loaderConfig.baseUrl = project.platform.output;
    out.testConfig = `${bundle.writeLoaderCode(project.platform)}; _aureliaConfigureModuleLoader();`;

    bundle.bundler.loaderConfig.baseUrl = project.prodPlatform.output;
    out.prodConfig = `${bundle.writeLoaderCode(project.prodPlatform)}; _aureliaConfigureModuleLoader();`;
  }

  return work.then(() => {
    out.output = files.reduce((prepend, file) => {
      return `${prepend}\n${file.contents}`;
    }, "");
    return out;
  });
});

function addFilesInOrder(bundle, paths, files) {
  let index = -1;
  function addFile() {
    index++;
    if (index < paths.length) {
      return bundle.getFileFromCacheOrLoad(paths[index])
        .then((file) => files.push(file))
        .then(addFile);
    }
    return Promise.resolve();
  }
  return addFile();
}

function getAliases(bundle) {
  const aliases = bundle.getAliases();

  if (Object.keys(aliases).length) {
    // a virtual prepend file contains nodejs module aliases
    // for instance:
    // define('foo/bar', ['foo/bar/index'], function(m) { return m; });
    // define('foo/bar.js', ['foo/bar'], function(m) { return m; });
    Object.keys(aliases).sort().forEach((fromId) => {
      let fromModuleId = fromId;
      let toModuleId = aliases[fromId];

      const matchingPlugin = bundle.bundler.loaderOptions.plugins.find((p) => p.matches(fromId));

      const loaderConfig = bundle.bundler.loaderConfig;
      loaderConfig.map = loaderConfig.map || {};
      let pathAliases: StringMap<string> = loaderConfig.map["*"] = loaderConfig.map["*"] || {};

      if (matchingPlugin) {
        fromModuleId = matchingPlugin.createModuleId(fromModuleId);
        toModuleId = matchingPlugin.createModuleId(toModuleId);
      }
      if (bundle.config.omitAlias && ~bundle.config.omitAlias.indexOf(fromModuleId)) {
        return;
      }
      if (pathAliases[fromModuleId]) {
        if (!loaderConfig.map[pathAliases[fromModuleId]]) {
          loaderConfig.map[pathAliases[fromModuleId]] = {};
        }
        pathAliases = loaderConfig.map[pathAliases[fromModuleId]];
      }
      pathAliases[fromModuleId] = pathAliases[fromModuleId] || toModuleId;
      loaderConfig.map[fromModuleId] = {
        ...(loaderConfig.map[fromModuleId] || {}),

        [fromModuleId]: fromModuleId
      };
    });
  }
}

export function writeModularBundles(bundler, project: typeof import('../aurelia.json')) {
  return bundler.build()
    .then(() => {
      return new Promise((res, rej) => {
        fs.readFile(pathModule.join(process.cwd(), project.unitTestRunner.coverage), "utf8", (err, data) => err ? rej(err) : res(JSON.parse(data)));
      });
    })
    .then((coverage) => coverageMap = coverage)
    .then(() => {
      return Promise.all(bundler.items.map((file) => {
        return new Promise((res, rej) => {
          let path = pathModule.join(process.cwd(), project.platform.output);
          const pathNoJs = path = pathModule.join(path, `${file.moduleId}`);
          path = `${path}.js`;
          ensureDirectoryExistence(path);
          let resTwice = () => res == resTwice ? (resTwice = res) : res();
          if (pathNoJs.slice(-4).includes(".css")) {
            writeFile(pathNoJs, file.file.contents.toString(), resTwice, rej, project);
          }
          else {
            resTwice = res;
          }
          return writeFile(path, file.contents, resTwice, rej, project);
        });
      })).then(() => {
        bundler.bundles.map(getAliases);
        bundler.loaderOptions.plugins = [];
        return Promise.all(bundler.bundles.map((bundle) => {
          return writeBundle(bundle, project).then((content) => {
            if (!content) {
              return Promise.resolve({});
            }
            return new Promise((res, rej) => {
              const path = `${
                process.cwd()
                }\\${
                project.platform.output
                }\\${
                bundle.config.name
                }`;
              writeFile(path, content, res, rej, project);
            });
          });
        }));
      });
    });
}
