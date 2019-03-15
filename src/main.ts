import { Aurelia } from 'aurelia-framework'
import environment from './environment';
import Backend = require('i18next-xhr-backend');
import { Promise, config } from "bluebird";
import { AppRouter } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as process from "process";
import * as _ from "lodash";

window["global"] = window;
window["process"] = process;
window["define"]("text", () => {
  return {
    load: (module: string, require: (id: string | string[]) => Promise<any>, onload: (content: string) => void) => {
      return require([module]).then(onload);
    }
  };
});
//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
global.Promise = Promise;
config({
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .feature('resources')
    .plugin('aurelia-dialog')
    .plugin('aurelia-validation')
    .plugin('aurelia-i18n', (instance) => {
      // register backend plugin
      instance.i18next.use(Backend);

      // adapt options to your needs (see http://i18next.com/docs/options/)
      // make sure to return the promise of the setup method, in order to guarantee proper loading
      return instance.setup({
        backend: {                                  // <-- configure backend settings
          loadPath: './locales/{{lng}}/{{ns}}.json', // <-- XHR settings for where to get the files from
        },
        lng: 'en',
        attributes: ['t', 'i18n'],
        ns: ["shell", "user", "claim", "challenge", "judge", "federation"],
        fallbackLng: 'en',
        debug: false
      }).then(() => {
        const router: AppRouter = aurelia.container.get(AppRouter);
        router.transformTitle = (title) => instance.tr(title);

        const eventAggregator = aurelia.container.get(EventAggregator);
        eventAggregator.subscribe('i18n:locale:changed', () => {
          router.updateTitle();
        });
      });;
    });

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}