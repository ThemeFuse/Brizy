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
  prefix = ""
}: CSSValue): string {
  const bold = styleTextTransformBold({ v, device, state, prefix });
  const value = readTextTransformValue(bold, "bold");

  return value ? `font-weight:${value};` : "";
}

export function cssStyleTextItalic({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const italic = styleTextTransformItalic({ v, device, state, prefix });
  const value = readTextTransformValue(italic, "italic");

  return value ? `font-style:${value};` : "";
}

export function cssStyleTextDecoration({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const decoration = styleTextTransformTextDecoration({
    v,
    device,
    state,
    prefix
  });

  return decoration ? `text-decoration:${decoration} !important;` : "";
}

export function cssStyleTextUpperLowerCase({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const value =
    styleTextTransformUpperLowerCase({ v, device, state, prefix }) || "inherit";

  return value ? `text-transform:${value} !important;` : "";
}

export function cssStyleTextTransforms({ v, device, state, prefix }: CSSValue) {
  const bold = cssStyleTextBold({ v, device, state, prefix });
  const italic = cssStyleTextItalic({ v, device, state, prefix });
  const decoration = cssStyleTextDecoration({ v, device, state, prefix });
  const upperLowerCase = cssStyleTextUpperLowerCase({
    v,
    device,
    state,
    prefix
  });

  return [bold, italic, decoration, upperLowerCase].join("");
}

export function cssStyleTextScript({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const value = styleTextTransformScript({ v, device, state, prefix });

  return value ? `display : inline-block; vertical-align:${value};` : "";
}
