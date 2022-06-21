import { onUndefined } from "visual/utils/value";

export function get<T, K extends keyof T>(k: K, m?: T): T[K] | undefined {
  return m ? m[k] : undefined;
}

export function getOr<T, K extends keyof T>(orElse: T[K], k: K, m?: T): T[K] {
  return onUndefined(get(k, m), orElse);
}

export const prop = <K extends string>(k: K) => <T>(m: Record<K, T>): T => m[k];

export const wrap = <K extends string | number>(k: K) => <T>(
  t: T
  // @ts-expect-error, Need to find why
): { [k in K]: T } => ({ [k]: t });
