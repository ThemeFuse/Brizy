import { CSSStyleFn } from "visual/utils/cssStyle/types";

export const css: CSSStyleFn<"typography"> = ({ value }): string => {
  const {
    fontFamily,
    fontSize,
    fontSizeSuffix,
    fontWeight,
    letterSpacing,
    lineHeight,
    variableFontWeight
  } = value;

  return `font-family:${fontFamily}; font-size:${fontSize}${fontSizeSuffix}; font-weight:${fontWeight}; line-height: ${lineHeight}; letter-spacing:${letterSpacing}; font-variation-settings:${variableFontWeight};`;
};
