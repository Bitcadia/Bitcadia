import * as Q from 'bluebird';

export function waitUntil<T>(expression: () => T, timeout: number = 1000) {
  return new Q.Promise<T>((res, rej) => {
    const interval = () => {
      try {
        const expressionValue = expression();
        if (expression())
          return res(expressionValue);
        else if ((timeout -= 10) < 0)
          return res(expressionValue);
        else
          setTimeout(interval, 10);
      } catch (e) {
        return rej(e);
      }
    };
    interval();
  });
}
