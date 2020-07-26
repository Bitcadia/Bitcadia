const PuppeteerEnvironment = require('jest-environment-puppeteer');
const v8toIstanbul = require('v8-to-istanbul');
const istanbulCoverage = require('istanbul-lib-coverage');
const reporter = require('jest-jasmine2/build/reporter');
const path = require('path');

function convertCoverage(coverageInfo, existingMap) {
  return coverageInfo.reduce((existingMap, coverageItem) => {
    const splitUrl = coverageItem.url.split("/scripts/");
    if (splitUrl.length === 1) {
      return existingMap;
    }
    const pathFromUrl = path.resolve(__dirname, `../scripts/${splitUrl.pop()}`);
    const script = v8toIstanbul(`file://${pathFromUrl}`);
    script.applyCoverage([{
      ranges: coverageItem.ranges.map(convertRange),
      isBlockCoverage: true
    }]);
    const scriptIstanbul = script.toIstanbul()
    Object.values(scriptIstanbul).forEach((fCov) => {
      existingMap.addFileCoverage(istanbulCoverage.createFileCoverage(fCov));
    });
    return existingMap;
  }, existingMap)
}

// Takes in a Puppeteer range object with start and end properties and
// converts it to a V8 range with startOffset, endOffset, and count properties
function convertRange(range) {
  return {
    startOffset: range.start,
    endOffset: range.end,
    count: 1
  }
}
// @ts-ignore
class CustomEnvironment extends PuppeteerEnvironment {
  async setup() {
    const _this = this;
    await super.setup();
    // Your setup
    // @ts-ignore
    const originalGetResults = reporter.default.prototype.getResults;
    let coverageMap;
    reporter.default.prototype.getResults = function () {
      return originalGetResults.apply(this).then((result) => {
        // @ts-ignore
        const coverageEntries = _this.global.coverageEntries || [];
        console.log("Result: " + coverageEntries.length);
        // @ts-ignore
        coverageMap = (coverageMap || istanbulCoverage.createCoverageMap());
        // @ts-ignore
        _this.global.__coverage__ = JSON.parse(JSON.stringify(coverageMap = convertCoverage(coverageEntries, coverageMap)));
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
