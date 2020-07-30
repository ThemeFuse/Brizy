import { Reader } from "visual/utils/types/Type";
import { NumberSpec } from "visual/utils/math/number";
import { String } from "visual/utils/string/specs";
import { IsEqual } from "visual/utils/types/Eq";

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

export const eq: IsEqual<Literal> = (a, b) => a === b;
