import { getColor } from "visual/utils/color";
import { CSSStyleFn } from "visual/utils/cssStyle/types";

export const css: CSSStyleFn<"colorPicker"> = ({
  value: { palette, hex, opacity },
  config
}): string => {
  const color = getColor(palette, hex, opacity, config);

  if (color) {
    return `color: ${color};`;
  }

  return "";
};
