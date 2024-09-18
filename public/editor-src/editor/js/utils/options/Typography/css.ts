import { CSSStyleFn } from "visual/utils/cssStyle/types";
import { TypographyCssValue } from "visual/utils/options/Typography/types";

export const css: CSSStyleFn<"typography"> = ({
  value
}: {
  value: TypographyCssValue;
}): string => {
  const {
    fontFamily,
    fontSize,
    fontSizeSuffix,
    fontWeight,
    letterSpacing,
    lineHeight,
    variableFontWeight,
    textStyle = "",
    textDecoration = "",
    textTransform = ""
  } = value;

  return `font-family:${fontFamily}; font-size:${fontSize}${fontSizeSuffix}; font-weight:${fontWeight}; line-height: ${lineHeight}; letter-spacing:${letterSpacing}; font-variation-settings:${variableFontWeight};${textStyle}${textDecoration}${textTransform}`;
};
