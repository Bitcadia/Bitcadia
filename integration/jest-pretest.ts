import { platform } from "../aurelia_project/aurelia.json";
import { CoverageEntry } from "puppeteer";
let cssCoverageEntries: CoverageEntry[] = [];
let jsCoverageEntries: CoverageEntry[] = [];

beforeEach(async function () {
  await page.coverage.startCSSCoverage();
  await page.coverage.startJSCoverage();
  await page.goto(`http://localhost:${platform.port}`);
  return page;
}, 10000);

afterEach(async () => {
  cssCoverageEntries = cssCoverageEntries.concat(await page.coverage.stopCSSCoverage());
  jsCoverageEntries = jsCoverageEntries.concat(await page.coverage.stopJSCoverage());
});

afterAll(async () => {
  const jsCoverage = jsCoverageEntries.reduce((previous, current) => {
    const obj = previous[current.url] = previous[current.url] || {};
    current.ranges.forEach((range) => {
      for (let linNumber = range.start - 1; linNumber < range.end; linNumber++) {
        obj[linNumber] = 1;
      }
    });
    return previous;
  }, {});

  const cssCoverage = cssCoverageEntries.reduce((previous, current) => {
    const obj = previous[current.url] = previous[current.url] || {};
    current.ranges.forEach((range) => {
      for (let linNumber = range.start - 1; linNumber < range.end; linNumber++) {
        obj[linNumber] = 1;
      }
    });
    return previous;
  }, {});
  debugger;
});
