import { readTextTransformValue } from "visual/utils/cssStyle/utils";
import {
  styleTextTransformBold,
  styleTextTransformItalic,
  styleTextTransformScript,
  styleTextTransformTextDecoration,
  styleTextTransformUpperLowerCase
} from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";

export function cssStyleTextBold({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const bold = styleTextTransformBold({
    v,
    device,
    state,
    getConfig,
    store,
    prefix
  });
  const value = readTextTransformValue(bold, "bold");

  return value ? `font-weight:${value};` : "";
}

export function cssStyleTextItalic({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const italic = styleTextTransformItalic({
    v,
    device,
    state,
    getConfig,
    store,
    prefix
  });
  const value = readTextTransformValue(italic, "italic");

  return value ? `font-style:${value};` : "font-style:inherit;";
}

export function cssStyleTextDecoration({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const decoration = styleTextTransformTextDecoration({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });

  return decoration
    ? `text-decoration:${decoration} !important;`
    : "text-decoration:inherit !important;";
}

export function cssStyleTextUpperLowerCase({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const value =
    styleTextTransformUpperLowerCase({
      v,
      device,
      state,
      getConfig,
      store,
      prefix
    }) || "inherit";

  return value ? `text-transform:${value} !important;` : "";
}

export function cssStyleTextTransforms({
  v,
  device,
  state,
  prefix,
  getConfig,
  store
}: CSSValue) {
  const bold = cssStyleTextBold({ v, device, state, getConfig, prefix, store });
  const italic = cssStyleTextItalic({
    v,
    device,
    state,
    getConfig,
    prefix,
    store
  });
  const decoration = cssStyleTextDecoration({
    v,
    device,
    state,
    prefix,
    getConfig,
    store
  });
  const upperLowerCase = cssStyleTextUpperLowerCase({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });

  return [bold, italic, decoration, upperLowerCase].join("");
}

export function cssStyleTextScript({
  v,
  device,
  state,
  getConfig,
  store,
  prefix = ""
}: CSSValue): string {
  const value = styleTextTransformScript({
    v,
    device,
    state,
    getConfig,
    prefix,
    store
  });

  return value ? `display : inline-block; vertical-align:${value};` : "";
}
