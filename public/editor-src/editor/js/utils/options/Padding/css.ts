import { CSSStyleFn } from "visual/utils/cssStyle/types";

export const css: CSSStyleFn<"padding"> = ({ meta, value }): string => {
  const { top, topUnit, right, rightUnit, bottom, bottomUnit, left, leftUnit } =
    value;

  const { isEmpty, isNoEmptyGrouped } = meta ?? {};

  if (isEmpty) {
    return "padding:0;";
  }

  if (isNoEmptyGrouped) {
    return `padding:${top}${topUnit};`;
  }

  return `padding:${top}${topUnit} ${right}${rightUnit} ${bottom}${bottomUnit} ${left}${leftUnit};`;
};
