import { ToMeta } from "visual/component/Options/Type";
import { Value } from "visual/utils/options/Border/entities/Value";

export interface Meta {
  isEmpty: boolean;
  isNoEmptyGrouped: boolean;
  isNoEmptyUngrouped: boolean;
}

const isEmpty = (m: Value): boolean =>
  m.topWidth === 0 &&
  m.rightWidth === 0 &&
  m.bottomWidth === 0 &&
  m.leftWidth === 0;

const isNoEmptyGrouped = (m: Value) => m.widthType === "grouped" && m.width > 0;

const isNoEmptyUngrouped = (m: Value) =>
  m.widthType === "ungrouped" &&
  (m.topWidth > 0 || m.rightWidth > 0 || m.bottomWidth > 0 || m.leftWidth > 0);

export const toMeta: ToMeta<"border"> = (m) => ({
  isEmpty: isEmpty(m),
  isNoEmptyGrouped: isNoEmptyGrouped(m),
  isNoEmptyUngrouped: isNoEmptyUngrouped(m)
});
