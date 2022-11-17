import { cssStyleMarginAlign, cssStyleSizeWidth } from "visual/utils/cssStyle";
import { CSSValue } from "visual/utils/style2/types";
import { defaultValueValue } from "../onChange";

export function cssStyleElementFacebookWidth({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const facebookType = dvv("facebookType");

  switch (facebookType) {
    case "group":
      return cssStyleSizeWidth({ v, device, state });
    case "page":
      return cssStyleSizeWidth({ v, device, state, prefix: "page" });
  }

  return "";
}

export function cssStyleElementFacebookAlign({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const facebookType = dvv("facebookType");

  return facebookType === "page"
    ? cssStyleMarginAlign({ v, device, state, prefix: "page" })
    : cssStyleMarginAlign({ v, device, state });
}
