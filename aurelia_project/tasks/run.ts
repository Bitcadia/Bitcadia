import { CLIOptions } from 'aurelia-cli';
import { watch } from "./watch";
import * as gulp from 'gulp';
import * as historyApiFallback from 'connect-history-api-fallback/lib';
import * as project from '../aurelia.json';
import browserSync = require('browser-sync');
import build from './build';

const serve = gulp.series(
  build,
  (done) => {
    browserSync({
      online: false,
      open: CLIOptions.hasFlag('open'),
      port: project.platform.port,
      logLevel: 'silent',
      server: {
        baseDir: [project.platform.baseDir],
        middleware: [historyApiFallback(), function (req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        }]
      }
    }, function (err: any, bs: any) {
      if (err) return done(err);
      const urls = bs.options.get('urls').toJS();
      log(`Application Available At: ${urls.local}`);
      log(`BrowserSync Available At: ${urls.ui}`);
      done();
    });
  }
);

const refresh = gulp.series(
  build,
  reload
);

const runTest = gulp.series(
  serve,
  (done) => { watch(reload); done(); }
);

function log(message: string) {
  console.log(message);
}

function reload() {
  log('Refreshing the browser');
  browserSync.reload();
}

export { runTest as default, serve, watch, refresh };
