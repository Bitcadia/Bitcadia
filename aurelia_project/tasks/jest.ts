import * as jest from 'jest-cli';
import * as PluginError from 'plugin-error';
import * as path from 'path';
import * as packageJson from '../../package.json';
import { unitTestRunner } from '../aurelia.json';
import { CLIOptions } from 'aurelia-cli';
import { writeFile } from 'fs';
interface Interval {
  start: number;
  end: number;
}

function mergeRanges(meetings: Interval[]) {

  // sort by start times, slice will return a shallow copy of the array, not affecting original array
  const sortedMeetings = meetings.slice().sort(function (a, b) {
    return a.start > b.start ? 1 : -1;
  });

  // initialize mergedMeetings with the earliest meeting
  const mergedMeetings = [sortedMeetings[0]];

  for (let i = 1; i < sortedMeetings.length; i++) {

    const currentMeeting = sortedMeetings[i];
    const lastMergedMeeting = mergedMeetings[mergedMeetings.length - 1];

    // if the current and last meetings overlap, use the latest end time
    // objects, and arrays (which are objects) all are passed by reference. thus change will be recorded.
    if (currentMeeting.start <= lastMergedMeeting.end) {
      lastMergedMeeting.end = Math.max(lastMergedMeeting.end, currentMeeting.end);

      // add the current meeting since it doesn't overlap
    } else {
      mergedMeetings.push(currentMeeting);
    }
  }

  return mergedMeetings;
}

export default (cb) => {
  const options = packageJson.jest;

  if (CLIOptions.hasFlag('watch')) {
    Object.assign(options, { watch: true });
  }
  const baseDir = path.resolve(__dirname, '../../');
  jest.runCLI(options, [baseDir]).then((result) => {
    debugger;
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
    writeFile(path.resolve(baseDir, unitTestRunner.coverage), JSON.stringify(coverage));

    if (result.numFailedTests || result.numFailedTestSuites) {
      cb(new PluginError('gulp-jest', { message: 'Tests Failed' }));
    } else {
      cb();
    }
  });
};
