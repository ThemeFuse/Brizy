import { Reader } from "visual/utils/types/Type";
import { NumberSpec } from "visual/utils/math/number";
import { mCompose } from "visual/utils/value";
import { inRange } from "visual/utils/math";

export type Rotate = number;

export const read: Reader<Rotate> = mCompose(
  (n: number) => (inRange(-359, 359, n) ? n : undefined),
  NumberSpec.read
);
