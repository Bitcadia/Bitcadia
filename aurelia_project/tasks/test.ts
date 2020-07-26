import * as project from '../aurelia.json';
import * as gulp from 'gulp';
import { Server, stopper } from 'karma';
//@ts-ignore
import { CLIOptions } from 'aurelia-cli';
import { watch, serve } from "./run";
import runJest from "./jest";
import * as path from 'path';

function log(message) {
  console.log(message); //eslint-disable-line no-console
}

let karmaInst: Server;
const karma = (done) => {
  karmaInst = new Server({
    configFile: path.join(__dirname, '/../../karma.conf.js'),
    singleRun: false,
  }, (err) => { done(); if (err) { process.exit(err); } });
  karmaInst.start();
};
const endKarma = (done) => {
  !CLIOptions.hasFlag('watch') && stopper.stop({
    port: project.unitTestRunner.port,
  });
  done();
};

const unit = gulp.series(
  serve,
  gulp.parallel(
    (done) => { watch(); done(); },
    karma,
    gulp.series(
      runJest,
      endKarma
    )
  )
);

export default unit;
