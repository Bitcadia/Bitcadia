
import * as fs from 'fs';
import * as pathModule from 'path';
import { memoize } from "lodash";

const moduleHash: StringMap<number> = {};
function hashCode(str: string) {
  return str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
}
function writeFile(path: string, contents: string, res: () => void, rej: (err: any) => void) {
  const newHash = hashCode(contents);
  if (moduleHash[path] === newHash) {
    return res();
  }
  moduleHash[path] = newHash;
  fs.writeFile(
    path,
    contents,
    (err) => {
      err ? rej(err) : res();
    }
  );
}

function ensureDirectoryExistence(filePath) {
  const dirname = pathModule.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

const writeBundle = memoize((bundle, project: typeof import('../aurelia.json')) => {
  let work = Promise.resolve();
  const loaderOptions = bundle.bundler.loaderOptions;
  const files: { contents: string }[] = [];
  bundle.prepend = (bundle.prepend || []);
  if (bundle.prepend.length) {
    work = work.then(() => addFilesInOrder(bundle, bundle.prepend, files));
  }

  if (loaderOptions.configTarget === bundle.config.name || bundle.config.pullConfig) {
    work = work.then(() => {
      bundle.bundler.loaderConfig.bundles = null;
      files.push({ contents: bundle.writeLoaderCode(project.build.targets[0]) });
      files.push({ contents: '_aureliaConfigureModuleLoader();' });
    });
  }
  return work.then(() => {
    return files.reduce((prepend, file) => {
      return `${prepend}\n${file.contents}`;
    }, "");
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
  return bundler.build().then(() => {
    return Promise.all(bundler.items.map((file) => {
      return new Promise((res, rej) => {
        let path = pathModule.join(process.cwd(), project.build.targets[0].output);
        const pathNoJs = path = pathModule.join(path, `${file.moduleId}`);
        path = `${path}.js`;
        ensureDirectoryExistence(path);
        let resTwice = () => res == resTwice ? (resTwice = res) : res();
        if (pathNoJs.slice(-4).includes(".css")) {
          return writeFile(pathNoJs, file.file.contents.toString(), resTwice, rej);
        }
        else {
          resTwice = res;
        }
        return writeFile(path, file.contents, resTwice, rej);
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
              project.build.targets[0].output
              }\\${
              bundle.config.name
              }`;
            writeFile(path, content, res, rej);
          });
        });
      }));
    });
  });
}
