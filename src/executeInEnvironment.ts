import environment from "./environment";
export function executeInDebug(cb: Function): void {
  if (environment.debug) cb();
}
export function executeInTest(cb: Function): void {
  if (environment.testing) cb();
}
