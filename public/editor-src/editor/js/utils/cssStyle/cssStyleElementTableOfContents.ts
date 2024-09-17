import {
  cssStyleBgColor,
  cssStyleBorder,
  cssStyleColor,
  cssStylePaddingFourFields,
  cssStyleTextTransforms,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontVariation,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "visual/utils/style2/types";

export function cssStyleElementTOCPropertyHoverTransition(): string {
  return "transition-property: color, background-color, text-shadow, box-shadow, border,height;";
}

// title

export function cssStyleElementTOCHeaderBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "titleBg" });
}

export function cssStyleElementTOCTitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "titleColor" });
}

export function cssStyleElementTOCHeaderBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "header" });
}

export function cssStyleElementTOCHeaderPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "header" });
}

// body

export function cssStyleElementTOCWordWrap({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const wordWrap = dvv("wordWrap");

  const wrappedStyle = `word-break:break-all;`;
  const overflowedStyle = `word-break:initial;overflow-x:auto;`;

  return wordWrap === "on" ? wrappedStyle : overflowedStyle;
}

export function cssStyleElementTOCBodyMarkerColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "markerColor" });
}

export function cssStyleElementTOCBodyMarkerSize({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const markerSize = dvv("markerSize");

  return `font-size:${markerSize}px;`;
}

export function cssStyleElementTOCBodyPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "body" });
}

export function cssStyleElementTOCBodyBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "bodyBg" });
}

export function cssStyleElementTOCBodyColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "bodyColor" });
}

export function cssStyleElementTOCBodyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "body" });
}

export function cssStyleElementTOCBodyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix: "body" });
}

export function cssStyleElementTOCBodyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix: "body" });
}

export function cssStyleElementTOCBodyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix: "body" });
}

export function cssStyleElementTOCBodyLetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({ v, device, state, prefix: "body" });
}

export function cssStyleElementTOCBodyFontVariation({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, prefix: "body" });
}

export function cssStyleElementTOCBodyTextTransform({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, prefix: "body" });
}

export function cssStyleElementTOCBodyBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "body" });
}
