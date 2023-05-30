import { MValue, mApply } from "../value";

/**
 * Check if a number is a valid index of the array.
 * If it is, return the index, otherwise return undefined
 */
export const readIndex = (i: number, arr: unknown[]): MValue<number> =>
  arr[i] !== undefined ? i : undefined;

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
