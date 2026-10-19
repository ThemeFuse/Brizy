import type { Literal } from "visual/utils/types/Literal";
import type { ChoicesAsync, ChoicesSync, ElementModelValue } from "./types";

export const toElement = (v: Literal): ElementModelValue => ({
  value: v
});

export function isChoicesSync(
  choices: ChoicesSync | ChoicesAsync
): choices is ChoicesSync {
  return Array.isArray(choices);
}
