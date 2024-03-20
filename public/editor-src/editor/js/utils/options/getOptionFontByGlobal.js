import { getFontStyle } from "visual/utils/fonts";

export function getOptionFontByGlobal(key, value, style, allFontStyles) {
  if (style) {
    const fontStyle = getFontStyle(style, allFontStyles);

    if (fontStyle) {
      return fontStyle[key];
    }
  }

  return value;
}
