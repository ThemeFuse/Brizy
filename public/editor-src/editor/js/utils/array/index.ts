import { findIndex as _findIndex } from "es-toolkit/compat";
import { insert, removeAt } from "timm";
import { IsEqual } from "visual/utils/types/Eq";
import { Reader } from "visual/utils/types/Type";
import { MValue, onEmpty as _onEmpty, mApply } from "visual/utils/value";

export const flatMap = <T, U>(
  arr: T[],
  callback: (value: T) => U | ReadonlyArray<U>
): U[] =>
  arr.reduce<U[]>((acc, el) => {
    const r = callback(el);

    if (Array.isArray(r)) {
      acc.push(...r);
    } else {
      acc.push(r as U);
    }

    return acc;
  }, []);

export const empty = [];

export const append = <T>(a: T[], b: T[]): T[] => [...a, ...b];

export const concat = <T>(as: T[][]): T[] => as.reduce(append, []);

/**
 * Check is the values is an array.
 *  - if it is, return that value
 *  - otherwise, return an empty array
 *
 * @param a
 * @return {Array}
 */
export function toArray<A>(a: unknown): A[] {
  return Array.isArray(a) ? (a as A[]) : [];
}

/**
 * Return a predefined value in case the array is empty
 *
 * @param {*} orElse
 * @param {array} a
 * @return {array|*}
 */
export function onEmpty<A>(orElse: A[], a: unknown): A[] {
  return toArray(a).length > 0 ? (a as A[]) : orElse;
}

export function drop<T>(i: number, a: Array<T>): Array<T> {
  if (i < 0) {
    return a;
  }

  const t = [...a];
  t.splice(i, 1);

  return t;
}

/**
 * Check if a number is a valid index of the array.
 * If it is, return the index, otherwise return undefined
 */
export const readIndex = (i: number, arr: unknown[]): MValue<number> =>
  arr[i] !== undefined ? i : undefined;

/**
 * Return previous index to current in array
 * If index is 0, return last index
 */
export const prevIndex = (i: number, arr: Array<unknown>): MValue<number> =>
  mApply((i) => (i || arr.length) - 1, readIndex(i, arr));

/**
 * Return next index to current in array
 * If index is the last, return first index
 */
export const nextIndex = (i: number, arr: Array<unknown>): MValue<number> =>
  mApply((i) => (i + 1) % arr.length, readIndex(i, arr));

/**
 * Return index of value in array or undefined
 * @param v
 * @param arr
 */
export function indexOf<T>(v: T, arr: T[]): MValue<number & keyof typeof arr> {
  const i = arr.indexOf(v);

  return i < 0 ? undefined : i;
}

export function pred<T>(v: T, arr: T[]): MValue<T> {
  return arr[prevIndex(indexOf(v, arr) ?? -1, arr) ?? -1];
}

export function succ<T>(v: T, arr: T[]): MValue<T> {
  return arr[nextIndex(indexOf(v, arr) ?? -1, arr) ?? -1];
}

/**
 * Read an array of values of specific type
 *  - if v is not an array, return undefined
 *  - if at least one array item is not the specified type, return undefined
 *
 * @param reader
 * @param v
 */
export const read = <T>(reader: Reader<T>, v: unknown): MValue<T[]> => {
  if (!Array.isArray(v)) {
    return undefined;
  }

  const newArr: T[] = [];

  for (let i = 0; i < v.length; i++) {
    const item = reader(v[i]);

    if (item === undefined) {
      return undefined;
    }

    newArr.push(item);
  }

  return newArr;
};

/**
 * Similar to _.findIndex, but returns undefined instead of -1
 */
export const findIndex = <T>(p: (t: T) => boolean, arr: T[]): MValue<number> =>
  _onEmpty(-1, _findIndex(arr, p), undefined);

/**
 * Finds multiple indexes based on the predicate
 * Similar to findIndex, but returns a list of indexes that satisfy the predicate
 */
export const findIndexes = <T>(p: (t: T) => boolean, arr: T[]): number[] => {
  return arr.reduce((acc, t, i) => {
    if (p(t)) {
      acc.push(i);
    }

    return acc;
  }, [] as number[]);
};

/**
 * Returns a list of specific items from a list, based on provided indexes
 */
export const pick = <T>(indexes: number[], arr: T[]): T[] => {
  return indexes.reduce((acc, i) => {
    if (arr[i] !== undefined) {
      acc.push(arr[i]);
    }

    return acc;
  }, [] as T[]);
};

export function map<A, B>(f: (a: A) => B): (arr: A[]) => B[];
export function map<A, B>(f: (a: A) => B, arr: A[]): B[];
export function map<A, B>(
  ...args: [(a: A) => B] | [(a: A) => B, A[]]
): ((arr: A[]) => B[]) | B[] {
  return args.length === 1
    ? (arr: A[]): B[] => arr.map(args[0])
    : args[1].map(args[0]);
}

export function filter<A, B extends A>(p: (a: A) => a is B): (arr: A[]) => B[];
export function filter<A>(p: (a: A) => boolean): (arr: A[]) => A[];
export function filter<A, B extends A = A>(p: (a: A) => a is B, arr: A[]): B[];
export function filter<A>(p: (a: A) => boolean, arr: A[]): A[];
export function filter<A>(
  ...args: [(a: A) => boolean] | [(a: A) => boolean, A[]]
): ((arr: A[]) => A[]) | A[] {
  return args[1]
    ? args[1].filter(args[0])
    : (arr: A[]): A[] => arr.filter(args[0]);
}

/**
 * Order array items by the order of the provided keys list
 */
export function orderByKeys<T>(by: number[], items: T[]): T[] {
  return by.reduce((acc: T[], value) => {
    const v = items[value];

    if (v) {
      acc.push(v);
    }

    return acc;
  }, []);
}

export function move<T>(from: number, to: number, arr: T[]): T[] {
  if (
    // For empty array return everytime the same array back
    arr.length === 0 ||
    // If indexes are the same, return same array
    from === to ||
    // If 'from' index does not exist, return same array back
    from < 0 ||
    from > arr.length - 1 ||
    // If 'to' index does not exist, return same array back
    to < 0 ||
    to > arr.length ||
    // If 'from' and 'to' indexes have same value, return original array
    arr[from] === arr[to]
  ) {
    return arr;
  }

  const _to = from > to ? to : to + 1;
  const at = from < to ? from : from + 1;

  return removeAt(insert(arr, _to, arr[from]), at);
}

export const fromString = <T>(
  reader: Reader<T>,
  v: string
): Array<T> | undefined => {
  try {
    return read(reader, JSON.parse(v));
  } catch (e) {
    return undefined;
  }
};

export const eq = <T>(eq: IsEqual<T>, a: T[], b: T[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (!eq(a[i], b[i])) {
      return false;
    }
  }

  return true;
};

export const eliminateItems = <T>(arr: T[], toRemove: unknown[]): T[] => {
  return arr.filter((el) => !toRemove.includes(el));
};

export const overwriteMerge = <T>(
  _: Array<T>,
  sourceArray: Array<T>
): Array<T> => sourceArray;
