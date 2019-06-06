import {
  getGreeting, setSeed, setPasswordRepeat,
  setPassword, genSeed, getErrors, setName
} from "./welcome.po";
import * as shellStrings from "../../src/locales/en/shell.json";
import * as userStrings from "../../src/locales/en/user.json";
import { expect } from "chai";
import { waitUntil, getAttribute, waitforText } from "./utils.po";
import { delay } from "bluebird";
import { clickRegister } from "./topbar.po";

describe("Bitcadia Account", function () {
  it("should register", async () => {
    await clickRegister();
    const title = await page.title();
    const greeting = await getGreeting();
    expect(title).to.contain(shellStrings.SiteName);
    expect(greeting).to.contain(userStrings.registerInfo);
    await setName("");
    await setSeed("");
    await setPasswordRepeat("");
    await setPassword("");
    await page.focus('button');
    let errors = await getErrors(userStrings.passwordRequired);
    const disabled = (await getAttribute("#saveContract", "disabled")) === '';
    expect(disabled).to.eq(true);
    expect(errors).to.contain(userStrings.passwordRequired);
    expect(errors).to.contain(userStrings.seedRequired);
    expect(errors).to.contain(userStrings.nameRequired);
    await setPasswordRepeat('p2');
    await setPassword('p1');
    await setSeed("thing");
    await setName("TestName");
    await page.focus('button');
    errors = await getErrors(userStrings.seedInvalid);
    expect(errors).to.contain(userStrings.passwordMismatch);
    expect(errors).to.contain(userStrings.seedInvalid);
    const seed = await genSeed();
    await setPasswordRepeat('realpass');
    await setPassword("realpass");
    await page.focus('button');
    const noErrors = await waitUntil(async () => {
      return (await getErrors()) === "";
    }, { timeout: 1000, polling: 100 });
    expect(seed && seed.split(' ').length).to.eq(12);
    expect(noErrors).to.eq(true);
    page.click('#saveContract');
    await waitforText('#userSetup', userStrings.setup);
    await delay(500);
    await page.reload();
    await waitforText('#logInInfo', userStrings.logInInfo);
    await setName('');
    await setPassword('realPass');
    errors = await getErrors(userStrings.passwordMismatch);
    expect(errors).to.contain(userStrings.passwordMismatch);
    expect(errors).to.contain(userStrings.nameRequired);
    await setName("TestNam");
    await setPassword('realpass');
    errors = await getErrors(userStrings.passwordMismatch);
    await setName("TestName");
    await setPassword('realpass');
    await page.click('#okLogIn');
    await delay(500);
  }, 30000);
});
