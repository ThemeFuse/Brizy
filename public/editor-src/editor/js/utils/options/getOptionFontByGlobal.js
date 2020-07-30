import { getFontStyle } from "visual/utils/fonts";

export function getOptionFontByGlobal(key, value, style) {
  if (style) {
    const fontStyle = getFontStyle(style);

    if (fontStyle) {
      return fontStyle[key];
    }
  }

  return value;
}
