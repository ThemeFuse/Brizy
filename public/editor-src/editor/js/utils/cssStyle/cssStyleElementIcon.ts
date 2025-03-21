import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleSizeSize,
  cssStyleSpacing
} from "visual/utils/cssStyle";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import { checkValue } from "../checkValue";
import { CSSValue } from "../style2/types";

type FillType = "filled" | "outline" | "default";

export const getFillType = checkValue<FillType>([
  "filled",
  "outline",
  "default"
]);

export function cssStyleElementIconSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "icon",
    direction: "right"
  });
}

export function cssStyleElementIconSizeStory({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return isStory(getConfig())
    ? cssStyleSizeSize({ v, device, state, getConfig, store, prefix: "custom" })
    : "";
}

export function cssStyleElementIconPropertyHoverTransition(): string {
  return "transition-property: color, box-shadow, background, border, border-color;";
}

export function cssStyleElementIconPadding({
  v,
  device,
  state,
  getConfig
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const fillType = getFillType(dvv("fillType"));
  const padding = dvv("padding");

  if (fillType === "default") {
    return "padding: 0;";
  }

  const _isStory = isStory(getConfig());

  return `padding: ${padding}${_isStory ? "%" : "px"};`;
}

export function cssStyleElementIconBgColor({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const fillType = getFillType(dvv("fillType"));

  switch (fillType) {
    case "filled":
      return cssStyleBgColor({ v, device, store, getConfig, state });
    case "outline":
      return "background: transparent;";
    case "default":
      return "border: 0!important; background: transparent; box-shadow: none!important;";
    case undefined:
      return "";
  }
}

export function cssStyleElementIconBgGradient({
  v,
  device,
  state,
  getConfig,
  store,
  prefix
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const fillType = getFillType(dvv("fillType"));

  switch (fillType) {
    case "filled":
      return cssStyleBgGradient({ v, device, state, getConfig, store, prefix });
    case "outline":
    case "default":
      return "background-image: none;";
    case undefined:
      return "";
  }
}
