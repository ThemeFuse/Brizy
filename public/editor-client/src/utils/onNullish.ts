import { isNullish } from "./isNullish";
import { Nullish } from "./types";

export function onNullish<T>(orElse: T, v: T | Nullish): T;
export function onNullish<T>(orElse: T): (v: T | Nullish) => T;
export function onNullish<T>(
  ...args: [T] | [T, T | Nullish]
): T | ((v: T | Nullish) => T) {
  return args.length === 1
    ? (v: T | Nullish): T => (isNullish(v) ? args[0] : v)
    : isNullish(args[1])
    ? args[0]
    : args[1];
}
