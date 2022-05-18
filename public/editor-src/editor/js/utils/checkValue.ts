import { Reader } from "./types/Type";
import { pass } from "./fp";

// returns a functions that takes one parameter,
// and checks if this parameter includes in array `ts`
export const checkValue = <T>(ts: T[]): Reader<T> =>
  pass<unknown, T>((t): t is T => ts.includes(t as T));

// returns a functions that takes one parameter,
// and checks if this parameter includes in object `ts`,
// usually used with enums
export const checkValue2 = <T>(ts: Record<string, T>): Reader<T> =>
  pass<unknown, T>((t): t is T => Object.values(ts).includes(t as T));
