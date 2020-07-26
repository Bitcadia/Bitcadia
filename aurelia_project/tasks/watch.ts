import { build } from 'aurelia-cli';
import { writeModularBundles } from "./modual-build";
import * as gulp from 'gulp';
import * as project from '../aurelia.json';
import gulpWatch = require('gulp-watch');
import debounce = require('debounce');
import minimatch = require('minimatch');
import processCSS from './process-css';
import processMarkup from './process-markup';
import processSCSS from './process-scss';
import transpile from './transpile';
import processJson from './process-json';

const debounceWaitTime = 100;
let isBuilding = false;
const pendingRefreshPaths: string[] = [];
let watchCallback = () => { };

const watches = [
  { name: 'transpile', callback: transpile, source: project.transpiler.source },
  { name: 'markup', callback: processMarkup, source: project.markupProcessor.source },
  { name: 'CSS', callback: processCSS, source: project.cssProcessor.source },
  { name: 'SCSS', callback: processSCSS, source: project.scssProcessor.source },
  { name: 'JSON', callback: processJson, source: project.jsonProcessor.source },
  { name: 'Integration', callback: (done) => { done(); }, source: project.unitTestRunner.coverage },
];

export function watch(callback = watchCallback) {
  watchCallback = callback;

  // watch every glob individually
  for (const watcher of watches) {
    if (Array.isArray(watcher.source)) {
      for (const glob of watcher.source) {
        watchPath(glob);
      }
    } else {
      watchPath(watcher.source);
    }
  }
}

const watchPath = (glob: string | string[]) => {
  gulpWatch(glob, (vinyl) => {
    if (vinyl.path && vinyl.cwd && vinyl.path.startsWith(vinyl.cwd)) {
      const pathToAdd = vinyl.path.slice(vinyl.cwd.length + 1);
      log(`Watcher: Adding path ${pathToAdd} to pending build changes...`);
      pendingRefreshPaths.push(pathToAdd);
      refresh();
    }
  });
};

const refresh = debounce(() => {
  if (isBuilding) {
    log('Watcher: A build is already in progress, deferring change detection...');
    return;
  }

  isBuilding = true;

  const paths = pendingRefreshPaths.splice(0);
  const refreshTasks: typeof watches = [];

  // determine which tasks need to be executed
  // based on the files that have changed
  for (const watcher of watches) {
    if (Array.isArray(watcher.source)) {
      for (const source of watcher.source) {
        if (paths.find((path) => minimatch(path, source))) {
          refreshTasks.push(watcher);
        }
      }
    }
    else {
      if (paths.find((path) => minimatch(path, watcher.source))) {
        refreshTasks.push(watcher);
      }
    }
  }

  if (refreshTasks.length === 0) {
    log('Watcher: No relevant changes found, skipping next build.');
    isBuilding = false;
    return;
  }

  log(`Watcher: Running ${refreshTasks.map((x) => x.name).join(', ')} tasks on next build...`);

  const toExecute = gulp.series(
    readProjectConfiguration,
    gulp.parallel(refreshTasks.map((x) => x.callback)),
    writeBundles,
    (done) => {
      isBuilding = false;
      watchCallback();
      done();
      if (pendingRefreshPaths.length > 0) {
        log('Watcher: Found more pending changes after finishing build, triggering next one...');
        refresh();
      }
    }
  );

  toExecute(() => { });
}, debounceWaitTime);

function log(message: string) {
  console.log(message);
}

let bundlerPromise;
function readProjectConfiguration() {
  return bundlerPromise = build.src(project);
}

function writeBundles(cb) {
  return bundlerPromise.then((bundler) => {
    return writeModularBundles(bundler, project)
      .then(() => { cb(); });
  });
}
