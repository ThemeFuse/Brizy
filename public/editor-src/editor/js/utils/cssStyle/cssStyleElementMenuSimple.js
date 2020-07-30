import { defaultValueValue } from "visual/utils/onChange";
import { styleColor } from "visual/utils/style2";
import { cssStyleColor } from "visual/utils/cssStyle/cssStyleColor";

export function cssStyleElementMenuSimpleItemPadding({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });

  return `margin-right: ${dvv("itemPadding")}px;`;
}

export function cssStyleElementMenuSimpleColorBars({ v, device, state }) {
  const color = styleColor({
    v,
    device,
    state
  });

  return `color: ${color}; background-color: ${color};`;
}

export function cssStyleElementMenuSimpleWidth({ v }) {
  return v.menuName ? "width: auto" : "width: 100%";
}

export function cssStyleElementMenuSimpleActiveColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "activeColor" });
}
