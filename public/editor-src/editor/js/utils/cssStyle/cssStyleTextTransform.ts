import { readTextTransformValue } from "visual/utils/cssStyle/utils";
import {
  styleTextTransformBold,
  styleTextTransformItalic,
  styleTextTransformTextDecoration,
  styleTextTransformUpperLowerCase,
  styleTextTransformScript
} from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";

export function cssStyleTextBold({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const bold = styleTextTransformBold({ v, device, state, store, prefix });
  const value = readTextTransformValue(bold, "bold");

  return value ? `font-weight:${value};` : "";
}

export function cssStyleTextItalic({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const italic = styleTextTransformItalic({ v, device, state, store, prefix });
  const value = readTextTransformValue(italic, "italic");

  return value ? `font-style:${value};` : "";
}

export function cssStyleTextDecoration({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const decoration = styleTextTransformTextDecoration({
    v,
    device,
    state,
    store,
    prefix
  });

  return decoration ? `text-decoration:${decoration} !important;` : "";
}

export function cssStyleTextUpperLowerCase({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const value =
    styleTextTransformUpperLowerCase({ v, device, state, store, prefix }) ||
    "inherit";

  return value ? `text-transform:${value} !important;` : "";
}

export function cssStyleTextTransforms({
  v,
  device,
  state,
  prefix,
  store
}: CSSValue) {
  const bold = cssStyleTextBold({ v, device, state, prefix, store });
  const italic = cssStyleTextItalic({ v, device, state, prefix, store });
  const decoration = cssStyleTextDecoration({
    v,
    device,
    state,
    prefix,
    store
  });
  const upperLowerCase = cssStyleTextUpperLowerCase({
    v,
    device,
    state,
    store,
    prefix
  });

  return [bold, italic, decoration, upperLowerCase].join("");
}

export function cssStyleTextScript({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const value = styleTextTransformScript({ v, device, state, prefix, store });

  return value ? `display : inline-block; vertical-align:${value};` : "";
}
