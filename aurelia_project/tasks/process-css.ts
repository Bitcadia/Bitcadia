import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import * as sourcemaps from 'gulp-sourcemaps';
import * as sass from 'gulp-sass';
import * as postcss from 'gulp-postcss';
import * as cssnext from 'postcss-cssnext';
import * as rtlcss from 'rtlcss';
import * as cssnano from 'cssnano';
import * as autoprefixer from 'autoprefixer';
import * as project from '../aurelia.json';
import { build } from 'aurelia-cli';

export default function processCSS() {
  const processors = [
    rtlcss({}),
    autoprefixer({ browsers: ['last 1 version'] }),
    cssnano()
  ];
  return gulp.src(project.cssProcessor.source)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sass().on('error', sass.logError))
    .pipe(build.bundle());
}
