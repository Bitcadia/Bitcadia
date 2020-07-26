import chalk = require('chalk');
import { sync } from 'rimraf';
import { tmpdir } from 'os';
import { join } from 'path';

const DIR = join(tmpdir(), 'jest_puppeteer_global_setup');

export = async function () {
  console.log(chalk.default.green("teardown jest puppeteer"));
  await global.__BROWSER_GLOBAL__.close();
  sync(DIR);
};
