import { fontTransform } from "visual/utils/fonts/transform";

export function makeDefaultFontCSS({ group, font }) {
  const getFont = fontTransform[group];
  const { family } = getFont(font);

  return `.brz{font-family:${family}!important;}`;
}
