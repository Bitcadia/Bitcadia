export const enum EventEnum {
  CompositionEvent,
  FocusEvent,
  KeyboardEvent,
  MSGestureEvent,
  MouseEvent,
  OverflowEvent,
  SVGZoomEvent,
  TextEvent,
  TouchEvent,
}
export function waitUntil<T>(expression: () => T | Promise<T>, options: { timeout: number, polling: number }) {
  return new Promise<T>((res, rej) => {
    const interval = (res, rej) => {
      try {
        return Promise.resolve(expression()).then((expressionValue) => {
          if (expressionValue)
            return res(expressionValue);
          else if ((options.timeout -= 10) < 0)
            return res(expressionValue);
          else
            setTimeout(() => interval(res, rej), options.polling);
        });
      } catch (e) {
        return rej(e);
      }
    };
    interval(res, rej);
  });
}
export async function setProperty<T extends HTMLElement, K extends keyof T = keyof T>(selector: string, prop: K, val: any) {
  await page.waitForSelector(selector);
  await page.focus(selector);
  await page.$eval(selector, (el, args) => {
    return (el as T)[args[0] as K] = args[1];
  }, [prop, val]);
}
export async function getProperty<T extends HTMLElement, TRet = string, K extends keyof T = keyof T>(selector: string, prop: K): Promise<TRet extends string ? TRet : T[K]> {
  await page.waitForSelector(selector);
  await page.focus(selector);
  const propertyVal = await page.$eval(selector, (el, args) => {
    return (el as T)[args[0]];
  }, [prop]) as any as Promise<T[K]>;
  return (<any>propertyVal) as TRet extends string ? TRet : T[K];
}
export async function setAttribute<T extends HTMLElement>(selector: string, attr: string, val: any) {
  await page.waitForSelector(selector);
  await page.focus(selector);
  await page.$eval(selector, (el, args) => {
    return (el as T).setAttribute(args[0], args[1]);
  }, [attr, val]);
}
export async function getAttribute<T extends HTMLElement>(selector: string, attr: string) {
  await page.waitForSelector(selector);
  await page.focus(selector);
  const attrVal = await page.$eval(selector, (el, prop) => {
    return (el as T).getAttribute(prop);
  }, attr);
  return attrVal || "";
}
export async function waitforText(selector: string, search: string) {
  return await waitUntil(async () => {
    const text = await getProperty(selector, "textContent");
    return text && text.includes(search) && text;
  }, { polling: 100, timeout: 1000 });
}
export async function dispatchEvent<T extends HTMLElement>(selector: string, event?: string, eventEnum?: EventEnum) {
  await page.waitForSelector(selector);
  await page.focus(selector);
  const inputArgs: [string?, EventEnum?] = [event, eventEnum];
  await page.$eval(selector, (el, args: typeof inputArgs) => {
    let event: Event = null as any as Event;
    switch (args[1]) {
      case EventEnum.CompositionEvent:
        if (args[0])
          event = new CompositionEvent(args[0]);
        break;
      case EventEnum.FocusEvent:
        if (args[0])
          event = new FocusEvent(args[0]);
        break;
      case EventEnum.KeyboardEvent:
        if (args[0])
          event = new KeyboardEvent(args[0]);
        break;
      case EventEnum.MSGestureEvent:
        event = new MSGestureEvent();
        break;
      case EventEnum.MouseEvent:
        if (args[0])
          event = new MouseEvent(args[0]);
        break;
      case EventEnum.OverflowEvent:
        event = new OverflowEvent();
        break;
      case EventEnum.SVGZoomEvent:
        event = new SVGZoomEvent();
        break;
      case EventEnum.TextEvent:
        event = new TextEvent();
        break;
      case EventEnum.TouchEvent:
        if (args[0])
          event = new TouchEvent(args[0]);
        break;
      default:
        if (args[0])
          event = new Event(args[0]);
        break;
    }

    return event && (el as T).dispatchEvent(event);
  }, inputArgs);
}
