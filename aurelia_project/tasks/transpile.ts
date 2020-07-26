import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import * as sourcemaps from 'gulp-sourcemaps';
import * as notify from 'gulp-notify';
import * as ts from 'gulp-typescript';
import * as project from '../aurelia.json';
import { CLIOptions, build } from 'aurelia-cli';
import merge2 = require('merge2');
import plumber = require('gulp-plumber');
import rename = require('gulp-rename');
import glob = require('glob');
import path = require('path');
import minimatch = require("minimatch");
import { writeFile } from 'fs';
import { defaultReporter } from 'gulp-typescript/release/reporter';
import { exclude } from "../../tsconfig.json";

function configureEnvironment() {
  const env = CLIOptions.getEnvironment();
  return gulp.src(`aurelia_project/environments/${env}.ts`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(rename('environment.ts'))
    .pipe(gulp.dest(project.paths.root));
}
function id(val) { return val; }
function createPaths(cb) {
  let tsFileArray = glob.sync(project.transpiler.source);
  let cssFileArray = glob.sync(project.cssProcessor.source);
  let scssFileArray = glob.sync(project.scssProcessor.source);
  let markupFileArray = glob.sync(project.markupProcessor.source);
  let jsonFileArray = glob.sync(project.jsonProcessor.source);
  tsFileArray = tsFileArray.map((file) => {
    file = path.posix.relative(project.paths.root, file).slice(0, -3);
    return file.endsWith(".spec") ? "" :
      `"${file}": typeof import("${file}");`;
  }).sort().filter(id);
  scssFileArray = scssFileArray.map((file) => {
    file = path.posix.relative(project.paths.root, file).slice(0, -5);
    return `"${file}": typeof import("${file}.css");`;
  }).sort().filter(id);
  jsonFileArray = jsonFileArray.map((file) => {
    file = path.posix.relative(project.paths.root, file);
    return `"${file}": typeof import("${file}");`;
  }).sort().filter(id);
  cssFileArray = cssFileArray.map((file) => {
    file = path.posix.relative(project.paths.root, file);
    return `"${file}": typeof import("${file}");`;
  }).sort().filter(id);
  markupFileArray = markupFileArray.map((file) => {
    file = path.posix.relative(project.paths.root, file);
    return `"${file}": typeof import("${file}");`;
  }).sort().filter(id);
  const pathsContents = `declare interface TSModulePaths {
    ${ tsFileArray.join('\n    ')}
  }
  declare interface JSONModulePaths {
    ${ jsonFileArray.join('\n    ')}
  }
  declare interface CSSModulePaths {
    ${ cssFileArray.concat(scssFileArray).join('\n    ')}
  }
  declare interface HTMLModulePaths {
    ${ markupFileArray.join('\n    ')}
  }
  declare interface ModulePaths extends TSModulePaths, JSONModulePaths, CSSModulePaths, HTMLModulePaths {}`;
  writeFile(project.transpiler.pathsOutput, pathsContents, (err) => { err ? cb(err) : cb(); });
}

const typescriptCompiler = ts.createProject('./tsconfig.json', {
  typescript: require('typescript')
});

function buildTypeScript() {
  const dts = gulp.src(project.transpiler.dtsSource);
  const src = typescriptCompiler.src()
    .pipe(changedInPlace({ firstPass: true }));

  const reporter = defaultReporter();
  const origError = reporter.error as Function;
  reporter.error = (err, ts) => {
    const { fullFilename } = err;
    const partialFilename = fullFilename && path.relative(typescriptCompiler.projectDirectory, fullFilename);
    if (!partialFilename || exclude.every((globPattern) => { return !minimatch(partialFilename, globPattern.slice(2)); })) {
      return origError(err, ts);
    }
  };
  return merge2(dts, src)
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(sourcemaps.init())
    .pipe(typescriptCompiler(reporter))
    .pipe(sourcemaps.write({ sourceRoot: 'src' }))
    .pipe(build.bundle());
}

export default gulp.series(
  createPaths,
  configureEnvironment,
  buildTypeScript
);
