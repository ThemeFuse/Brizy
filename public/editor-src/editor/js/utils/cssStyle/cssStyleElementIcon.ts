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
import { configSelector } from "visual/redux/selectors-new";

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
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "icon",
    direction: "right"
  });
}

export function cssStyleElementIconSizeStory({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return isStory(configSelector(store.getState()))
    ? cssStyleSizeSize({ v, device, state, store, prefix: "custom" })
    : "";
}

export function cssStyleElementIconPropertyHoverTransition(): string {
  return "transition-property: color, box-shadow, background, border, border-color;";
}

export function cssStyleElementIconPadding({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const fillType = getFillType(dvv("fillType"));
  const padding = dvv("padding");

  if (fillType === "default") {
    return "padding: 0;";
  }

  const _isStory = isStory(configSelector(store.getState()))

  return `padding: ${padding}${_isStory ? "%" : "px"};`;
}

export function cssStyleElementIconBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const fillType = getFillType(dvv("fillType"));

  switch (fillType) {
    case "filled":
      return cssStyleBgColor({ v, device, store, state });
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
  store,
  prefix
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const fillType = getFillType(dvv("fillType"));

  switch (fillType) {
    case "filled":
      return cssStyleBgGradient({ v, device, state, store, prefix });
    case "outline":
    case "default":
      return "background-image: none;";
    case undefined:
      return "";
  }
}
