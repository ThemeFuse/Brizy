import { NumberSpec } from "visual/utils/math/number";
import { StringSpec } from "visual/utils/string/specs";
import type { IsEqual } from "visual/utils/types/Eq";
import type { Reader } from "visual/utils/types/Type";

/**
 * Literal is a value type that allows both string or numeric values
 */

export type Literal = string | number;

export const read: Reader<Literal> = (v) => {
  if (typeof v === "number") {
    return NumberSpec.read(v);
  }

  return StringSpec.read(v);
};

export const eq: IsEqual<Literal> = (a, b) => a === b;

export const is = (v: unknown): v is Literal => !!read(v);
