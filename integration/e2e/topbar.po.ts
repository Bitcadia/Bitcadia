export async function clickRegister() {
  console.log(`click register restor topbar button`);
  await page.waitForSelector('#TopBarRegisterRestore');
  await page.click('#TopBarRegisterRestore');
}

export async function clickLogin() {
  console.log(`click register restor topbar button`);
  await page.waitForSelector('#TopBarLogin');
  await page.click('#TopBarLogin');
}

export async function clickLogout() {
  console.log(`click register restor topbar button`);
  await page.waitForSelector('#TopBarLogout');
  await page.click('#TopBarLogout');
}

export async function clickSetup() {
  console.log(`click register restor topbar button`);
  await page.waitForSelector('#TopBarSetup');
  await page.click('#TopBarSetup');
}
