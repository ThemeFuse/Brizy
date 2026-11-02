// T without its index signature
export type KnownKeys<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
      ? never
      : K]: T[K];
};
