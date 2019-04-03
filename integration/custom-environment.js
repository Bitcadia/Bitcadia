const PuppeteerEnvironment = require('jest-environment-puppeteer');
const reporter = require('jest-jasmine2/build/reporter');

const reduce = (previous, current) => {
  let url = current.url;
  if (url.includes("/scripts/")) {
    url = url.split("/scripts/").pop();
    const arr = previous[url] = previous[url] || [];
    previous[url] = arr.concat(current.ranges);
  }
  return previous;
}
// @ts-ignore
class CustomEnvironment extends PuppeteerEnvironment {
  async setup() {
    const _this = this;
    await super.setup();
    // Your setup
    // @ts-ignore
    const originalGetresults = reporter.default.prototype.getResults
    reporter.default.prototype.getResults = function () {
      return originalGetresults.apply(this).then((result) => {
        // @ts-ignore
        const coverageEntries = (global.coverageEntries || _this.global.coverageEntries || []);
        console.log("Result: " + coverageEntries.length);
        // @ts-ignore
        _this.global.__coverage__ = coverageEntries.reduce(reduce, _this.global.__coverage__ || {});
        return result;
      });
    };
  }

  async teardown() {
    // Your teardown
    await super.teardown();
  }
}

module.exports = CustomEnvironment;
