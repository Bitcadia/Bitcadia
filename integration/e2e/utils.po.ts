export async function getCurrentPageTitle() {
  return await page.title();
}
export function waitUntil<T>(expression: () => T | Promise<T>, timeout: number = 1000) {
  return new Promise<T>((res, rej) => {
    const interval = (res, rej) => {
      try {
        return Promise.resolve(expression()).then((expressionValue) => {
          if (expressionValue)
            return res(expressionValue);
          else if ((timeout -= 10) < 0)
            return res(expressionValue);
          else
            setTimeout(() => interval(res, rej), 10);
        });
      } catch (e) {
        return rej(e);
      }
    };
    interval(res, rej);
  });
}

