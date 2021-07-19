import { MNullish, isNullish } from "visual/utils/value/index";

export function mPipe<T1>(fn0: () => MNullish<T1>): () => T1 | undefined;
export function mPipe<V0, T1>(
  fn0: (x0: V0) => MNullish<T1>
): (x0: V0) => T1 | undefined;
export function mPipe<V0, V1, T1>(
  fn0: (x0: V0, x1: V1) => MNullish<T1>
): (x0: V0, x1: V1) => T1 | undefined;
export function mPipe<V0, V1, V2, T1>(
  fn0: (x0: V0, x1: V1, x2: V2) => MNullish<T1>
): (x0: V0, x1: V1, x2: V2) => T1 | undefined;

export function mPipe<T1, T2>(
  fn0: () => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>
): () => T2 | undefined;
export function mPipe<V0, T1, T2>(
  fn0: (x0: V0) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>
): (x0: V0) => T2 | undefined;
export function mPipe<V0, V1, T1, T2>(
  fn0: (x0: V0, x1: V1) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>
): (x0: V0, x1: V1) => T2 | undefined;
export function mPipe<V0, V1, V2, T1, T2>(
  fn0: (x0: V0, x1: V1, x2: V2) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>
): (x0: V0, x1: V1, x2: V2) => T2 | undefined;

export function mPipe<T1, T2, T3>(
  fn0: () => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>
): () => T3 | undefined;
export function mPipe<V0, T1, T2, T3>(
  fn0: (x: V0) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>
): (x: V0) => T3 | undefined;
export function mPipe<V0, V1, T1, T2, T3>(
  fn0: (x0: V0, x1: V1) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>
): (x0: V0, x1: V1) => T3 | undefined;
export function mPipe<V0, V1, V2, T1, T2, T3>(
  fn0: (x0: V0, x1: V1, x2: V2) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>
): (x0: V0, x1: V1, x2: V2) => T3 | undefined;

export function mPipe<T1, T2, T3, T4>(
  fn0: () => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>
): () => T4 | undefined;
export function mPipe<V0, T1, T2, T3, T4>(
  fn0: (x: V0) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>
): (x: V0) => T4 | undefined;
export function mPipe<V0, V1, T1, T2, T3, T4>(
  fn0: (x0: V0, x1: V1) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>
): (x0: V0, x1: V1) => T4 | undefined;
export function mPipe<V0, V1, V2, T1, T2, T3, T4>(
  fn0: (x0: V0, x1: V1, x2: V2) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>
): (x0: V0, x1: V1, x2: V2) => T4 | undefined;

export function mPipe<T1, T2, T3, T4, T5>(
  fn0: () => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>
): () => T5 | undefined;
export function mPipe<V0, T1, T2, T3, T4, T5>(
  fn0: (x: V0) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>
): (x: V0) => T5 | undefined;
export function mPipe<V0, V1, T1, T2, T3, T4, T5>(
  fn0: (x0: V0, x1: V1) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>
): (x0: V0, x1: V1) => T5 | undefined;
export function mPipe<V0, V1, V2, T1, T2, T3, T4, T5>(
  fn0: (x0: V0, x1: V1, x2: V2) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>
): (x0: V0, x1: V1, x2: V2) => T5 | undefined;

export function mPipe<T1, T2, T3, T4, T5, T6>(
  fn0: () => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>
): () => T6 | undefined;
export function mPipe<V0, T1, T2, T3, T4, T5, T6>(
  fn0: (x: V0) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>
): (x: V0) => T6 | undefined;
export function mPipe<V0, V1, T1, T2, T3, T4, T5, T6>(
  fn0: (x0: V0, x1: V1) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>
): (x0: V0, x1: V1) => T6 | undefined;
export function mPipe<V0, V1, V2, T1, T2, T3, T4, T5, T6>(
  fn0: (x0: V0, x1: V1, x2: V2) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>
): (x0: V0, x1: V1, x2: V2) => T6 | undefined;

export function mPipe<T1, T2, T3, T4, T5, T6, T7>(
  fn0: () => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn: (x: T6) => MNullish<T7>
): () => T7 | undefined;
export function mPipe<V0, T1, T2, T3, T4, T5, T6, T7>(
  fn0: (x: V0) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn: (x: T6) => MNullish<T7>
): (x: V0) => T7 | undefined;
export function mPipe<V0, V1, T1, T2, T3, T4, T5, T6, T7>(
  fn0: (x0: V0, x1: V1) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn6: (x: T6) => MNullish<T7>
): (x0: V0, x1: V1) => T7 | undefined;
export function mPipe<V0, V1, V2, T1, T2, T3, T4, T5, T6, T7>(
  fn0: (x0: V0, x1: V1, x2: V2) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn6: (x: T6) => MNullish<T7>
): (x0: V0, x1: V1, x2: V2) => T7 | undefined;

export function mPipe<T1, T2, T3, T4, T5, T6, T7, T8>(
  fn0: () => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn6: (x: T6) => MNullish<T7>,
  fn: (x: T7) => MNullish<T8>
): () => T8 | undefined;
export function mPipe<V0, T1, T2, T3, T4, T5, T6, T7, T8>(
  fn0: (x: V0) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn6: (x: T6) => MNullish<T7>,
  fn: (x: T7) => MNullish<T8>
): (x: V0) => T8 | undefined;
export function mPipe<V0, V1, T1, T2, T3, T4, T5, T6, T7, T8>(
  fn0: (x0: V0, x1: V1) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn6: (x: T6) => MNullish<T7>,
  fn7: (x: T7) => MNullish<T8>
): (x0: V0, x1: V1) => T8 | undefined;
export function mPipe<V0, V1, V2, T1, T2, T3, T4, T5, T6, T7, T8>(
  fn0: (x0: V0, x1: V1, x2: V2) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn6: (x: T6) => MNullish<T7>,
  fn7: (x: T7) => MNullish<T8>
): (x0: V0, x1: V1, x2: V2) => T8 | undefined;

export function mPipe<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  fn0: () => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn6: (x: T6) => MNullish<T7>,
  fn7: (x: T7) => MNullish<T8>,
  fn8: (x: T8) => MNullish<T9>
): () => T9 | undefined;
export function mPipe<V0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  fn0: (x0: V0) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn6: (x: T6) => MNullish<T7>,
  fn7: (x: T7) => MNullish<T8>,
  fn8: (x: T8) => MNullish<T9>
): (x0: V0) => T9 | undefined;
export function mPipe<V0, V1, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  fn0: (x0: V0, x1: V1) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn6: (x: T6) => MNullish<T7>,
  fn7: (x: T7) => MNullish<T8>,
  fn8: (x: T8) => MNullish<T9>
): (x0: V0, x1: V1) => T9 | undefined;
export function mPipe<V0, V1, V2, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  fn0: (x0: V0, x1: V1, x2: V2) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn6: (x: T6) => MNullish<T7>,
  fn7: (x: T7) => MNullish<T8>,
  fn8: (x: T8) => MNullish<T9>
): (x0: V0, x1: V1, x2: V2) => T9 | undefined;

export function mPipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  fn0: () => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn6: (x: T6) => MNullish<T7>,
  fn7: (x: T7) => MNullish<T8>,
  fn8: (x: T8) => MNullish<T9>,
  fn9: (x: T9) => MNullish<T10>
): () => T10 | undefined;
export function mPipe<V0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  fn0: (x0: V0) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn6: (x: T6) => MNullish<T7>,
  fn7: (x: T7) => MNullish<T8>,
  fn8: (x: T8) => MNullish<T9>,
  fn9: (x: T9) => MNullish<T10>
): (x0: V0) => T10 | undefined;
export function mPipe<V0, V1, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  fn0: (x0: V0, x1: V1) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn6: (x: T6) => MNullish<T7>,
  fn7: (x: T7) => MNullish<T8>,
  fn8: (x: T8) => MNullish<T9>,
  fn9: (x: T9) => MNullish<T10>
): (x0: V0, x1: V1) => T10 | undefined;
export function mPipe<V0, V1, V2, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  fn0: (x0: V0, x1: V1, x2: V2) => MNullish<T1>,
  fn1: (x: T1) => MNullish<T2>,
  fn2: (x: T2) => MNullish<T3>,
  fn3: (x: T3) => MNullish<T4>,
  fn4: (x: T4) => MNullish<T5>,
  fn5: (x: T5) => MNullish<T6>,
  fn6: (x: T6) => MNullish<T7>,
  fn7: (x: T7) => MNullish<T8>,
  fn8: (x: T8) => MNullish<T9>,
  fn9: (x: T9) => MNullish<T10>
): (x0: V0, x1: V1, x2: V2) => T10 | undefined;
export function mPipe(
  ...[h, ...fns]: [Function, ...Function[]]
): (...args: unknown[]) => unknown {
  return (...args: unknown[]): unknown =>
    fns.reduce((v, fn) => (isNullish(v) ? undefined : fn(v)), h(...args));
}
