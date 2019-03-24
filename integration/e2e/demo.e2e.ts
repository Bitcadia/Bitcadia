import { PageObjectWelcome } from './welcome.po';
import { PageObjectSkeleton } from './skeleton.po';
import * as shellStrings from "../../src/locales/en/shell.json";
import * as userStrings from "../../src/locales/en/user.json";
import { expect } from "chai";
import { platform } from "../../aurelia_project/aurelia.json";

describe('aurelia skeleton app', function () {
  let poWelcome: PageObjectWelcome;
  let poSkeleton: PageObjectSkeleton;

  beforeEach(async () => {
    await page.goto(`http://localhost:${platform.port}`);
    poSkeleton = new PageObjectSkeleton();
    poWelcome = new PageObjectWelcome();
  });

  it('should load the page and display the initial page title', async () => {
    await expect(await poSkeleton.getCurrentPageTitle()).to.contain(shellStrings.SiteName);
  });

  it('should display greeting', async () => {
    await expect(await poWelcome.getGreeting()).to.contain(userStrings.registerInfo);
  });

});
