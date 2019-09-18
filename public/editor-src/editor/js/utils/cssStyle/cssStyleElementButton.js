import {
  styleElementButtonBorderRadius,
  styleElementButtonIconPosition,
  styleElementButtonIconPositionCss,
  styleElementButtonIconCustomSize,
  styleElementButtonIconMargin,
  styleElementIconStrokeWidth
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
  const r =
    iconCustomSize === undefined ? "" : `font-size:${iconCustomSize}px;`;

  return r;
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
    ? `margin-right:${iconMargin}px;`
    : `margin-left:${iconMargin}px;`;
}

export function cssStyleElementIconStrokeWidth({ v, device, state }) {
  const strokeWidth = styleElementIconStrokeWidth({ v, device, state });

  return strokeWidth === undefined ? "" : `stroke-width:${strokeWidth};`;
}

export function cssStyleElementButtonPropertyHoverTransition() {
  return `transition-property: color, box-shadow, background, border-color;`;
}