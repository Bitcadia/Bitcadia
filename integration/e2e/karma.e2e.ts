import { expect } from "chai";
import { unitTestRunner } from "../../aurelia_project/aurelia.json";

describe('karma tests', function () {
  it('karma should complete tests', async function () {
    await page.goto(`http://localhost:9876/debug.html`);
    await page.waitFor('#completedtests');
    const text = await page.$eval('#completedtests', (el) => el.textContent);
    return expect(text).to.equal("completed tests");
  }, 10000);
});
