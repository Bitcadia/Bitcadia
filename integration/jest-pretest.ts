import { platform } from "../aurelia_project/aurelia.json";

beforeAll(async function () {
  await page.coverage.startCSSCoverage();
  await page.coverage.startJSCoverage();
  (global as any).coverageEntries = [];
});

beforeEach(async function () {
  await page.goto(`http://localhost:${platform.port}`);
  return page;
});

afterAll(async () => {
  const cssCoverage = await page.coverage.stopCSSCoverage();
  const jsCoverage = await page.coverage.stopJSCoverage();

  (global as any).coverageEntries.push.apply((global as any).coverageEntries, jsCoverage.concat(cssCoverage));
});
