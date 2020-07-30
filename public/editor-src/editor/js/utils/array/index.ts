import { findIndex as _findIndex } from "underscore";
import { mApply, MValue } from "visual/utils/value";
import { Reader } from "visual/utils/types/Type";
import { onEmpty as _onEmpty } from "visual/utils/value";

export { flatMap } from "./flatMap";

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
  mApply(i => (i || arr.length) - 1, readIndex(i, arr));

/**
 * Return next index to current in array
 * If index is the last, return first index
 */
export const nextIndex = (i: number, arr: Array<unknown>): MValue<number> =>
  mApply(i => (i + 1) % arr.length, readIndex(i, arr));

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

export const map = <A, B>(f: (a: A) => B, arr: A[]): B[] => arr.map(f);

export const filter = <A>(p: (a: A) => boolean, arr: A[]): A[] => arr.filter(p);

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
