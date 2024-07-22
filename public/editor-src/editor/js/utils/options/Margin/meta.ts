import { ToMeta } from "visual/component/Options/Type";
import type { Value } from "./types/Value";

export interface Meta {
  isEmpty: boolean;
  isNoEmptyGrouped: boolean;
  isNoEmptyUngrouped: boolean;
}

export const isEmpty = (m: Value): boolean =>
  m.top === 0 && m.right === 0 && m.bottom === 0 && m.left === 0;

const isEqualValues = (m: Value): boolean =>
  m.top === m.bottom && m.top === m.right && m.top === m.left;

export const isNoEmptyGrouped = (m: Value) => m.top > 0 && isEqualValues(m);
const isNoEmptyUngrouped = (m: Value) =>
  m.top !== 0 || m.right !== 0 || m.bottom !== 0 || m.left !== 0;

export const toMeta: ToMeta<"margin"> = (m) => ({
  isEmpty: isEmpty(m),
  isNoEmptyGrouped: isNoEmptyGrouped(m),
  isNoEmptyUngrouped: isNoEmptyUngrouped(m)
});
