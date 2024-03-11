import { MRead, Reader } from "visual/utils/types/Type";
import { Append, Concat } from "visual/utils/types/Monoid";
import { pass } from "visual/utils/fp";

export type WidthType = "grouped" | "ungrouped";

export const GROUPED: WidthType = "grouped";
export const UNGROUPED: WidthType = "ungrouped";
export const types: WidthType[] = [GROUPED, UNGROUPED];

export const is = (s: string): s is WidthType => types.includes(s as WidthType);

export const fromString = pass(is);

/**
 * Convert a value to valid border width type instance
 *  - If value is not a valid border width type, return undefined
 *
 *  @deprecated, use fromString
 */
export const read: Reader<WidthType> = v =>
  types.includes(v as WidthType) ? (v as WidthType) : undefined;

/**
 * Represents board width type empty value
 */
export const empty = GROUPED;

export const append: Append<WidthType> = (a, b) => (a === empty ? b : a);

export const concat: Concat<WidthType> = as => as.reduce(append, empty);

/**
 * Convert a value to valid border width type instance
 *  - If value is not a valid border width type, return empty
 *
 *  @deprecated, use fromString
 */
export const mRead: MRead<WidthType> = v => read(v) ?? empty;
