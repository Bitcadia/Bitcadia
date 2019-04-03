import environment from "./environment";

const url = new URL(window.location.href);
if (url.searchParams.get('noDebug')) {
  Object.defineProperty(environment, 'debug', { get: () => false });
}
if (url.searchParams.get('noTesting')) {
  Object.defineProperty(environment, 'testing', { get: () => false });
}
export function executeInDebug(cb: Function): void {
  if (environment.debug) cb();
}
export function executeInTest(cb: Function): void {
  if (environment.testing) cb();
}
