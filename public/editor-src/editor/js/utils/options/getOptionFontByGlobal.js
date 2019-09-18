import { getFontStyle } from "visual/utils/fonts";

export function getOptionFontByGlobal(key, value, style) {
  if (style) {
    const { [key]: newValue } = getFontStyle(style);

    value = newValue;
  }

  return value;
}
