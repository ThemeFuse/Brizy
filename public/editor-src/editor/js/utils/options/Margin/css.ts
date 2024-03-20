import { CSSStyleFn } from "visual/utils/cssStyle/types";

export const css: CSSStyleFn<"margin"> = ({ meta, value }): string => {
  const {
    unit,
    top,
    topUnit,
    right,
    rightUnit,
    bottom,
    bottomUnit,
    left,
    leftUnit
  } = value;

  const { isEmpty, isNoEmptyGrouped, isNoEmptyUngrouped } = meta ?? {};

  if (isEmpty) {
    return "";
  }

  if (isNoEmptyGrouped) {
    return `margin:${top}${unit};`;
  }

  if (isNoEmptyUngrouped) {
    return `margin:${top}${topUnit} ${right}${rightUnit} ${bottom}${bottomUnit} ${left}${leftUnit};`;
  }

  return "margin:0;";
};
