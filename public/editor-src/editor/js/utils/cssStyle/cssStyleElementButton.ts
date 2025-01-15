import { Num } from "@brizy/readers";
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
import { NORMAL } from "../stateMode";
import { styleBgBlendGradient, styleBgColorHex } from "../style2";
import { CSSValue } from "../style2/types";

export function cssStyleElementButtonIconPosition({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleIconPosition({ v, device, store, state, prefix: "icon" });
}

export function cssStyleElementButtonIconMargin({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleIconMargin({ v, device, store, state, prefix: "icon" });
}

export function cssStyleElementButtonIconStrokeWidth({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleStrokeWidth({ v, device, store, state, prefix: "icon" });
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
      return `padding: ${height}px ${width}px;`;
    case "default":
      return `padding: ${height}px 0px;`;
    case undefined:
      return "";
  }
}

export function cssStyleElementButtonBgColorStateNORMAL({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleElementButtonBgColor({ v, device, store, state: NORMAL });
}

export function cssStyleElementButtonBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const fillType = getFillType(dvv("fillType"));

  switch (fillType) {
    case "filled":
      return cssStyleBgColor({ v, device, store, state });
    case "outline":
      return "background-color: transparent!important;";
    case "default": {
      return "border: 0!important; background-color: transparent!important; box-shadow: none!important;";
    }
    case undefined:
      return "";
  }
}

export function cssStyleElementButtonBgGradientStateNORMAL({
  v,
  device,
  store,
  prefix
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, store, state: NORMAL, prefix });
}

export function cssStyleElementButtonBgGradient({
  v,
  device,
  store,
  state,
  prefix
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const fillType = getFillType(dvv("fillType"));

  switch (fillType) {
    case "filled":
      return cssStyleBgGradient({ v, device, store, state, prefix });
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

export function cssStyleButtonHoverTransitionDuration({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const hoverDuration =
    Num.read(dvv(capByPrefix(prefix, "hoverDuration"))) ?? 1000;

  return `transition-duration:${hoverDuration / 1000}s;`;
}

export function cssStyleButtonHoverAnimationDuration({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const hoverDuration =
    Num.read(dvv(capByPrefix(prefix, "hoverDuration"))) ?? 1000;

  return `animation-duration:${hoverDuration / 1000}s;`;
}

export const cssStyleElementButtonBgBlendColor = ({
  v,
  device,
  state,
  prefix = "bg"
}: CSSValue): string => {
  const hex = styleBgColorHex({ v, device, state, prefix });

  return `background-color: rgba(${hex}, 1);`;
};

export function cssStyleElementButtonBgBlendGradient({
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
      return cssStyleBgBlendGradient({ v, device, store, state, prefix });
    case "outline":
    case "default":
      return "background: transparent;";
    case undefined:
      return "";
  }
}

export function cssStyleBgBlendGradient({
  v,
  device,
  state,
  store,
  prefix
}: CSSValue): string {
  const bgGradient = styleBgBlendGradient({ v, device, state, store, prefix });
  return `background-image:${bgGradient};`;
}
