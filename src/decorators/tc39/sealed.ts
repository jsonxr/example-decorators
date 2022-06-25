export function sealed<T extends Function>(constructor: T, ...args: any): T | void {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
