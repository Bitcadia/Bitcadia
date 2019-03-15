import * as gulp from 'gulp';
import * as browserSync from 'browser-sync';
import * as historyApiFallback from 'connect-history-api-fallback/lib';
import { CLIOptions } from 'aurelia-cli';
import build from './build';
import { watch } from "./watch";
import * as project from '../aurelia.json';

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
    }, function (err, bs) {
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

const run = gulp.series(
  serve,
  (done) => { watch(reload); done(); }
);

function log(message) {
  console.log(message);
}

function reload() {
  log('Refreshing the browser');
  browserSync.reload();
}

export { run as default };
