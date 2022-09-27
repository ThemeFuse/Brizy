import { defaultValueValue } from "visual/utils/onChange";
import { styleColor } from "../style2";
import { CSSValue } from "../style2/types";
import { cssStyleBgColor } from "./cssStyleBgColor";
import { cssStyleBorder } from "./cssStyleBorder";
import { cssStyleBoxShadow } from "./cssStyleBoxShadow";
import { cssStyleColor } from "./cssStyleColor";
import { cssStyleSizeWidthHeight } from "./cssStyleSize";

//#region FLAG
export function cssStyleElementTranslationFlagSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidthHeight({ v, device, state, prefix: "flag" });
}

export function cssStyleElementTranslationFlagSpacing({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const flagSpacing = dvv("flagSpacing");
  const flagSpacingSuffix = dvv("flagSpacingSuffix");

  return `margin-right: ${flagSpacing}${flagSpacingSuffix};`;
}

// #endregion

//#region TEXT
export function cssStyleElementTranslationTextSpacing({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const textSpacing = dvv("textSpacing");
  const textSpacingSuffix = dvv("textSpacingSuffix");

  return `margin-right: ${textSpacing}${textSpacingSuffix};`;
}
// #endregion

//#region COLORS
export function cssStyleElementTranslationPreviewArrowColorClosed({
  v,
  device,
  state
}: CSSValue): string {
  const color = styleColor({ v, device, state });

  return `border-color: ${color} transparent transparent transparent;`;
}
export function cssStyleElementTranslationPreviewArrowColorOpen({
  v,
  device,
  state
}: CSSValue): string {
  const color = styleColor({ v, device, state });

  return `border-color: transparent transparent ${color} transparent;`;
}

export function cssStyleElementTranslationColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "selectColor" });
}

export function cssStyleElementTranslationBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "selectBg" });
}

export function cssStyleElementTranslationBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "select" });
}

export function cssStyleElementTranslationBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "select" });
}
// #endregion

export function cssStyleElementTranslationPropertyHoverTransition(): string {
  return "transition-property: color, background, border, box-shadow;";
}
