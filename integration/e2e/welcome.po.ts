export async function getGreeting() {
  await page.waitFor('.jumbotron');
  return await page.$eval('.jumbotron', (el) => el.textContent);
}
