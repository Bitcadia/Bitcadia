import * as fs from 'fs';
import * as pathModule from 'path';
import { memoize } from "lodash";
import { parseScript } from "esprima";
import uglify = require("terser");
import { generate } from "escodegen";
import { Visitor, VisitorOption, replace } from "estraverse";
import { walk as cssWalk, WalkOptionsVisit, parse as cssParse, generate as cssGenerate, Block, CssNode } from "css-tree";
import { unitTestRunner } from "../aurelia.json";
import { Node } from 'estree';
import * as crass from 'crass';
import { CoverageEntry } from 'puppeteer';
interface StringMap<T> {
  [x: string]: T;
}
interface Loc {
  start: { line: number, column: number };
  end: { line: number, column: number };
}
const moduleHash: StringMap<{ file: number, coverage: number }> = {};
const nameCache = {};
const mangleOpts: uglify.MinifyOptions = {
  nameCache: nameCache,
  compress: {},
  mangle: {
    reserved: ["requirejs", "require", "define"]
  },
  toplevel: false,
  keep_classnames: true,
};
function hashCode(str: string) {
  return str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
}
function isNodeCovered(node: Node, coverage: Boolean[]) {
  return node.range ? !coverage.slice(node.range[0], node.range[1]).every((val) => !val) : true;
}

function getVisitor(coveredChars: Boolean[], moduleId: string, content: string): Visitor {
  const exemptions = unitTestRunner.exempt[moduleId] || [];
  exemptions.push(...unitTestRunner.exempt["*"]);
  return {
    // tslint:disable-next-line:cyclomatic-complexity
    enter(node: Node) {
      switch (node.type) {
        case "FunctionExpression":
        case "ArrowFunctionExpression":
          const contentHash = hashCode(content.slice(node.range[0], node.range[1]));
          if (exemptions.includes(contentHash) || exemptions.includes("*")) {
            return VisitorOption.Skip;
          }
          if (node.body.type == "BlockStatement" && node.body.body.every((bodyNode) => {
            return !isNodeCovered(bodyNode, coveredChars);
          })) {
            node.body.body.length && (node.body.body = [{
              "type": "BlockStatement",
              "body": [{
                "type": "ExpressionStatement",
                "expression": {
                  "type": "CallExpression",
                  "callee": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                      "type": "Identifier",
                      "name": "console"
                    },
                    "property": {
                      "type": "Identifier",
                      "name": "warn"
                    }
                  },
                  "arguments": [
                    {
                      "type": "Literal",
                      "value": `exempt ${JSON.stringify(node.loc)}: "${moduleId}": [${contentHash}]
${content.slice(node.range[0], node.range[1])}`,
                      "raw": `"exempt ${JSON.stringify(node.loc)}: \"${moduleId}\": [${contentHash}]"
${content.slice(node.range[0], node.range[1])}`
                    }
                  ]
                }
              }]
            }]);
          }
          break;
        case "FunctionDeclaration":
          if (exemptions.includes(node.id && node.id.name) || exemptions.includes("*")) {
            return VisitorOption.Skip;
          }
          if (node.body.body.every((bodyNode) => {
            return !isNodeCovered(bodyNode, coveredChars);
          })) {
            node.body.body.length && (node.body.body = [{
              "type": "BlockStatement",
              "body": [{
                "type": "ExpressionStatement",
                "expression": {
                  "type": "CallExpression",
                  "callee": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                      "type": "Identifier",
                      "name": "console"
                    },
                    "property": {
                      "type": "Identifier",
                      "name": "warn"
                    }
                  },
                  "arguments": [
                    {
                      "type": "Literal",
                      "value": `exempt: "${moduleId}": ["${node.id.name}"]
${content.slice(node.range[0], node.range[1])}`,
                      "raw": `"exempt: \"${moduleId}\": [\"${node.id.name}\"]"
${content.slice(node.range[0], node.range[1])}`
                    }
                  ]
                }
              }]
            }]);
            return VisitorOption.Skip;
          }
          break;
        case "ExpressionStatement":
          if (node.expression && node.expression.type === "CallExpression" && node.expression.callee.type === "MemberExpression") {
            if (node.expression.callee && node.expression.callee.property.type === "Identifier") {
              if (node.expression.callee && node.expression.callee.property.name == "executeInTest") {
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
function omitUncoveredJS(contents: string, moduleId: string, allCoverage: CoverageEntry[]) {
  const allCoveredChars = allCoverage.reduce((coveredChars, coverage) => {
    return coverage.ranges.reduce((lastCoveredChars, current) => {
      for (let index = current.start; index <= current.end; index++) {
        lastCoveredChars[index] = true;
      }
      return lastCoveredChars;
    }, coveredChars);
  }, []);
  const visitor = getVisitor(allCoveredChars, moduleId, contents);
  const ast = parseScript(contents, { range: true });
  const newAst = replace(ast, visitor);
  const newContent = generate(newAst);
  return uglify.minify(newContent, mangleOpts).code;
}
function isCSSNodeCovered(node: CssNode, coverage: Boolean[]) {
  return node.loc ? !coverage.slice(node.loc.start.offset, node.loc.end.offset).every((val) => !val) : true;
}
function getCssVisitor(coveredChars: Boolean[], moduleId: string, content: string) {
  const exemptions = unitTestRunner.exempt[moduleId] || [];
  return (node: Block) => {
    const contentHash = hashCode(content.slice(node.loc.start.offset, node.loc.end.offset));
    if (exemptions.includes(contentHash) || exemptions.includes("*")) {
      return;
    }
    if (node.children.toArray().every((bodyNode) => {
      return !isCSSNodeCovered(bodyNode, coveredChars);
    })){
      node.children = node.children.filter((bodyNode) => false);
    }
  };
}
function omitUncoveredCSS(contents: string, moduleId: string, allCoverage: CoverageEntry[]) {
  if (moduleId.endsWith('.js')) {
    moduleId = moduleId.slice(0, -3);
  }
  const allCoveredChars = allCoverage.reduce((coveredChars, coverage) => {
    return coverage.ranges.reduce((lastCoveredChars, current) => {
      for (let index = current.start; index <= current.end; index++) {
        lastCoveredChars[index] = true;
      }
      return lastCoveredChars;
    }, coveredChars);
  }, []);
  const visitor = getCssVisitor(allCoveredChars as Boolean[], moduleId, contents);
  const ast = cssParse(contents, { positions: true });
  cssWalk(ast, {
    enter: visitor,
    visit: "Block"
  });
  const newContent = cssGenerate(ast);
  return crass.parse(newContent).optimize().toString();
}

function writeFile(path: string,
  bundleContents: string |
  { output: string, testConfig?: string, prodConfig?: string } |
  { contents: string, file: { contents: Buffer } },
  res: () => void,
  rej: (err: any) => void,
  project: typeof import('../aurelia.json')) {
  const pathArr = path.split(project.platform.output);
  let modulePath = pathArr.slice(1).join(project.platform.output).replace(/\\/g, '/');
  modulePath = modulePath.charAt(0) === '/' ? modulePath.slice(1) : modulePath;

  let contents: string = "";
  let prodContents: string;
  let testConfig: string = "";
  let prodConfig: string = "";
  if (typeof bundleContents === "string") {
    prodContents = contents = bundleContents;
  } else if ('output' in bundleContents) {
    prodContents = contents = bundleContents.output;
    testConfig = bundleContents ? bundleContents.testConfig || "" : "";
    prodConfig = bundleContents ? uglify.minify(bundleContents.prodConfig || "", mangleOpts).code : "";
  } else if ('file' in bundleContents) {
    contents = bundleContents.contents;
    prodContents = bundleContents.file.contents.toString();
  } else {
    return Promise.resolve();
  }
  const coveragePath = pathModule.resolve(pathArr[0], project.unitTestRunner.out);

  let testRunFolders: string[] = [];
  const allModuleCoverage = ((modulePath) => {
    try {
      testRunFolders = fs.readdirSync(pathModule.resolve(coveragePath, modulePath));
    } catch{ }
    return (testRunFolders).map((val) => {
      return JSON.parse(fs.readFileSync(pathModule.resolve(coveragePath, modulePath, val), { encoding: "utf8" }))[0] as CoverageEntry;
    });
  })(modulePath.slice(-7) === ".css.js" ? modulePath.slice(0, -3) : modulePath);
  const newFileHash = hashCode(contents);
  const newCoverageHash = hashCode(JSON.stringify(allModuleCoverage));

  if (moduleHash[modulePath] && moduleHash[modulePath].file === newFileHash && moduleHash[modulePath].coverage === newCoverageHash) {
    return res();
  }
  moduleHash[modulePath] = { file: newFileHash, coverage: newCoverageHash };

  return Promise.all([
    new Promise((res, rej) => {
      const testPath = pathModule.resolve(pathArr[0], `${project.platform.output}\\${modulePath}`);
      ensureDirectoryExistence(testPath);
      fs.writeFile(
        testPath,
        contents + testConfig,
        (err) => {
          err ? rej(err) : res();
        }
      );
    }),
    new Promise((res, rej) => {
      if (!allModuleCoverage.length) {
        return res();
      }
      const prodPath = pathModule.resolve(pathArr[0], `${project.prodPlatform.output}\\${modulePath}`);
      ensureDirectoryExistence(prodPath);
      if (modulePath.slice(-4) === ".css" || modulePath.slice(-7) === ".css.js") {
        prodContents = omitUncoveredCSS(prodContents, modulePath, allModuleCoverage);
        if (modulePath.endsWith(".js")) {
          const ast = parseScript(contents);
          const newAst = replace(ast, {
            enter: (node) => {
              if (node.type === "ReturnStatement" && node.argument && node.argument.type === "Literal") {
                node.argument.value = prodContents;
              }
            }
          });
          prodContents = generate(newAst);
        }
      }
      else if (modulePath.slice(-3) === ".js") {
        prodContents = omitUncoveredJS(prodContents, modulePath, allModuleCoverage);
      }
      fs.writeFile(
        prodPath,
        prodContents + prodConfig,
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
  return (bundler.build() as Promise<void>)
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
            return writeFile(path, file, resTwice, rej, project);
          }
          return writeFile(path, file.contents, resTwice, rej, project);
        });
      })).then(() => {
        bundler.bundles.map(getAliases);
        const pluginsOriginal = bundler.loaderOptions.plugins;
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
        })).then((ret) => {
          bundler.loaderOptions.plugins = pluginsOriginal;
          return ret;
        });
      });
    });
}
