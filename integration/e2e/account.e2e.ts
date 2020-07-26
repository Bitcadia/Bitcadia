import {
  getGreeting, setSeed, setPasswordRepeat,
  setPassword, clickGenerateSeed, getErrors, setName, clickSaveContract, Selectors, createOrSignIn
} from './createUser.po';
import * as shellStrings from '../../src/locales/en/shell.json';
import * as userStrings from '../../src/locales/en/user.json';
import { expect } from 'chai';
import { waitUntil, getAttribute, waitforText } from './utils.po';
import { delay } from 'bluebird';
import { clickTopbarRegister, clickTopbarLogin, clickModalLogin, clickTopbarLogout, clickModalLogout, setModalName, setModalPassword, clickModalCancel, clickModalClear, clickModalCancelConfirm, clickModalClearConfirm, clickHome, Selectors as TopbarSelectors } from './topbar.po';

describe('Bitcadia Account', function () {
  it('should register', async () => {
    console.log(`Create user for first time`);
    await clickTopbarRegister();
    const title = await page.title();
    const greeting = await getGreeting();
    expect(title).to.contain(shellStrings.SiteName);
    expect(greeting).to.contain(userStrings.registerInfo);
    await setName('');
    await setSeed('');
    await setPasswordRepeat('');
    await setPassword('');
    await page.focus(Selectors.saveContract);
    let errors = await getErrors(userStrings.passwordRequired);
    const disabled = (await getAttribute(Selectors.saveContract, 'disabled')) === '';
    expect(disabled).to.eq(true);
    expect(errors).to.contain(userStrings.passwordRequired);
    expect(errors).to.contain(userStrings.seedRequired);
    expect(errors).to.contain(userStrings.nameRequired);
    await setPasswordRepeat('p2');
    await setPassword('p1');
    await setSeed('thing');
    await setName('TestName');
    await page.focus(Selectors.saveContract);
    errors = await getErrors(userStrings.seedInvalid);
    expect(errors).to.contain(userStrings.passwordMismatch);
    expect(errors).to.contain(userStrings.seedInvalid);
    const seed = await clickGenerateSeed();
    await setPasswordRepeat('realpass');
    await setPassword('realpass');
    await page.focus(Selectors.saveContract);
    const noErrors = await waitUntil(async () => {
      return (await getErrors()) === '';
    }, { timeout: 1000, polling: 100 });
    expect(seed && seed.split(' ').length).to.eq(12);
    expect(noErrors).to.eq(true);
    await clickSaveContract();

    console.log(`Setup page appears`);
    await waitforText('#userSetup', userStrings.setup);
    await delay(500);
    await page.reload();

    console.log(`Login from refresh for first time`);
    await waitforText('#logInInfo', userStrings.logInInfo);
    await setModalName('');
    await setModalPassword('realPass');
    errors = await getErrors(userStrings.passwordMismatch);
    expect(errors).to.contain(userStrings.passwordMismatch);
    expect(errors).to.contain(userStrings.nameRequired);
    await setModalName('TestNam');
    await setModalPassword('realpass');
    errors = await getErrors(userStrings.passwordMismatch);
    await setModalName('TestName');
    await setModalPassword('realpass');
    await clickModalLogin();

    console.log(`Logout and back in`);
    await clickTopbarLogout();
    await clickModalLogout();
    await clickTopbarLogin();
    await clickModalCancel();
    await clickTopbarRegister();
    await clickHome();
    await clickTopbarLogin();
    await setModalName('TestName');
    await setModalPassword('realpass');
    await clickModalLogin();

    console.log(`Clearing user from browser`);
    await clickTopbarLogout();
    await clickModalCancel();
    await clickTopbarLogout();
    await clickModalClear();
    await waitforText(TopbarSelectors.modalClearSeed, seed as string);
    await clickModalCancelConfirm();
    await clickModalClear();
    await clickModalClearConfirm();
    await clickTopbarRegister();
    await getGreeting();
    await delay(500);
  }, 100000);
  it('should setup user', async () => {
    const name = "TestSetupUser";
    const password = "TestPass";
    await createOrSignIn(name, password);
  });
});
