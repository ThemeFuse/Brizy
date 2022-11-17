import { cssStyleStrokeWidth } from "visual/utils/cssStyle";
import {
  styleElementButtonBorderRadius,
  styleElementButtonIconCustomSize,
  styleElementButtonIconMargin,
  styleElementButtonIconPosition,
  styleElementButtonIconPositionCss
} from "visual/utils/style2";

export function cssStyleElementButtonBorderRadius({ v, device, state }) {
  const borderRadius = styleElementButtonBorderRadius({ v, device, state });

  return borderRadius === undefined ? "" : `border-radius:${borderRadius}px;`;
}

export function cssStyleElementButtonIconPosition({ v, device, state }) {
  const iconPosition = styleElementButtonIconPositionCss({ v, device, state });

  return iconPosition === undefined ? "" : `flex-flow:${iconPosition};`;
}

export function cssStyleElementButtonIconFontSize({ v, device, state }) {
  const iconCustomSize = styleElementButtonIconCustomSize({ v, device, state });

  return iconCustomSize === undefined ? "" : `font-size:${iconCustomSize}px;`;
}

export function cssStyleElementButtonIconMargin({ v, device, state }) {
  const iconPosition = styleElementButtonIconPosition({ v, device, state });
  const iconMargin = styleElementButtonIconMargin({
    v,
    device,
    state
  });

  return iconPosition === undefined || iconMargin === undefined
    ? ""
    : iconPosition === "left"
    ? `margin-right:${iconMargin}px;margin-left:0;`
    : `margin-left:${iconMargin}px;margin-right:0;`;
}

export function cssStyleElementButtonPropertyContentAlign() {
  return "align-items: center; justify-content: center;";
}

export function cssStyleElementButtonIconStrokeWidth({ v, device, state }) {
  return cssStyleStrokeWidth({ v, device, state, prefix: "icon" });
}
