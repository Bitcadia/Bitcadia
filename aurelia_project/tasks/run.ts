import { CLIOptions } from 'aurelia-cli';
import { watch } from "./watch";
import * as gulp from 'gulp';
import * as historyApiFallback from 'connect-history-api-fallback/lib';
import * as project from '../aurelia.json';
import browserSync = require('browser-sync');
import build from './build';

const bs1 = browserSync.create();
const bs2 = browserSync.create();
const startSync = (done) => {
  bs1.init({
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
  bs2.init({
    online: false,
    ui: { port: 3002 },
    open: CLIOptions.hasFlag('open'),
    port: project.prodPlatform.port,
    logLevel: 'silent',
    server: {
      baseDir: [project.prodPlatform.baseDir],
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
};
const serve = gulp.series(
  build,
  startSync
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
  bs1.reload();
  bs2.reload();
}

export { runTest as default, serve, watch, refresh, startSync };
