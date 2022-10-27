import Config from "visual/global/Config";
import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleSizeSize,
  cssStyleSpacing
} from "visual/utils/cssStyle";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import { checkValue } from "../checkValue";
import * as Num from "../reader/number";
import { CSSValue } from "../style2/types";

type Size = "small" | "medium" | "large" | "custom";
type FillType = "filled" | "outline" | "default";

const getSize = checkValue<Size>(["small", "medium", "large", "custom"]);
const getFillType = checkValue<FillType>(["filled", "outline", "default"]);

const config = Config.getAll();
const IS_STORY = isStory(config);

export function cssStyleElementIconSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "icon",
    direction: "right"
  });
}

export function cssStyleElementIconSizeStory({
  v,
  device,
  state
}: CSSValue): string {
  return IS_STORY
    ? cssStyleSizeSize({ v, device, state, prefix: "custom" })
    : "";
}

export function cssStyleElementIconPropertyHoverTransition(): string {
  return "transition-property: color, box-shadow, background, border, border-color;";
}

export function cssStyleElementIconPadding({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const fillType = getFillType(dvv("fillType"));
  const padding = dvv("padding");

  if (fillType === "default") {
    return "padding: 0;";
  }

  return `padding: ${padding}${IS_STORY ? "%" : "px"};`;
}

export function cssStyleElementIconBgColor({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const fillType = getFillType(dvv("fillType"));

  switch (fillType) {
    case "filled":
      return cssStyleBgColor({ v, device, state });
    case "outline":
      return "background: transparent;";
    case "default":
      return "border: 0; background: transparent; box-shadow: initial;";
    case undefined:
      return "";
  }
}

export function cssStyleElementIconBgGradient({
  v,
  device,
  state,
  prefix
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const fillType = getFillType(dvv("fillType"));

  switch (fillType) {
    case "filled":
      return cssStyleBgGradient({ v, device, state, prefix });
    case "outline":
    case "default":
      return "background-image: transparent;";
    case undefined:
      return "";
  }
}

export function cssStyleElementIconStrokeWidth({
  v,
  device
}: CSSValue): string {
  const getStrokeWidth = (size: Size, customSize: number): number => {
    switch (size) {
      case "small":
        return 1.1;
      case "medium":
        return 1.4;
      case "large":
        return 2.3;

      case "custom":
        return customSize <= 24
          ? 1
          : customSize > 24 && customSize <= 32
          ? 1.1
          : customSize > 32 && customSize <= 48
          ? 1.4
          : customSize > 48 && customSize <= 64
          ? 2.3
          : customSize > 64
          ? 3
          : 1;
    }
  };

  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const customSize = Num.read(dvv("customSize"));
  const size = getSize(dvv("size"));
  const type = dvv("type");

  if (type === "outline" && customSize && size) {
    return `stroke-width: ${getStrokeWidth(size, customSize)};`;
  }

  return "stroke-width: 1;";
}
