import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import * as sourcemaps from 'gulp-sourcemaps';
import * as postcss from 'gulp-postcss';
import * as autoprefixer from 'autoprefixer';
import * as lost from 'lost';
import * as rtlcss from 'rtlcss';
import * as cssurl from 'postcss-url';
import * as cssnext from 'postcss-cssnext';
import * as sass from 'gulp-sass';
import * as project from '../aurelia.json';
import { build } from 'aurelia-cli';

export default function processSCSS() {
  const processors = [
    lost({}),
    cssnext({}),
  ];

  gulp.src(project.scssProcessor.includedFontPaths)
    .pipe(gulp.dest(project.scssProcessor.fontOut));

  return gulp.src(project.scssProcessor.source)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths: project.scssProcessor.includePaths }))
    .pipe(postcss(processors))
    .pipe(build.bundle());

}
