import { cssStyleSizeMinHeightPx } from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "../style2/types";

export function cssStyleColumnHeight({
  v,
  device,
  store,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const heightStyle = dvv("heightStyle");

  if (heightStyle === "custom") {
    return cssStyleSizeMinHeightPx({ v, device, store, state });
  } else {
    return "min-height:100%;";
  }
}

export function cssStyleEmptyColumnHeight({
  v,
  device,
  store,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const heightStyle = dvv("heightStyle");

  if (heightStyle === "custom") {
    return cssStyleSizeMinHeightPx({ v, device, store, state });
  }

  return "";
}

export function cssStyleColumnVerticalAlignItems({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const align = dvv("verticalAlign");
  const heightStyle = dvv("heightStyle");

  // resolve conflicts with older user & margin in negative values
  if (align === "between" || heightStyle === "custom") {
    return "flex-grow: 1; justify-content: inherit;";
  }

  return "";
}
