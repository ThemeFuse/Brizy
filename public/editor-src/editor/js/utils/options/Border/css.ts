import { getColor } from "visual/utils/color";
import { CSSStyleFn } from "visual/utils/cssStyle/types";

export const css: CSSStyleFn<"border"> = ({ meta, value, config }): string => {
  const {
    width,
    topWidth,
    rightWidth,
    bottomWidth,
    leftWidth,
    style,
    hex,
    opacity,
    palette
  } = value;

  const { isNoEmptyGrouped, isNoEmptyUngrouped, isEmpty } = meta ?? {};

  if (isEmpty) {
    return "border: none;";
  }

  const color = getColor(palette, hex, opacity, config);

  if (isNoEmptyGrouped) {
    return `border:${width}px ${style} ${color};`;
  }

  if (isNoEmptyUngrouped) {
    return `border-width:${topWidth}px ${rightWidth}px ${bottomWidth}px ${leftWidth}px;border-style:${style};border-color:${color};`;
  }

  return "";
};
