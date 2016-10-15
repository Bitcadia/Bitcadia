import { Aurelia } from 'aurelia-framework'
import environment from './environment';
import { I18N } from 'aurelia-i18n';
import Backend = require('i18next-xhr-backend');
import Bluebird = require('bluebird');

//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
Promise = <any>Bluebird;
Bluebird.config({
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .developmentLogging()
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
        ns: ["shell"],
        fallbackLng: 'en',
        debug: false
      });
    });
  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
