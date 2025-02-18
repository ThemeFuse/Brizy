export const isFunction = (v: unknown): v is (...args: unknown[]) => unknown =>
  typeof v === "function";
