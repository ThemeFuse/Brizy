export type Reader<T> = (v: unknown) => T | undefined;

export type ObjWithUnknowns<K extends string> = {
  [k in K]: unknown;
};
