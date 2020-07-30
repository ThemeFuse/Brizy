import { isNullish, MValue, onUndefined, ToValue } from "visual/utils/value";
import { toArray } from "visual/utils/array";
import { toObject } from "visual/utils/object";

export type Getter<V, M> = (m: M, orElse?: V) => MValue<V>;
export type Setter<V, M> = (v: V, m: M) => M;

/**
 * Return value from model under specific key
 *  - if model is not an object, return orElse
 *  - if model key is missing, return orElse
 *  - if model key is undefined or null, return orElse
 *
 * @param {string} key
 * @param {object} m
 * @param {*} orElse
 * @return {*}
 */
export function get<K extends keyof M, M>(
  key: K,
  m: M,
  orElse?: M[K]
): MValue<M[K]> {
  return onUndefined(m[key], orElse);
}

/**
 * Set value under specific key in model
 *  - if value is undefined or null, return original model
 *
 * @param {string} key
 * @param {*} value
 * @param {object} m
 * @return {object}
 */
export function set<K extends keyof M, M>(key: K, value: M[K], m: M): M {
  return isNullish(value) || value === get<K, M>(key, m)
    ? m
    : { ...toObject(m), [key]: value };
}

/**
 * Apply model to a list of setters
 *
 * @param {[function(m:object, ...a:*):object, args][]} fs
 * @param {object} m
 * @return {object}
 * @deprecated use apply
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export function _apply<M>(fs, m: M): M {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return toArray(fs).reduce((m, [f, ...args]) => (f && f(...args, m)) || m, m);
}

/**
 * Apply model to a list of setters
 *
 * @template V
 * @template M
 *
 * @param {[function(v:V, m:M):M, a:V][]} fs
 * @param {M} m
 * @return {M}
 */
export function apply<V, M>(fs: Array<[Setter<V, M>, V]>, m: M): M {
  return fs.reduce((m, [f, a]) => (f && f(a, m)) || m, m);
}

/**
 * An abstract implementation of a setter.
 * This setter cannot insert value in the model as it is not aware about model signature
 * But takes care of general setter rules:
 *  - If value is not valid, return original model
 *  - If value is equal to current model value, return original model
 *
 * @template {V}
 * @template {M}
 *
 * @param {function(v: *, orElse:V):V} toValue
 * @param {function(model:M, orElse:V):V} getter
 * @param {function(v:V, model:M):M} setter
 * @return {function(v:V, model:M):M}
 */
export function setter<V, M>(
  toValue: ToValue<V>,
  getter: Getter<V, M>,
  setter: Setter<V, M>
): Setter<V, M> {
  return (v, m): M => {
    if (toValue(v) === undefined || getter(m) === v) {
      return m;
    }

    return setter(v, m);
  };
}
