import { setProperty, getProperty, dispatchEvent, EventEnum, getAttribute, waitUntil } from "./utils.po";
import { delay } from "bluebird";

export declare const enum Selectors {
  topBarHome = "#bitcadia",
  topBarRegisterRestore = "#topBarRegisterRestore",
  topBarLogin = "#topBarLogin",
  topBarLogout = "#topBarLogout",
  topBarSetup = "#topBarSetup",
  modalLogin = "#modalLogin",
  modalLogout = "#modalLogout",
  modalCancel = "#modalCancel",
  modalClear = "#modalClear",
  modalCancelConfirm = "#modalCancelConfirm",
  modalClearConfirm = "#modalClearConfirm",
  modalClearSeed = "#modalClearSeed",
  modalName = "#modalName",
  modalPassword = "#modalPassword",
}

export async function clickHome() {
  console.log(`click home topbar button`);
  await delay(200);
  await page.waitForSelector(Selectors.topBarHome);
  await delay(200);
  await page.click(Selectors.topBarHome);
}

export async function clickTopbarRegister() {
  console.log(`click register restore topbar button`);
  await delay(200);
  await page.waitForSelector(Selectors.topBarRegisterRestore);
  await delay(200);
  await page.click(Selectors.topBarRegisterRestore);
}

export async function clickTopbarLogin() {
  console.log(`click login topbar button`);
  await delay(200);
  await page.waitForSelector(Selectors.topBarLogin);
  await delay(200);
  await page.click(Selectors.topBarLogin);
}

export async function clickTopbarLogout() {
  console.log(`click logout topbar button`);
  await delay(200);
  await page.waitForSelector(Selectors.topBarLogout);
  await delay(200);
  await page.click(Selectors.topBarLogout);
}

export async function clickTopbarSetup() {
  console.log(`click setup topbar button`);
  await delay(200);
  await page.waitForSelector(Selectors.topBarSetup);
  await delay(200);
  await page.click(Selectors.topBarSetup);
}

export async function clickModalLogin() {
  console.log(`click modal login button`);
  await delay(200);
  await page.waitForSelector(Selectors.modalLogin);
  await delay(200);
  await waitUntil(async () => {
    const disabled = await getAttribute(Selectors.modalLogin, "disabled");
    return disabled !== null;
  }, { timeout: 500, polling: 50 });
  await page.click(Selectors.modalLogin);
}

export async function clickModalLogout() {
  console.log(`click modal logout button`);
  await delay(200);
  await page.waitForSelector(Selectors.modalLogout);
  await delay(200);
  await page.click(Selectors.modalLogout);
}

export async function clickModalCancel() {
  console.log(`click modal cancel button`);
  await delay(200);
  await page.waitForSelector(Selectors.modalCancel);
  await delay(200);
  await page.click(Selectors.modalCancel);
}

export async function clickModalClear() {
  console.log(`click modal clear button`);
  await delay(200);
  await page.waitForSelector(Selectors.modalClear);
  await delay(200);
  await page.click(Selectors.modalClear);
}

export async function clickModalCancelConfirm() {
  console.log(`click modal cancel confirm button`);
  await delay(200);
  await page.waitForSelector(Selectors.modalCancelConfirm);
  await delay(200);
  await page.click(Selectors.modalCancelConfirm);
}

export async function clickModalClearConfirm() {
  console.log(`click modal clear confirm button`);
  await delay(200);
  await page.waitForSelector(Selectors.modalClearConfirm);
  await delay(200);
  await page.click(Selectors.modalClearConfirm);
}

export async function setModalName(val: string) {
  console.log(`set modal name "${val}"`);
  await dispatchEvent(Selectors.modalName, "focus", EventEnum.FocusEvent);
  await page.focus("#modalName");
  await setProperty<HTMLInputElement>("#modalName", "value", "");
  await page.keyboard.type(val, { delay: 50 });
  await page.keyboard.press("Tab");
}

export async function getModalName() {
  console.log(`get name`);
  return await getProperty<HTMLInputElement>(Selectors.modalName, "value");
}

export async function setModalPassword(val: string) {
  console.log(`set password "${val}"`);
  await dispatchEvent(Selectors.modalPassword, "focus", EventEnum.FocusEvent);
  await page.focus("#modalPassword");
  await setProperty<HTMLInputElement>("#modalPassword", "value", "");
  await page.keyboard.type(val, { delay: 50 });
  await page.keyboard.press("Tab");
}

export async function getModalPassword() {
  console.log(`get password`);
  return await getProperty<HTMLInputElement>(Selectors.modalPassword, "value");
}
