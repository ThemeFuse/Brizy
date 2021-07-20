import { toArray } from "visual/utils/array";
import { MValue } from "visual/utils/value";
import { Getter } from "visual/utils/model";

export type Patcher<V, M extends P, P> = (v: V, m: M) => MValue<P>;

/**
 * Object patch function
 *  - If value is not a valid, return empty object
 *  - If value is equal to current value, return empty object
 *  - otherwise, return an object containing only the modified key
 *
 * @template V
 * @template M
 * @template R
 *
 * @param {function(model:M, orElse:V):V} getter
 * @param {function(v:V, model:M):R} patcher
 * @return {function(v: V, m: M):R}
 */
export function patcher<V, M extends P, P>(
  getter: Getter<V, M>,
  patcher: Patcher<V, M, P>
): Patcher<V, M, P> {
  return (v, m): undefined | P => (getter(m) === v ? undefined : patcher(v, m));
}

// ================= apply function definition =================================

// Apply with 2 patchers
export function apply<V1, V2, P1, P2, M extends P1 & P2>(
  patchers: [[Patcher<V1, M, P1>, V1], [Patcher<V2, M, P2>, V2]],
  m: M
): MValue<P1 & P2>;

// apply with 3 patchers
export function apply<V1, V2, V3, P1, P2, P3, M extends P1 & P2 & P3>(
  patchers: [
    [Patcher<V1, M, P1>, V1],
    [Patcher<V2, M, P2>, V2],
    [Patcher<V3, M, P3>, V3]
  ],
  m: M
): MValue<P1 & P2 & P3>;

// apply with 4 patchers
export function apply<
  V1,
  V2,
  V3,
  V4,
  P1,
  P2,
  P3,
  P4,
  M extends P1 & P2 & P3 & P4
>(
  patchers: [
    [Patcher<V1, M, P1>, V1],
    [Patcher<V2, M, P2>, V2],
    [Patcher<V3, M, P3>, V3],
    [Patcher<V4, M, P4>, V4]
  ],
  m: M
): MValue<P1 & P2 & P3 & P4>;

/**
 * Cascade apply of an array of patch functions
 *
 * @template V
 * @template M
 * @template R
 *
 * @param {[function(v:V, m:M):R, a][]} patchers
 * @param {M} m
 * @return {R}
 */
export function apply<V, P, M extends P>(
  patchers: Array<[Patcher<V, M, P>, V]>,
  m: M
): MValue<P> {
  const model: M = { ...m };
  return toArray<[Patcher<V, M, P>, V]>(patchers).reduce(
    (r: P, [f, v]: [Patcher<V, M, P>, V]): P =>
      Object.assign(r, f(v, Object.assign(model, r))),
    {} as P
  );
}
// =============================================================================
