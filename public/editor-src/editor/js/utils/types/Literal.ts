import { Reader } from "visual/utils/types/Type";
import { NumberSpec } from "visual/utils/math/number";
import { String } from "visual/utils/string/specs";

/**
 * Literal is a value type that allows both string or numeric values
 */

export type Literal = string | number;

export const read: Reader<Literal> = v => {
  if (typeof v === "number") {
    return NumberSpec.read(v);
  }

  return String.read(v);
};
