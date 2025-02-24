import { WithRenderContext } from "visual/providers/RenderProvider";
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
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "titleBg" });
}

export function cssStyleElementTOCTitleColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "titleColor" });
}

export function cssStyleElementTOCHeaderBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, store, prefix: "header" });
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
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "markerColor" });
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
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "bodyBg" });
}

export function cssStyleElementTOCBodyColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "bodyColor" });
}

export function cssStyleElementTOCBodyFontFamily({
  v,
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "body",
    renderContext
  });
}

export function cssStyleElementTOCBodyFontSize({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "body" });
}

export function cssStyleElementTOCBodyLineHeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "body" });
}

export function cssStyleElementTOCBodyFontWeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "body" });
}

export function cssStyleElementTOCBodyLetterSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    prefix: "body"
  });
}

export function cssStyleElementTOCBodyFontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, store, prefix: "body" });
}

export function cssStyleElementTOCBodyTextTransform({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "body" });
}

export function cssStyleElementTOCBodyBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, store, prefix: "body" });
}
