import { fontTransform } from "visual/utils/fonts/transform";

export function makeDefaultFontCSS({ group, font }) {
  const getFont = fontTransform[group];
  const { family } = getFont(font);

  return `.brz .brz-root__container,.brz .brz-popup2,.brz .brz-popup {font-family:${family}!important;}`;
}
