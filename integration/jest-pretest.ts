import { platform, unitTestRunner } from "../aurelia_project/aurelia.json";
import * as path from 'path';
import { CoverageEntry } from "puppeteer";
import * as fs from 'fs';
import { Promise } from "bluebird";

function hashCode(str: string) {
  return str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
}

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function filterCoverage(coverageItem): CoverageEntry & { relativeUrl?: string } {
  const splitUrl = coverageItem.url.split("/scripts/");
  if (splitUrl.length === 1) {
    return coverageItem;
  }
  coverageItem.relativeUrl = splitUrl.pop();
  const pathFromUrl = path.resolve(__dirname, `../scripts/${coverageItem.relativeUrl}`);
  coverageItem.url = pathFromUrl;
  return coverageItem;
}

beforeAll(async function () {
  await page.coverage.startCSSCoverage();
  await page.coverage.startJSCoverage();
  await page.goto(`http://localhost:${platform.port}`);
  return page;
});

afterAll(async (done) => {
  const cssCoverage = (await page.coverage.stopCSSCoverage()).map(filterCoverage);
  const jsCoverage = (await page.coverage.stopJSCoverage()).map(filterCoverage);
  await Promise.allSettled(([...jsCoverage, ...cssCoverage]).map((coverageEntry) => {
    if (coverageEntry.relativeUrl) {
      delete coverageEntry.text;
      delete coverageEntry.url;
      const coverageEntryJson = JSON.stringify([coverageEntry]);
      const uniq = hashCode(coverageEntryJson);
      ensureDirectoryExistence(`${unitTestRunner.out}/${coverageEntry.relativeUrl}/${uniq}`);
      return new Promise((res, rej) => {
        fs.writeFile(`${unitTestRunner.out}/${coverageEntry.relativeUrl}/${uniq}.json`, coverageEntryJson, (err) => {
          if (err) {
            return rej(err);
          }
          return res(err);
        });
      });
    }
    return Promise.promisify((cb) => cb(null));
  }));
  done();
}, 10000);
