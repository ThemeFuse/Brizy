import { foldr } from "underscore";

export type MValue<A> = A | undefined;
export type ToValue<A> = (v: unknown, orElse?: A) => MValue<A>;
export type Nullish = undefined | null;
export type MNullish<T> = T | Nullish;

/**
 * Return orElse value in case v parameter is undefined
 *
 * @template T
 *
 * @param {MValue<T>} v
 * @param {T} orElse
 * @return {T}
 */
export function onUndefined<T>(v: MValue<T>, orElse: T): T {
  return undefined === v ? orElse : v;
}

/**
 * Check if value is undefined, null or NaN
 */
export const isNullish = (v: unknown): v is Nullish =>
  v === undefined || v === null || (typeof v === "number" && Number.isNaN(v));

/**
 * Return orElse if value is null or undefined
 */
export function onNullish<T>(orElse: T, v: T | Nullish): T {
  return isNullish(v) ? orElse : v;
}

/**
 * Check if value is not an empty value
 * Empty value is considered undefined, and user specified value
 *  - If value is undefined, return orElse
 *  - If value is equal to specified value, return orElse
 *  - otherwise, return value
 *
 *  @template T
 *
 * @param {T} empty
 * @param {MValue<T>} v
 * @param {MValue<T>} orElse
 * @return {MValue<T>}
 */
export function onEmpty<T>(empty: T, v: MValue<T>, orElse?: T): MValue<T> {
  return !isNullish(v) && v !== empty ? v : orElse;
}

/**
 * Apply function over value if it empty
 */
export function mApply<T, R>(
  f: (v: T) => MValue<R>,
  v: MNullish<T>
): MValue<R> {
  if (isNullish(v)) {
    return undefined;
  }

  return f(v);
}

type MFn<T, R> = (v: T) => MValue<R>;
type MR<T, R> = (v: MNullish<T>) => MValue<R>;

/**
 * Exact as function composition, but allowing function to return a maybe value instead of value
 */
export function mCompose<T1, T2, T3>(
  f2: MFn<T2, T3>,
  f1: MFn<T1, T2>
): MR<T1, T3>;
export function mCompose<T1, T2, T3, T4>(
  f3: MFn<T3, T4>,
  f2: MFn<T2, T3>,
  f1: MFn<T1, T2>
): MR<T1, T4>;
export function mCompose<T1, T2, T3, T4, T5>(
  f4: MFn<T4, T5>,
  f3: MFn<T3, T4>,
  f2: MFn<T2, T3>,
  f1: MFn<T1, T2>
): MR<T1, T5>;
export function mCompose<T1, T2, T3, T4, T5, T6>(
  f5: MFn<T5, T6>,
  f4: MFn<T4, T5>,
  f3: MFn<T3, T4>,
  f2: MFn<T2, T3>,
  f1: MFn<T1, T2>
): MR<T1, T6>;
export function mCompose<T1, T2, T3, T4, T5, T6, T7>(
  f6: MFn<T6, T7>,
  f5: MFn<T5, T6>,
  f4: MFn<T4, T5>,
  f3: MFn<T3, T4>,
  f2: MFn<T2, T3>,
  f1: MFn<T1, T2>
): MR<T1, T7>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mCompose<R>(...fns: Array<MFn<any, any>>): MFn<any, R> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (v: any): MValue<R> =>
    foldr(
      fns,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r, fn: MFn<any, any>) => (!isNullish(r) ? fn(r) : undefined),
      v
    );
}
