import { MRead, Reader } from "visual/utils/types/Type";
import { Append, Concat } from "visual/utils/types/Monoid";
import { MValue } from "visual/utils/value";

export type Type = "none" | "inset" | "outset";

export const NONE: Type = "none";
export const INSET: Type = "inset";
export const OUTSET: Type = "outset";
export const types: Type[] = ["none", "inset", "outset"];

/**
 * @deprecated, use fromString
 */
export const read: Reader<Type> = v =>
  types.includes(v as Type) ? (v as Type) : undefined;

export const fromString = (s: string): Type | undefined =>
  types.includes(s as Type) ? (s as Type) : undefined;

export const empty: Type = "none";

export const append: Append<Type> = (a, b) => (a === empty ? b : a);
export const concat: Concat<Type> = as => as.reduce(append, empty);

export const mRead: MRead<Type> = v => read(v) ?? empty;

/**
 * Return undefined if the style is empty, otherwise return the style
 */
export const noEmpty = (v: Type): MValue<Type> => (v === empty ? undefined : v);
