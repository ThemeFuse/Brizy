import { cssStyleSizeMinHeightPx } from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "../style2/types";

export function cssStyleColumnHeight({
  v,
  device,
  store,
  state,
  getConfig
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const heightStyle = dvv("heightStyle");
  const heightMax = dvv("heightMax");
  const heightMaxSuffix = dvv("heightMaxSuffix");

  switch (heightStyle) {
    case "custom":
      return `${cssStyleSizeMinHeightPx({ v, device, store, state, getConfig })} max-height:none; justify-content: inherit;`;
    case "max-height":
      return `max-height:${heightMax}${heightMaxSuffix}; min-height:unset; justify-content: flex-start;`;
    default:
      return "min-height:100%; max-height:none; justify-content: inherit;";
  }
}

export function cssStyleColumnContainerHeight({ v, device }: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const heightStyle = dvv("heightStyle");
  const heightMax = dvv("heightMax");
  const heightMaxSuffix = dvv("heightMaxSuffix");
  if (heightStyle === "max-height") {
    return `max-height:${heightMax}${heightMaxSuffix};`;
  }

  return "max-height:none;";
}

export function cssStyleEmptyColumnHeight({
  v,
  device,
  store,
  state,
  getConfig
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const heightStyle = dvv("heightStyle");

  if (heightStyle === "custom") {
    return cssStyleSizeMinHeightPx({ v, device, store, state, getConfig });
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
