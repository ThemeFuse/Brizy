import { inRange } from "visual/utils/math";
import * as Value from "visual/utils/value";
import { MRead, Reader } from "visual/utils/types/Type";
import { mCompose, MValue } from "visual/utils/value";
import { NumberSpec } from "visual/utils/math/number";
import { Append, Concat } from "visual/utils/types/Monoid";

/**
 *  * Converts a value to valid CSS opacity value
 *  - Value should be a number
 *  - Value should be >= 0
 *  - Value should be <= 1
 *  - If value is not valid, return orElse value
 */
export const read: Reader<number> = mCompose(
  n => (inRange(0, 1, n) ? n : undefined),
  NumberSpec.read
);

export const empty = 0;

export const append: Append<number> = (a, b) => (a === empty ? b : a);
export const concat: Concat<number> = as => as.reduce(append, empty);

export const mRead: MRead<number> = v => read(v) ?? empty;

/**
 * Converts a value to valid CSS opacity value
 *  - Value should be a number
 *  - Value should be >= 0
 *  - Value should be <= 1
 *  - If value is not valid, return orElse value
 *
 * @param {number} orElse
 * @param {*} v
 * @returns {number}
 * @deprecated, use read function instead
 */
export const toOpacity = (v: unknown, orElse = undefined): MValue<number> =>
  read(v) ?? orElse;

/**
 * Check if value is a valid opacity type and if it is not 0
 * - If value is a non empty opacity value, return value
 * - If value is empty, return orElse
 *
 * @param {number} orElse
 * @param {number} v
 * @return {number}
 * @deprecated, use composition of mRead and append
 */
export const onEmpty = (v: unknown, orElse = undefined): MValue<number> =>
  Value.onEmpty(empty, mRead(v), orElse);
