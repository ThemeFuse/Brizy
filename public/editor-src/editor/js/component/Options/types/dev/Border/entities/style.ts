import { MRead, Reader } from "visual/utils/types/Type";
import { Append, Concat } from "visual/utils/types/Monoid";
import { MValue } from "visual/utils/value";

/**
 * @typedef {"none"|"solid"|"dashed"|"dotted"} Style
 **/

export const NONE = "none";
export const SOLID = "solid";
export const DASHED = "dashed";
export const DOTTED = "dotted";

export type Style = "none" | "solid" | "dashed" | "dotted";

/**
 * @type {Style[]}
 */
export const styles: Style[] = ["none", "solid", "dashed", "dotted"];

/**
 * Convert a value to valid border style instance
 *  - If value is not a valid boarder style, return undefined
 */
export const read: Reader<Style> = v =>
  styles.includes(v as Style) ? (v as Style) : undefined;

/**
 * Represents board style empty value
 * @type {Style}
 */
export const empty: Style = "none";

/**
 * Convert a value to valid border style instance
 *  - If value is not a valid boarder style, return empty
 */
export const mRead: MRead<Style> = v => read(v) ?? empty;

export const append: Append<Style> = (a, b) => (a === empty ? b : a);

export const concat: Concat<Style> = as => as.reduce(append, empty);

/**
 * Return undefined if the style is empty, otherwise return the style
 */
export const noEmpty = (v: Style): MValue<Style> =>
  v === empty ? undefined : v;
