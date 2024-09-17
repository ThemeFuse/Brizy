import { Str } from "@brizy/readers";
import { mPipe, pass } from "visual/utils/fp";
import type { ReadSymbols } from "visual/utils/options/Symbols/types";
import { isT } from "visual/utils/value";

export const readSymbols: ReadSymbols = mPipe(
  pass(Array.isArray),
  (s) => s.map(Str.read),
  (s) => s.filter(isT)
);
