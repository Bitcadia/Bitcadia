'use strict';
const project = require('./aurelia_project/aurelia.json');

let files = [
  'scripts/aurelia-karma.js',
  {
    pattern: project.unitTestRunner.source,
    included: false
  }
];

module.exports = function (config) {
  config.set({
    files: files,
    exclude: [],
    frameworks: [project.testFramework.id],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    // You may use 'ChromeCanary', 'Chromium' or any other supported browser
    browsers: ['Chrome'],
    // client.args must be a array of string.
    // Leave 'aurelia-root', project.paths.root in this order so we can find
    // the root of the aurelia project.
    client: {
      args: ['aurelia-root', project.build.targets[0].output]
    }
  });
};
