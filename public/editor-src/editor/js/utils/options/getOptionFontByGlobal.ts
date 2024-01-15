import { getFontStyle } from "visual/utils/fonts";

export function getOptionFontByGlobal(
  key: string,
  value: string,
  style?: string
): string {
  if (style) {
    const fontStyle = getFontStyle(style);

    if (fontStyle) {
      return fontStyle[key];
    }
  }

  return value;
}
