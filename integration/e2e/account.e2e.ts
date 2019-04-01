import { getGreeting, setSeed, getSeed, setPasswordRepeat, setPassword, genSeed, getErrors } from './welcome.po';
import { getCurrentPageTitle } from './utils.po';
import * as shellStrings from "../../src/locales/en/shell.json";
import * as userStrings from "../../src/locales/en/user.json";
import { expect } from "chai";

describe('Bitcadia Account', async function () {
  it('should register', async () => {
    await expect(await getCurrentPageTitle()).to.contain(shellStrings.SiteName);
    await expect(await getGreeting()).to.contain(userStrings.registerInfo);
    await setSeed("thing");
    await expect(await getErrors(userStrings.seedInvalid)).to.contain(userStrings.seedInvalid);
    await genSeed();
    await expect((await getSeed()).split(' ').length).to.be.eq(12);
    await setPassword('testpassDiff');
    await setPasswordRepeat('testpass');
    await expect(await getErrors(userStrings.passwordMismatch)).to.contain(userStrings.passwordMismatch);
  });
});
