import { MRead, Reader } from "visual/utils/types/Type";
import { mCompose } from "visual/utils/value";
import { NumberSpec } from "visual/utils/math/number";
import { Append, Concat } from "visual/utils/types/Monoid";

/**
 * Convert a value to valid border width instance
 *  - If value is not a valid border width, return undefined
 */
export const read: Reader<number> = mCompose(
  n => (n >= 0 ? n : undefined),
  NumberSpec.read
);

/**
 * Represents board style empty value
 * @type {number}
 */
export const empty = 0;

export const append: Append<number> = (a, b) => (a === empty ? b : a);
export const concat: Concat<number> = as => as.reduce(append, empty);

export const mRead: MRead<number> = v => read(v) ?? empty;
