export async function getGreeting() {
  await page.waitFor('.jumbotron');
  return await page.$eval('.jumbotron', (el) => el.textContent);
}
export async function getErrors(error?: string) {
  console.log(`get error "${error}"`);
  if (error) {
    await page.waitForFunction((error) => {
      const el = document.querySelector("#errors");
      return el && el.textContent && el.textContent.includes(error);
    }, { polling: 100, timeout: 1000 }, error);
    return await page.$eval('#errors', (el) => el.textContent);
  }
  return await page.$eval('#errors', (el) => el.textContent);
}
export async function genSeed() {
  console.log(`generate seed`);
  await page.$eval('#generateSeed', (el) => (el as HTMLButtonElement).click());
  await page.waitForFunction(() => {
    const el = document.querySelector<HTMLTextAreaElement>('#seed');
    return el && el.value && el.value.split(' ').length == 12;
  }, { polling: 100, timeout: 1000 });
  console.log(`seed generated`);
}
export async function getSeed() {
  console.log('get seed');
  return await page.$eval('#seed', (el) => (el as HTMLTextAreaElement).value);
}
export async function setSeed(val: string) {
  console.log(`set seed "${val}"`);
  await page.$eval('#seed', (el, val) => {
    (el as HTMLTextAreaElement).value = val;
    el.dispatchEvent(new Event('blur'));
  }, val);
}
export async function setPasswordRepeat(val: string) {
  console.log(`set password repeat "${val}"`);
  await page.$eval('#passwordRepeat', (el, val) => {
    (el as HTMLInputElement).value = val;
    el.dispatchEvent(new Event('blur'));
  }, val);
}
export async function getPasswordRepeat() {
  console.log(`get password repeat`);
  return await page.$eval('#passwordRepeat', (el) => (el as HTMLInputElement).value);
}
export async function setPassword(val: string) {
  console.log(`set password "${val}"`);
  await page.$eval('#password', (el, val) => {
    (el as HTMLInputElement).value = val;
    el.dispatchEvent(new Event('blur'));
  }, val);
}
export async function getPassword() {
  console.log(`get password`);
  return await page.$eval('#password', (el) => (el as HTMLInputElement).value);
}
