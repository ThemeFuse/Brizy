import { getColor } from "visual/utils/color";
import { CSSStyleFn } from "visual/utils/cssStyle/types";

// INFO: in old cssStyle style function persists conditions for text shadow type "inset"
// but i didn't find any trace of inset text shadow
export const css: CSSStyleFn<"textShadow"> = ({
  meta,
  value,
  config
}): string => {
  const { isEmpty } = meta ?? {};

  if (isEmpty) {
    return "text-shadow: none;";
  }

  const { palette = "", hex, opacity, horizontal, vertical, blur } = value;

  const color = getColor(palette, hex, opacity, config);

  return `text-shadow:${horizontal}px ${vertical}px ${blur}px  ${color};`;
};
