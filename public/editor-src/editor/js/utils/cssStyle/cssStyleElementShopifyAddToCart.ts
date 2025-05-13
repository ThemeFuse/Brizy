import { getButtonSizes, getSize } from "visual/utils/cssStyle/cssStyleSize";
import { defaultValueValue } from "visual/utils/onChange";
import { styleSizeHeight, styleSizeWidth } from "../style2/styleSize";
import { CSSValue } from "../style2/types";

export function cssStyleElementShopifyAddToCartSize({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const size = getSize(dvv("size"));

  if (!size) {
    return "";
  }

  const { width: _width = 0, height: _height = 0 } = getButtonSizes(size) ?? {};

  const width =
    size === "custom"
      ? styleSizeWidth({ v, device, getConfig, state, store })
      : _width;
  const height =
    size === "custom"
      ? styleSizeHeight({ v, device, getConfig, state, store })
      : _height;

  return `padding: ${height}px ${width}px;`;
}
