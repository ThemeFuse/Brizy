import { cssStyleMarginAlign, cssStyleSizeWidth } from "visual/utils/cssStyle";
import { CSSValue } from "visual/utils/style2/types";
import { defaultValueValue } from "../onChange";

export function cssStyleElementFacebookWidth({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const facebookType = dvv("facebookType");

  switch (facebookType) {
    case "group":
      return cssStyleSizeWidth({ v, device, state, getConfig, store });
    case "page":
      return cssStyleSizeWidth({
        v,
        device,
        state,
        getConfig,
        store,
        prefix: "page"
      });
  }

  return "";
}

export function cssStyleElementFacebookAlign({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const facebookType = dvv("facebookType");

  return facebookType === "page"
    ? cssStyleMarginAlign({
        v,
        device,
        state,
        getConfig,
        store,
        prefix: "page"
      })
    : cssStyleMarginAlign({ v, device, state, getConfig, store });
}
