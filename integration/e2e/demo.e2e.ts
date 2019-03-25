import { getGreeting } from './welcome.po';
import { getCurrentPageTitle } from './skeleton.po';
import * as shellStrings from "../../src/locales/en/shell.json";
import * as userStrings from "../../src/locales/en/user.json";
import { expect } from "chai";

describe('aurelia skeleton app', function () {
  it('should load the page and display the initial page title', async () => {
    await expect(await getCurrentPageTitle()).to.contain(shellStrings.SiteName);
  });

  it('should display greeting', async () => {
    await expect(await getGreeting()).to.contain(userStrings.registerInfo);
  });
});
