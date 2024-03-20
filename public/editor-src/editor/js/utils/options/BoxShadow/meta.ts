import { ToMeta } from "visual/component/Options/Type";
import type { Value } from "./entities/Value";

export interface Meta {
  isEmpty: boolean;
  isDisabled: boolean;
  isInset: boolean;
}

const isDisabled = (m: Value): boolean => m.type === "none";
const isInset = (m: Value): boolean => m.type === "inset";
const isEmpty = (m: Value): boolean =>
  m.horizontal === 0 && m.vertical === 0 && m.blur === 0 && m.spread === 0;

export const toMeta: ToMeta<"boxShadow"> = (m) => ({
  isEmpty: isEmpty(m),
  isDisabled: isDisabled(m),
  isInset: isInset(m)
});
