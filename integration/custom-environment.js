const PuppeteerEnvironment = require('jest-environment-puppeteer');

// @ts-ignore
class CustomEnvironment extends PuppeteerEnvironment {
  async setup() {
    await super.setup();
    // Your setup
  }

  async teardown() {
    // Your teardown
    await super.teardown();
  }
}

module.exports = CustomEnvironment;
