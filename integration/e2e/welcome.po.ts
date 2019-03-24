export class PageObjectWelcome {
  constructor() { }
  async getGreeting() {
    await page.waitFor('.jumbotron');
    const jumbotron = await page.$eval('.jumbotron', (el) => el.textContent);
    return await jumbotron;
  }
}
