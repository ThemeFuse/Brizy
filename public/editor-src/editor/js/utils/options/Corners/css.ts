import { CSSStyleFn } from "visual/utils/cssStyle/types";

export const css: CSSStyleFn<"corners"> = ({ meta, value }): string => {
  const {
    value: corner,
    unit,
    topLeft,
    topLeftUnit,
    topRight,
    topRightUnit,
    bottomLeft,
    bottomLeftUnit,
    bottomRight,
    bottomRightUnit
  } = value;

  const { isGrouped, isUngrouped } = meta ?? {};

  if (isGrouped) {
    return `border-radius:${corner}${unit};`;
  }

  if (isUngrouped) {
    return `border-radius:${topLeft}${topLeftUnit} ${topRight}${topRightUnit} ${bottomRight}${bottomRightUnit} ${bottomLeft}${bottomLeftUnit};`;
  }

  return "";
};
