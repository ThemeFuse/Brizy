import { defaultValueValue } from "visual/utils/onChange";
import * as Num from "visual/utils/reader/number";
import { styleColor } from "../style2";
import { CSSValue } from "../style2/types";
import { cssStyleBgColor } from "./cssStyleBgColor";
import { cssStyleBorder } from "./cssStyleBorder";
import { cssStyleBoxShadow } from "./cssStyleBoxShadow";
import { cssStyleColor } from "./cssStyleColor";

// #region WIDTH HEIGHT
export function cssStyleElementTranslationHeight({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const height = Num.read(dvv("height")) ?? 10;
  const heightSuffix = dvv("heightSuffix");

  return `height: ${height}${heightSuffix};`;
}
export function cssStyleElementTranslationWidth({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const width = Num.read(dvv("width")) ?? 30;
  const widthSuffix = dvv("widthSuffix");

  return `width: ${width}${widthSuffix};`;
}
// #endregion

//#region FLAG
export function cssStyleElementTranslationFlagSize({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const flagSize = dvv("flagSize");
  const flagCustomSize = Num.read(dvv("flagCustomSize"));

  switch (flagSize) {
    case "small":
      return "width: 16px;";
    case "medium":
      return "width: 24px;";
    case "large":
      return "width: 32px;";
    default:
      return `width: ${flagCustomSize}px;`;
  }
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
