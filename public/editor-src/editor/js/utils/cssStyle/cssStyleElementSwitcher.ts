import { defaultValueValue } from "visual/utils/onChange";
import {
  styleElementSwitcherSpacing,
  styleElementSwitcherSize,
  styleElementSwitcherWidth
} from "visual/utils/style2";
import { CSSValue } from "../style2/types";

import { cssStyleColor, cssStyleBgColor } from "visual/utils/cssStyle";
import { Reader } from "visual/utils/types/Type";

type IconPositionType = "left" | "top" | "bottom" | "right";
type IconSizeType = "small" | "medium" | "large" | "custom";

export const readIconPosition: Reader<IconPositionType> = v =>
  v === "top" || v === "left" || v === "bottom" || v === "right"
    ? v
    : undefined;
export const readIconSize: Reader<IconSizeType> = v =>
  v === "small" || v === "medium" || v === "large" || v === "custom"
    ? v
    : undefined;

export function cssStyleElementSwitcherBtnIconPosition({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const iconPosition = dvv("iconPosition");
  switch (readIconPosition(iconPosition)) {
    case "left": {
      return "flex-direction: row;";
    }
    case "right": {
      return "flex-direction: row-reverse;";
    }
    case "top": {
      return "flex-direction: column;";
    }
    case "bottom": {
      return "flex-direction: column-reverse;";
    }
    case undefined:
      return "";
  }
}

export function cssStyleElementSwitcherBtnSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const iconPosition = dvv("iconPosition");
  const iconSpacing = dvv("iconSpacing");

  switch (readIconPosition(iconPosition)) {
    case "left": {
      return `margin: 0 ${iconSpacing}px 0 0;`;
    }
    case "right": {
      return `margin: 0 0 0 ${iconSpacing}px;`;
    }
    case "top": {
      return `margin: 0 0 ${iconSpacing}px 0;`;
    }
    case "bottom": {
      return `margin: ${iconSpacing}px 0 0 0;`;
    }
    case undefined:
      return "";
  }
}
export function cssStyleElementSwitcherNav2Width({
  v,
  device,
  state
}: CSSValue): string {
  const size = styleElementSwitcherSize({ v, device, state });
  return `width: ${size * 2}px;`;
}

export function cssStyleElementSwitcherNav2Height({
  v,
  device,
  state
}: CSSValue): string {
  const size = styleElementSwitcherSize({ v, device, state });
  return `height: ${size}px;`;
}

export function cssStyleElementSwitcherNavBeforeBg({
  v,
  device
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state: "active", prefix: "bg" });
}

export function cssStyleElementSwitcherNavSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const spacing = styleElementSwitcherSpacing({ v, device, state });
  return `margin-bottom:${spacing}px;`;
}

export function cssStyleElementSwitcherActiveTextColor({
  v,
  device
}: CSSValue): string {
  return cssStyleColor({ v, device, state: "active", prefix: "color" });
}

export function cssStyleElementSwitcherWidth({
  v,
  device,
  state
}: CSSValue): string {
  return `width: ${styleElementSwitcherWidth({ v, device, state })}px`;
}
export function cssStyleElementSwitcherIcon({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const iconSize = dvv("iconSize");
  const iconCustomSize = dvv("iconCustomSize");

  switch (readIconSize(iconSize)) {
    case "small": {
      return "font-size: 16px;";
    }
    case "medium": {
      return "font-size: 24px;";
    }
    case "large": {
      return "font-size: 32px;";
    }
    case "custom": {
      return `font-size: ${iconCustomSize}px;`;
    }
    case undefined:
      return "";
  }
}
