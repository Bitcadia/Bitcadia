import { waitUntil, getProperty, setProperty, dispatchEvent, EventEnum } from "./utils.po";
import { Selectors as TopBarSelectors, clickTopbarLogin, clickTopbarRegister, setModalName, setModalPassword, clickModalLogin } from "./topbar.po";
import { delay } from "bluebird";
import { ElementHandle } from "puppeteer";

export const enum Selectors {
  errors = "#errors",
  name = "#name",
  generateSeed = "#generateSeed",
  seed = "#seed",
  password = "#password",
  passwordRepeat = "#passwordRepeat",
  saveContract = "#saveContract"
}

export async function getGreeting() {
  await page.waitFor('.jumbotron');
  return await page.$eval('.jumbotron', (el) => el.textContent);
}
export async function getErrors(error?: string) {
  console.log(`get error "${error}"`);
  if (error) {
    const errors = await waitUntil(async () => {
      const errors = await getProperty(Selectors.errors, "textContent");
      return errors && errors.includes(error) && errors;
    }, { polling: 100, timeout: 1000 });
    return errors;
  }
  return await getProperty(Selectors.errors, "textContent");
}

export async function setName(val: string) {
  console.log(`set name "${val}"`);
  await dispatchEvent(Selectors.name, 'focus', EventEnum.FocusEvent);
  await page.focus(Selectors.name);
  await setProperty<HTMLInputElement>(Selectors.name, 'value', '');
  await page.keyboard.type(val, { delay: 50 });
  await page.keyboard.press('Tab');
}
export async function getName() {
  console.log(`get name`);
  return await getProperty<HTMLInputElement>(Selectors.name, 'value');
}
export async function clickGenerateSeed() {
  console.log(`generate seed`);
  await page.click(Selectors.generateSeed);
  const seed = await waitUntil(async () => {
    const seed = await getSeed();
    return seed && seed.split(' ').length == 12 && seed;
  }, { polling: 100, timeout: 1000 });
  console.log(`seed generated`);
  return seed;
}
export async function clickSaveContract() {
  console.log(`click create user save contract`);
  await delay(200);
  await page.waitForSelector(Selectors.saveContract);
  await delay(200);
  await page.click(Selectors.saveContract);
}
export async function getSeed() {
  console.log('get seed');
  return await getProperty<HTMLTextAreaElement>(Selectors.seed, 'value');
}
export async function setSeed(val: string) {
  console.log(`set seed "${val}"`);
  await dispatchEvent(Selectors.seed, 'focus', EventEnum.FocusEvent);
  await page.focus(Selectors.seed);
  await page.keyboard.type(val, { delay: 50 });
  await page.keyboard.press('Tab');
  await dispatchEvent(Selectors.seed, 'blur', EventEnum.FocusEvent);
}
export async function setPasswordRepeat(val: string) {
  console.log(`set password repeat "${val}"`);
  await dispatchEvent(Selectors.passwordRepeat, 'focus', EventEnum.FocusEvent);
  await page.focus(Selectors.passwordRepeat);
  await setProperty<HTMLInputElement>(Selectors.passwordRepeat, 'value', '');
  await page.keyboard.type(val, { delay: 50 });
  await page.keyboard.press('Tab');
  await dispatchEvent(Selectors.passwordRepeat, 'blur', EventEnum.FocusEvent);
}
export async function setPassword(val: string) {
  console.log(`set password "${val}"`);
  await dispatchEvent(Selectors.password, 'focus', EventEnum.FocusEvent);
  await page.focus(Selectors.password);
  await setProperty<HTMLInputElement>(Selectors.password, 'value', '');
  await page.keyboard.type(val, { delay: 50 });
  await page.keyboard.press('Tab');
}
export async function getPassword() {
  console.log(`get password`);
  return await getProperty<HTMLInputElement>(Selectors.password, 'value');
}
export async function getPasswordRepeat() {
  console.log(`get password repeat`);
  return await getProperty<HTMLInputElement>(Selectors.passwordRepeat, 'value');
}

export async function createOrSignIn(name: string, password: string, seed?: string) {
  console.log(`signing in as ${name}, with password${password}${seed ? `, using seed ${seed}` : ``}.`);
  let loginBtn: ElementHandle | null;
  loginBtn = await page.waitForSelector(TopBarSelectors.topBarLogin, { timeout: 1 }).catch(() => null);
  if (loginBtn) {
    await clickTopbarLogin();
    await setModalName(name);
    await setModalPassword(password);
    await clickModalLogin();
  } else {
    await clickTopbarRegister();
    await setName(name);
    if (seed) {
      await setSeed(seed);
    }
    else {
      await clickGenerateSeed();
    }
    setPassword(password);
    setPasswordRepeat(password);
    clickSaveContract();
  }
}
