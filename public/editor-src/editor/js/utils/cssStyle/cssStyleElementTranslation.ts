import { defaultValueValue } from "visual/utils/onChange";
import { styleColor } from "../style2";
import { CSSValue } from "../style2/types";
import { cssStyleFlexHorizontalAlign } from "./cssStyleAlign";
import { cssStyleBgColor } from "./cssStyleBgColor";
import { cssStyleBorder } from "./cssStyleBorder";
import { cssStyleBoxShadow } from "./cssStyleBoxShadow";
import { cssStyleColor } from "./cssStyleColor";
import { cssStyleSizeWidthHeight } from "./cssStyleSize";

//#region FLAG
export function cssStyleElementTranslationFlagSize({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleSizeWidthHeight({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "flag"
  });
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
  state,
  getConfig
}: CSSValue): string {
  const color = styleColor({ v, device, state, getConfig });

  return `border-color: ${color} transparent transparent transparent;`;
}
export function cssStyleElementTranslationPreviewArrowColorOpen({
  v,
  device,
  state,
  getConfig
}: CSSValue): string {
  const color = styleColor({ v, device, state, getConfig });

  return `border-color: transparent transparent ${color} transparent;`;
}

export function cssStyleElementTranslationColor({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "selectColor"
  });
}

export function cssStyleElementTranslationBgColor({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "selectBg"
  });
}

export function cssStyleElementTranslationBorder({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "select"
  });
}

export function cssStyleElementTranslationBoxShadow({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "select"
  });
}
// #endregion

export function cssStyleElementTranslationWidth({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const width = dvv("width");
  const suffix = dvv("widthSuffix");

  return `width: ${width}${suffix}!important;min-width:${width}${suffix}!important;`;
}

export function cssStyleElementTranslationAlign({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "select"
  });
}
