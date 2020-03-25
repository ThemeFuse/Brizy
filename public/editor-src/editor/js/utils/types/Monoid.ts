export type Append<T> = (a: T, b: T) => T;
export type Concat<T> = (ts: Array<T>) => T;

export interface Monoid<T> {
  empty: T;
  append: Append<T>;
  concat: Concat<T>;
}
