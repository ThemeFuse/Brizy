import {
  styleElementVideoPaddingRatio,
  styleElementVideoIconFontSize,
  styleElementVideoBgColorRatio,
  styleElementVideoCoverSrc,
  styleElementVideoPointerEvents,
  styleElementVideoCoverPositionX,
  styleElementVideoCoverPositionY,
  styleElementVideoCoverZoom,
  styleElementVideoIconSizeWidth,
  styleElementVideoIconSizeHeight,
  styleElementVideoIconCustomSize,
  styleFilterBrightness,
  styleFilterHue,
  styleFilterSaturation,
  styleFilterContrast
} from "visual/utils/style2";
import { cssStyleColor, cssStyleBgColor } from "visual/utils/cssStyle";

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

export function cssStyleElementVideoPointerEvents() {
  const pointerEvents = styleElementVideoPointerEvents();

  return pointerEvents;
}

export function cssStyleElementVideoBgSize({ v, device, state }) {
  const coverZoom = styleElementVideoCoverZoom({ v, device, state });

  return coverZoom === undefined ? "" : `background-size:${coverZoom}%;`;
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

  return coverSrc === undefined ? "" : `background-image:${coverSrc};`;
}

export function cssStyleElementVideoCoverPosition({ v, device, state }) {
  const positionX = styleElementVideoCoverPositionX({ v, device, state });
  const positionY = styleElementVideoCoverPositionY({ v, device, state });

  return positionX === undefined && positionY === undefined
    ? ""
    : `background-position:${positionX}% ${positionY}%;`;
}

export function cssStyleElementVideoPropertyHoverTransition() {
  return "transition-property: box-shadow, border, border-radius;";
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
