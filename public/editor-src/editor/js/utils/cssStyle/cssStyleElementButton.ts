import Config from "visual/global/Config";
import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleBorder,
  cssStyleIconMargin,
  cssStyleIconPosition,
  cssStyleStrokeWidth,
  getFillType
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { isStory } from "../models";
import { CSSValue } from "../style2/types";
import { getSize } from "./cssStyleStroke";

export function cssStyleElementButtonIconPosition({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleIconPosition({ v, device, state, prefix: "icon" });
}

export function cssStyleElementButtonIconMargin({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleIconMargin({ v, device, state, prefix: "icon" });
}

export function cssStyleElementButtonIconStrokeWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleStrokeWidth({ v, device, state, prefix: "icon" });
}

export function cssStyleElementButtonSize({ v, device }: CSSValue): string {
  const IS_STORY = isStory(Config.getAll());

  if (IS_STORY) {
    return "padding: 0; align-items: center;";
  }

  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const paddingTB = dvv("paddingTB");
  const paddingRL = dvv("paddingRL");

  const size = getSize(dvv("size"));
  const fillType = getFillType(dvv("fillType"));

  const widths = {
    small: 26,
    medium: 42,
    large: 44,
    custom: paddingRL
  };
  const heights = {
    small: 11,
    medium: 14,
    large: 19,
    custom: paddingTB
  };

  const width = size ? widths[size] : 0;
  const height = size ? heights[size] : 0;

  switch (fillType) {
    case "filled":
    case "outline":
      return `padding: ${height}px ${width}px;`;
    case "default":
      return `padding: ${paddingTB}px 0;`;
    case undefined:
      return "";
  }
}

export function cssStyleElementButtonBgColor({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const fillType = getFillType(dvv("fillType"));

  switch (fillType) {
    case "filled":
      return cssStyleBgColor({ v, device, state });
    case "outline":
      return "background-color: transparent!important;";
    case "default": {
      return "border: 0!important; background-color: transparent!important; box-shadow: none!important;";
    }
    case undefined:
      return "";
  }
}

export function cssStyleElementButtonBgGradient({
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
      return "background: transparent;";
    case undefined:
      return "";
  }
}

export function cssStyleElementButtonBorderStory({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const fillType = getFillType(dvv("fillType"));

  switch (fillType) {
    case "filled":
    case "outline":
      return cssStyleBorder({ v, device, state });
    case "default": {
      return "border: 0; border-radius: 0!important;";
    }
    case undefined:
      return "";
  }
}
