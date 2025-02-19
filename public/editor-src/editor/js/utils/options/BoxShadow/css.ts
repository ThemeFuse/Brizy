import { getColor } from "visual/utils/color";
import { CSSStyleFn } from "visual/utils/cssStyle/types";

export const css: CSSStyleFn<"boxShadow"> = ({
  meta,
  value,
  config
}): string => {
  const { isEmpty, isDisabled, isInset } = meta ?? {};

  if (isEmpty || isDisabled) {
    return "box-shadow: none;";
  }

  const { palette, hex, opacity, blur, spread, horizontal, vertical } = value;

  const inset = isInset ? "inset" : "";

  const color = getColor(palette, hex, opacity, config);

  return `box-shadow:${inset} ${horizontal}px ${vertical}px ${blur}px ${spread}px ${color};`;
};
