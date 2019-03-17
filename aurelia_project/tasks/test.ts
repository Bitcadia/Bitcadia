import * as gulp from 'gulp';
import { Server as Karma } from 'karma';
import { CLIOptions } from 'aurelia-cli';
import build from './build';
import { watch, serve } from "./run";
import * as path from 'path';

function log(message) {
  console.log(message); //eslint-disable-line no-console
}

function onChange(path) {
  log(`File Changed: ${path}`);
}

const karma = (done) => {
  new Karma({
    configFile: path.join(__dirname, '/../../karma.conf.js'),
    singleRun: !CLIOptions.hasFlag('watch')
  }, (err) => { done(); if (err) { process.exit(err); } }).start();
};

let unit;

if (CLIOptions.hasFlag('watch')) {
  unit = gulp.series(
    build,
    gulp.parallel(
      (done) => { watch(); done(); },
      karma
    )
  );
} else {
  unit = gulp.series(
    serve,
    karma
  );
}

export default unit;
