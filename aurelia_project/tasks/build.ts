/// <reference path="../../custom_typings/primitives.d.ts" />
/// <reference path="../../custom_typings/json.d.ts" />
import * as gulp from 'gulp';
import * as fs from 'fs';
import * as path from 'path';
import { CLIOptions, build as buildCLI } from 'aurelia-cli';
import transpile from './transpile';
import processMarkup from './process-markup';
import processJson from './process-json';
import processCSS from './process-css';
import processSCSS from './process-scss';
import copyFiles from './copy-files';
import { watch } from './watch';
import { writeModularBundles } from "./modual-build";
import * as project from '../aurelia.json';

const build = gulp.series(
  readProjectConfiguration,
  gulp.parallel(
    transpile,
    processMarkup,
    processJson,
    processCSS,
    processSCSS,
    copyFiles
  ),
  writeBundles
);

let main;

if (CLIOptions.taskName() === 'build' && CLIOptions.hasFlag('watch')) {
  main = gulp.series(
    build,
    (done) => { watch(); done(); }
  );
} else {
  main = build;
}
let bundlerPromise;
function readProjectConfiguration() {
  return bundlerPromise = buildCLI.src(project);
}

function writeBundles(cb) {
  return bundlerPromise.then((bundler) => {
    return writeModularBundles(bundler, project)
      .then(() => { cb(); });
  });
}
export { main as default };
