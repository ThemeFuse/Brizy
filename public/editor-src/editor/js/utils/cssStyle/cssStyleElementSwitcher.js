import { cssStyleColor } from "visual/utils/cssStyle/cssStyleColor";
import { cssStyleBgColor } from "visual/utils/cssStyle/cssStyleBgColor";
import {
  styleElementSwitcherSpacing,
  styleElementSwitcherSize,
  styleElementSwitcherWidth
} from "visual/utils/style2";

export function cssStyleElementSwitcherNav2Width({ v, device, state }) {
  const size = styleElementSwitcherSize({ v, device, state });
  return `width: ${size * 2}px;`;
}

export function cssStyleElementSwitcherNav2Height({ v, device, state }) {
  const size = styleElementSwitcherSize({ v, device, state });
  return `height: ${size}px;`;
}

export function cssStyleElementSwitcherNavBeforeBg({ v, device }) {
  return cssStyleBgColor({ v, device, state: "active", prefix: "bg" });
}

export function cssStyleElementSwitcherNavSpacing({ v, device, state }) {
  const spacing = styleElementSwitcherSpacing({ v, device, state });
  return `margin-bottom:${spacing}px;`;
}

export function cssStyleElementSwitcherActiveTextColor({ v, device }) {
  return cssStyleColor({ v, device, state: "active", prefix: "color" });
}

export function cssStyleElementSwitcherWidth({ v, device, state }) {
  return `width: ${styleElementSwitcherWidth({ v, device, state })}px`;
}
