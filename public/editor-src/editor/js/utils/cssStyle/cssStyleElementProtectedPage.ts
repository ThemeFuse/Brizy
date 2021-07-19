import { styleColor } from "visual/utils/style2";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "../style2/types";
import { MValue } from "visual/utils/value";

type Get = (k: string) => MValue<unknown>;

export function cssStyleElementProtectedPageAutocompleteColor({
  v,
  device,
  state,
  prefix
}: CSSValue): string {
  const color = styleColor({ v, device, state, prefix });

  return color === undefined
    ? ""
    : `-webkit-text-fill-color:${color} !important;`;
}

export function cssStyleElementProtectedPagePropertyHoverTransition(): string {
  return "transition-property:background-color,color,border,box-shadow;";
}

export function cssStyleElementProtectedPageInputWidth({
  v,
  device
}: CSSValue): string {
  const dvv: Get = key => defaultValueValue({ v, key, device });
  const inputWidth = dvv("inputWidth");

  return `width: ${inputWidth}%;`;
}

export function cssStyleElementProtectedPageInputSpacing({
  v,
  device
}: CSSValue): string {
  const dvv: Get = key => defaultValueValue({ v, key, device });
  const inputSpacing = dvv("inputSpacing");

  return `grid-gap: ${inputSpacing}px;`;
}

export function cssStyleElementProtectedPageInputHeight({
  v,
  device
}: CSSValue): string {
  const dvv: Get = key => defaultValueValue({ v, key, device });
  const inputHeight = dvv("inputHeight");

  return `padding: ${inputHeight}px;`;
}
