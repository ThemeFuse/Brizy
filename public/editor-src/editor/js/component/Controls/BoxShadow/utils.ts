import { MValue } from "visual/utils/value";
import { Value } from "visual/component/Controls/BoxShadow/types";

export const getModifiedField = (
  [b1, s1, v1, h1]: number[],
  [b2, s2, v2, h2]: number[]
): MValue<keyof Value> => {
  return b1 !== b2
    ? "blur"
    : s1 !== s2
    ? "spread"
    : v1 !== v2
    ? "vertical"
    : h1 !== h2
    ? "horizontal"
    : undefined;
};
