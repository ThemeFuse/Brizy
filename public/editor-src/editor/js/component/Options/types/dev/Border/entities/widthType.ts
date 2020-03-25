import { MRead, Reader } from "visual/utils/types/Type";
import { Append, Concat } from "visual/utils/types/Monoid";

export type WidthType = "grouped" | "ungrouped";

export const GROUPED: WidthType = "grouped";
export const UNGROUPED: WidthType = "ungrouped";
export const types: WidthType[] = [GROUPED, UNGROUPED];

/**
 * Convert a value to valid border width type instance
 *  - If value is not a valid border width type, return undefined
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
 */
export const mRead: MRead<WidthType> = v => read(v) ?? empty;
