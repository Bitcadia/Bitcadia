import { run } from "jest";
import * as project from '../aurelia.json';
import { sync } from "rimraf";

const runJest = (cb) => {
  sync(project.unitTestRunner.out);
  return run(["-i"], project.unitTestRunner.proj).then(() => {
    cb();
  });
};

export { runJest as default };
