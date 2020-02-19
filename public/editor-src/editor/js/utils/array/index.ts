import { mApply, MValue } from "visual/utils/value";

export { flatMap } from "./flatMap";

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
