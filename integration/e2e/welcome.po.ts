import { waitUntil, getProperty, setProperty, dispatchEvent, EventEnum } from "./utils.po";

export async function getGreeting() {
  await page.waitFor('.jumbotron');
  return await page.$eval('.jumbotron', (el) => el.textContent);
}
export async function getErrors(error?: string) {
  console.log(`get error "${error}"`);
  if (error) {
    const errors = await waitUntil(async () => {
      const errors = await getProperty('#errors', "textContent");
      return errors && errors.includes(error) && errors;
    }, { polling: 100, timeout: 1000 });
    return errors;
  }
  return await getProperty('#errors', "textContent");
}

export async function setName(val: string) {
  console.log(`set name "${val}"`);
  await dispatchEvent('#name', "focus", EventEnum.FocusEvent);
  await page.focus("#name");
  await setProperty<HTMLInputElement>("#name", "value", "");
  await page.keyboard.type(val, { delay: 50 });
  await page.keyboard.press("Tab");
}
export async function getName() {
  console.log(`get name`);
  return await getProperty<HTMLInputElement>('#name', "value");
}
export async function genSeed() {
  console.log(`generate seed`);
  await page.click('#generateSeed');
  const seed = await waitUntil(async () => {
    const seed = await getSeed();
    return seed && seed.split(' ').length == 12 && seed;
  }, { polling: 100, timeout: 1000 });
  console.log(`seed generated`);
  return seed;
}
export async function getSeed() {
  console.log('get seed');
  return await getProperty<HTMLTextAreaElement>('#seed', "value");
}
export async function setSeed(val: string) {
  console.log(`set seed "${val}"`);
  await dispatchEvent('#seed', "focus", EventEnum.FocusEvent);
  await page.focus("#seed");
  await page.keyboard.type(val, { delay: 50 });
  await page.keyboard.press("Tab");
  await dispatchEvent('#seed', 'blur', EventEnum.FocusEvent);
}
export async function setPasswordRepeat(val: string) {
  console.log(`set password repeat "${val}"`);
  await dispatchEvent('#passwordRepeat', "focus", EventEnum.FocusEvent);
  await page.focus("#passwordRepeat");
  await setProperty<HTMLInputElement>("#passwordRepeat", "value", "");
  await page.keyboard.type(val, { delay: 50 });
  await page.keyboard.press("Tab");
  await dispatchEvent('#passwordRepeat', 'blur', EventEnum.FocusEvent);
}
export async function setPassword(val: string) {
  console.log(`set password "${val}"`);
  await dispatchEvent('#password', "focus", EventEnum.FocusEvent);
  await page.focus("#password");
  await setProperty<HTMLInputElement>("#password", "value", "");
  await page.keyboard.type(val, { delay: 50 });
  await page.keyboard.press("Tab");
}
export async function getPassword() {
  console.log(`get password`);
  return await getProperty<HTMLInputElement>('#password', "value");
}
export async function getPasswordRepeat() {
  console.log(`get password repeat`);
  return await getProperty<HTMLInputElement>('#passwordRepeat', "value");
}
