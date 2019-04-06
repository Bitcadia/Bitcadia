import * as jestCLI from 'jest-cli';
import * as PluginError from 'plugin-error';
import * as path from 'path';
import * as packageJson from '../../package.json';
import stringify = require('json-stable-stringify');
import { unitTestRunner } from '../aurelia.json';
import { CLIOptions } from 'aurelia-cli';
import { writeFile } from 'fs';
interface Interval {
  start: number;
  end: number;
}

function mergeRanges(meetings: Interval[]) {
  // sort by start times, slice will return a shallow copy of the array, not affecting original array
  return meetings.slice().sort(function (a, b) {
    return a.start > b.start ? 1 : -1;
  });
}

const runJest = (cb) => {
  const options = packageJson.jest;
  const baseDir = path.resolve(__dirname, '../../');

  if (CLIOptions.hasFlag('watch')) {
    //Object.assign(options, { watch: true });
  }
  jestCLI.runCLI(options, [baseDir]).then((result) => {
    let coverage = result.results.testResults.map((result) => result.coverage)
      .reduce((map, coverage) => {
        for (const key in coverage) {
          map[key] = (map[key] || []).concat(coverage[key]);
        }
        return map;
      }, {});
    coverage = Object.keys(coverage).reduce((map, key) => {
      map[key] = mergeRanges(coverage[key]);
      return map;
    }, {});
    writeFile(
      path.resolve(baseDir, unitTestRunner.coverage),
      stringify(coverage).replace(/\],/g, '],\n')
    );

    if (result.numFailedTests || result.numFailedTestSuites) {
      cb(new PluginError('gulp-jest', { message: 'Tests Failed' }));
    } else {
      cb();
    }
  });
};

export { runJest as default };
