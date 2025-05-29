export function singleton<T>(name: string, getValue: () => T): T {
  const thusly = globalThis as any;
  thusly.__singletons ??= {};
  thusly.__singletons[name] ??= getValue();
  return thusly.__singletons[name];
}
