import chalk = require('chalk');
import { launch } from 'puppeteer';
import { writeFileSync } from 'fs';
import { sync } from 'mkdirp';
import { tmpdir } from 'os';
import { join } from 'path';

const DIR = join(tmpdir(), 'jest_puppeteer_global_setup');

export = async function () {
  console.log(chalk.default.green("setup jest puppeteer"));
  const browser = await launch({});
  const page = await browser.newPage();
  // This global is not available inside tests but only in global teardown
  global.__BROWSER_GLOBAL__ = browser;
  global.__PAGE_GLOBAL__ = page;
  page.coverage.startCSSCoverage();
  page.coverage.startJSCoverage();
  // Instead, we expose the connection details via file system to be used in tests
  sync(DIR);
  writeFileSync(join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};
