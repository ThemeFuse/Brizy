import { FontGroup, FontKeyTypes } from "./getFontById";

export const makeDefaultFontCSS = ({
  font
}: FontGroup<FontKeyTypes>): string => {
  const { family } = font;

  return `.brz .brz-root__container,.brz .brz-popup2,.brz .brz-popup {font-family:${family}!important;}`;
};
