import { inRange } from "visual/utils/math";
import { NumberSpec } from "visual/utils/math/number";
import type { Reader } from "visual/utils/types/Type";
import { mCompose } from "visual/utils/value";

export type Rotate = number;

export const read: Reader<Rotate> = mCompose(
  (n: number) => (inRange(-359, 359, n) ? n : undefined),
  NumberSpec.read
);
