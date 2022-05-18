import { MValue } from "visual/utils/value";
import { Value } from "./types";

export const getModifiedField = (
  [b1, v1, h1]: number[],
  [b2, v2, h2]: number[]
): MValue<keyof Value<string, string>> => {
  return b1 !== b2
    ? "blur"
    : v1 !== v2
    ? "vertical"
    : h1 !== h2
    ? "horizontal"
    : undefined;
};
