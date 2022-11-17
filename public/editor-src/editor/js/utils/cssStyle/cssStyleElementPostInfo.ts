import { cssStyleColor, cssStyleSpacing } from "visual/utils/cssStyle";
import { defaultValueValue } from "../onChange";
import { CSSValue } from "../style2/types";

export function cssStyleElementPostInfoColorIcons({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "iconsColor"
  });
}

export function cssStyleElementPostInfoSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const large = dvv("large");

  return large === "inline"
    ? cssStyleSpacing({ v, device, state, prefix: "text", direction: "right" })
    : cssStyleSpacing({ v, device, state, prefix: "text", direction: "top" });
}
