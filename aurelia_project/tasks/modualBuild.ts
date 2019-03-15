
import * as fs from 'fs';
import * as pathModule from 'path';
import { memoize } from "lodash";

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

    if (loaderOptions.configTarget === bundle.config.name) {
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
            if (~fromModuleId.indexOf("jquery")) {
                debugger;
            }
            if (pathAliases[fromModuleId]) {
                if (!loaderConfig.map[pathAliases[fromModuleId]]) {
                    loaderConfig.map[pathAliases[fromModuleId]] = {};
                }
                pathAliases = loaderConfig.map[pathAliases[fromModuleId]];
            }
            pathAliases[fromModuleId] = pathAliases[fromModuleId] || toModuleId;
            loaderConfig.map[fromModuleId] = Object.assign(
                loaderConfig.map[fromModuleId] || {},
                {
                    [fromModuleId]: fromModuleId
                });
        });

    }
}

export function writeModularBundles(bundler, project: typeof import('../aurelia.json')) {
    const removeExtensions = (project.build.loader.plugins)
        .filter((plugin) => (plugin as any).config.omit)
        .reduce((previous, current) => {
            return previous.concat((current as any).config.extensions);
        }, [] as string[]);
    return bundler.build().then(() => {
        return Promise.all(bundler.items.map((file) => {
            return new Promise((res, rej) => {
                let path = pathModule.join(process.cwd(), project.build.targets[0].output);
                path = pathModule.join(path, `${file.moduleId}.js`);
                ensureDirectoryExistence(path);
                removeExtensions.forEach((extension) => {
                    if (path.endsWith(`${extension}.js`)) {
                        //path = path.slice(0, -3);
                    }
                });
                fs.writeFile(
                    path,
                    file.contents,
                    (err) => {
                        err ? rej(err) : res();
                    }
                );
            });
        })).then(() => {
            bundler.bundles.map(getAliases);
            bundler.loaderOptions.plugins = [];
            return Promise.all(bundler.bundles.map((bundle) => {
                writeBundle(bundle, project).then((content) => {
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
                        fs.writeFile(
                            path,
                            content,
                            (err) => {
                                err ? rej(err) : res();
                            }
                        );
                    });
                });
            }));
        });
    });
}