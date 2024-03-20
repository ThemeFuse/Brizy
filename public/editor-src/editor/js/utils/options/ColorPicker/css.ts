import { getColor } from "visual/utils/color";
import { CSSStyleFn } from "visual/utils/cssStyle/types";

export const css: CSSStyleFn<"colorPicker"> = ({
  value: { palette, hex, opacity }
}): string => {
  const color = getColor(palette, hex, opacity);

  if (color) {
    return `color: ${color};`;
  }

  return "";
};
