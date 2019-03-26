import { platform, unitTestRunner } from "../aurelia_project/aurelia.json";
import { CoverageEntry } from "puppeteer";
import { writeFile } from "fs";
import * as pathModule from 'path';
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
    let url: string = current.url;
    if (url.includes("/scripts/")) {
      url = url.split("/scripts/").pop() as string;
      const arr = previous[url] = previous[url] || [];
      previous[url] = arr.concat(current.ranges);
    }
    return previous;
  }, {});

  const cssCoverage = cssCoverageEntries.reduce((previous, current) => {
    let url = current.url;
    if (url.includes("/scripts/")) {
      url = url.split("/scripts/").pop() as string;
      const arr = previous[url] = previous[url] || [];
      previous[url] = arr.concat(current.ranges);
    }
    return previous;
  }, {});
  /* const path = pathModule.join(process.cwd(), unitTestRunner.coverage);
  return await new Promise((res, rej) => {
    writeFile(path, JSON.stringify({
      js: jsCoverage,
      css: cssCoverage
    }), (err) => err ? res() : rej(err));
  }); */
});
