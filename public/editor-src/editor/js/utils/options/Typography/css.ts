import { CSSStyleFn } from "visual/utils/cssStyle/types";
import { TypographyCssValue } from "visual/utils/options/Typography/types";
import { readTextTransformValue } from "./utils";

export const css: CSSStyleFn<"typography"> = ({
  value
}: {
  value: TypographyCssValue;
}): string => {
  const {
    fontFamily,
    fontSize,
    fontSizeSuffix,
    fontWeight: _fontWeight,
    letterSpacing,
    lineHeight,
    variableFontWeight,
    italic,
    bold,
    textDecoration: _textDecoration = "",
    textTransform: _textTransform = ""
  } = value;

  const boldValue = readTextTransformValue(bold, "bold");
  const fontWeight = boldValue || _fontWeight;

  const textStyleValue = readTextTransformValue(italic, "italic");
  const textStyle = textStyleValue ? `font-style:${textStyleValue};` : "";

  const textDecoration = _textDecoration
    ? `text-decoration:${_textDecoration};`
    : "";

  const textTransform = _textTransform
    ? `text-transform:${_textTransform};`
    : "";

  return `font-family:${fontFamily}; font-size:${fontSize}${fontSizeSuffix}; font-weight:${fontWeight}; line-height: ${lineHeight}; letter-spacing:${letterSpacing}; font-variation-settings:${variableFontWeight};${textStyle}${textDecoration}${textTransform}`;
};
