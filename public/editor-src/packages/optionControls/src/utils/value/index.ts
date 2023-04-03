import { mPipe, pass } from "fp-utilities";
import { Hex } from "../../types/Hex";

export type MValue<A> = A | undefined;
export type Nullish = undefined | null;
export type MNullish<T> = T | Nullish;

export const isNullish = (v: unknown): v is Nullish =>
  v === undefined || v === null || (typeof v === "number" && Number.isNaN(v));

type MFn<T, R> = (v: T) => MValue<R>;
type MR<T, R> = (v: MNullish<T>) => MValue<R>;

export function mCompose<T1, T2, T3>(
  f2: MFn<T2, T3>,
  f1: MFn<T1, T2>
): MR<T1, T3>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mCompose<R>(...fns: Array<MFn<any, any>>): MFn<any, R> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (v: any): MValue<R> =>
    fns.reduceRight(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r, fn: MFn<any, any>) => (!isNullish(r) ? fn(r) : undefined),
      v
    );
}

export function mApply<T, R>(
  f: (v: T) => MValue<R>,
  v: MNullish<T>
): MValue<R> {
  if (isNullish(v)) {
    return undefined;
  }
  return f(v);
}
// export function pass(predicate: (a: string) => boolean) {
//   return (t: string) => (predicate(t) ? t : undefined);
// }
const hexRegex = /^#(?:[A-Fa-f0-9]{3}){1,2}$/;

export const is = (v: string): v is Hex => hexRegex.test(v);

export const fromString = mPipe(pass(is));
