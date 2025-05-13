import { defaultValueValue } from "visual/utils/onChange";
import { styleColor } from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";

export function cssStyleElementMenuSimpleItemPadding({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  return `margin-right: ${dvv("itemPadding")}px;`;
}

export function cssStyleElementMenuSimpleColorBars({
  v,
  device,
  state,
  getConfig
}: CSSValue): string {
  const color = styleColor({
    v,
    device,
    state,
    getConfig
  });

  return `background-color: ${color};`;
}

export function cssStyleElementMenuSimpleWidth({ v }: CSSValue): string {
  return v.menuName ? "width: auto;" : "width: 100%;";
}
