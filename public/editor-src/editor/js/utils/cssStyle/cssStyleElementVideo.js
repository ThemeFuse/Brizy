import {
  styleElementVideoPaddingRatio,
  styleElementVideoIconFontSize,
  styleElementVideoBgColorRatio,
  styleElementVideoCoverSrc,
  styleElementVideoCoverPositionX,
  styleElementVideoCoverPositionY,
  styleElementVideoCoverZoom,
  styleElementVideoIconSizeWidth,
  styleElementVideoIconSizeHeight,
  styleElementVideoIconCustomSize,
  styleElementVideoBoxShadowOpacity,
  styleElementVideoBoxShadowColorHex,
  styleElementVideoBorderOpacity,
  styleElementVideoBorderColorHex,
  styleFilterBrightness,
  styleFilterHue,
  styleFilterSaturation,
  styleFilterContrast
} from "visual/utils/style2";
import { cssStyleColor, cssStyleBgColor } from "visual/utils/cssStyle";
import { hexToRgba } from "visual/utils/color";

export function cssStyleElementVideoPaddingRatio({ v, device, state }) {
  const paddingRatio = styleElementVideoPaddingRatio({ v, device, state });

  return paddingRatio === undefined ? "" : `padding-top:${paddingRatio};`;
}

export function cssStyleElementVideoFilter({ v, device, state }) {
  const brightness = styleFilterBrightness({ v, device, state });
  const hue = styleFilterHue({ v, device, state });
  const saturation = styleFilterSaturation({ v, device, state });
  const contrast = styleFilterContrast({ v, device, state });

  const empty =
    brightness === undefined &&
    hue === undefined &&
    saturation === undefined &&
    contrast === undefined;

  return empty
    ? ""
    : `filter:brightness(${brightness}%) hue-rotate(${hue}deg) saturate(${saturation}%) contrast(${contrast}%);`;
}

export function cssStyleElementVideoBgSize({ v, device, state }) {
  const coverZoom = styleElementVideoCoverZoom({ v, device, state });

  return coverZoom === undefined ? "" : `background-size:${coverZoom}%;`;
}

export function cssStyleElementVideoIframeFix({ v, device, state }) {
  const boxShadowColorOpacity = styleElementVideoBoxShadowOpacity({
    v,
    device,
    state
  });
  const borderOpacity = styleElementVideoBorderOpacity({ v, device, state });
  const boxShadowColorHex = styleElementVideoBoxShadowColorHex({
    v,
    device,
    state
  });
  const borderColorHex = styleElementVideoBorderColorHex({ v, device, state });

  if (borderOpacity > 0) {
    return `background-color:${hexToRgba(borderColorHex, borderOpacity)};`;
  } else if (boxShadowColorOpacity > 0) {
    return `background-color:${hexToRgba(
      boxShadowColorHex,
      boxShadowColorOpacity
    )};`;
  } else {
    return "background-color:transparent;";
  }
}

export function cssStyleElementVideoIconFontSize({ v, device, state }) {
  const fontSize = styleElementVideoIconFontSize({ v, device, state });

  return fontSize === undefined ? "" : `font-size:${fontSize}px;`;
}

export function cssStyleElementVideoIconWidth({ v, device, state }) {
  const iconSizeWidth = styleElementVideoIconSizeWidth({ v, device, state });

  return iconSizeWidth === undefined ? "" : `width:${iconSizeWidth}px;`;
}

export function cssStyleElementVideoIconHeight({ v, device, state }) {
  const iconSizeHeight = styleElementVideoIconSizeHeight({ v, device, state });

  return iconSizeHeight === undefined ? "" : `height:${iconSizeHeight}px;`;
}

export function cssStyleElementVideoBgColorRatio({ v, device, state }) {
  const backgroundColor = styleElementVideoBgColorRatio({
    v,
    device,
    state
  });

  return backgroundColor === undefined
    ? ""
    : `background-color:${backgroundColor};`;
}

export function cssStyleElementVideoCoverSrc({ v, device, state }) {
  const coverSrc = styleElementVideoCoverSrc({ v, device, state });

  return coverSrc ? `background-image:${coverSrc};` : "";
}

export function cssStyleElementVideoCoverPosition({ v, device, state }) {
  const positionX = styleElementVideoCoverPositionX({ v, device, state });
  const positionY = styleElementVideoCoverPositionY({ v, device, state });

  return positionX === undefined && positionY === undefined
    ? ""
    : `background-position:${positionX}% ${positionY}%;`;
}

export function cssStyleElementVideoPropertyHoverTransition() {
  return "transition-property: border, border-radius, background-color, color, transform;";
}

export function cssStyleElementVideoHoverBoxShadowTransition() {
  return "transition-property: box-shadow;";
}

export function cssStyleVideoControlsBgColor({ v, device, state }) {
  return cssStyleBgColor({ v, device, state, prefix: "controlsBg" });
}

export function cssStyleVideoIconControls({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "iconControlsColor" });
}

export function cssStyleElementVideoControlsIconFontSize({ v, device, state }) {
  const controlsIconCustomSize = styleElementVideoIconCustomSize({
    v,
    device,
    state
  });

  return controlsIconCustomSize === undefined
    ? ""
    : `font-size:${controlsIconCustomSize}px;`;
}

export function cssStyleElementVideoMask() {
  // the -webkit-mask-image: -webkit-radial-gradient(white, black); need only for safari
  // border-radios conflicts with <video> tag elements
  return "-webkit-mask-image: -webkit-radial-gradient(white, black);";
}
