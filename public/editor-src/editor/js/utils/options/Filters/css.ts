import { CSSStyleFn } from "visual/utils/cssStyle/types";

export const css: CSSStyleFn<"filters"> = ({ meta, value }): string => {
  const { isHalfBrightness, isEmptyHue, isHalfSaturation, isHalfContrast } =
    meta ?? {};

  const { hue, brightness, contrast, saturation } = value;

  if (isHalfBrightness && isEmptyHue && isHalfSaturation && isHalfContrast) {
    return "";
  }

  return `filter:brightness(${brightness}%) hue-rotate(${hue}deg) saturate(${saturation}%) contrast(${contrast}%);`;
};
