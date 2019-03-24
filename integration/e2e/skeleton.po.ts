export class PageObjectSkeleton {
  constructor() { }
  public async getCurrentPageTitle() {
    return await page.title();
  }

}
