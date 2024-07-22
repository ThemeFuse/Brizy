import Config from "visual/global/Config";
import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleBorder,
  cssStyleIconMargin,
  cssStyleIconPosition,
  cssStyleStrokeWidth,
  getFillType,
  getSize
} from "visual/utils/cssStyle";
import { getButtonSizes } from "visual/utils/cssStyle/cssStyleSize";
import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import { isStory } from "../models";
import { CSSValue } from "../style2/types";

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

export function cssStyleElementButtonSize({
  v,
  device,
  prefix = ""
}: CSSValue): string {
  const IS_STORY = isStory(Config.getAll());

  if (IS_STORY) {
    return "padding: 0; align-items: center;";
  }

  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const paddingTB = dvv(capByPrefix(prefix, "paddingTB"));
  const paddingRL = dvv(capByPrefix(prefix, "paddingRL"));

  const size = getSize(dvv(capByPrefix(prefix, "size")));
  const fillType = getFillType(dvv(capByPrefix(prefix, "fillType")));

  if (!size) {
    return "";
  }

  const { width: _width = 0, height: _height = 0 } = getButtonSizes(size) ?? {};

  const width = size === "custom" ? paddingRL : _width;
  const height = size === "custom" ? paddingTB : _height;

  switch (fillType) {
    case "filled":
    case "outline":
    case "default":
      return `padding: ${height}px ${width}px;`;

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
