import {
  styleSizeWidth,
  styleSizeHeight,
  styleSizeSize,
  styleSizeContainerSize,
  styleSizeSpacing,
  styleSizeTextSpacing
} from "visual/utils/style2";

export function cssStyleSizeWidthPercent({ v, device, state }) {
  const width = styleSizeWidth({ v, device, state });

  return width === undefined ? "" : `width:${width}%;`;
}

export function cssStyleSizeMaxWidthPercent({ v, device, state }) {
  const width = styleSizeWidth({ v, device, state });

  return width === undefined ? "" : `max-width:${width}%;`;
}

export function cssStyleSizeHeightPx({ v, device, state }) {
  return `height:${styleSizeHeight({ v, device, state })}px;`;
}

export function cssStyleSizeMinHeightPx({ v, device, state }) {
  return `min-height:${styleSizeHeight({ v, device, state })}px;`;
}

export function cssStyleSizeMaxWidthSize({ v, device, state }) {
  const size = styleSizeSize({ v, device, state });

  return size !== undefined ? `max-width:${size}%;` : "";
}
export function cssStyleSizeSizePercent({ v, device, state }) {
  const width = styleSizeSize({ v, device, state });

  return width === undefined ? "" : `width:${width}%;`;
}

export function cssStyleSizeMaxWidthContainer({ v, device, state }) {
  const maxWidth = styleSizeContainerSize({ v, device, state });

  return device === "desktop" ? `max-width: ${maxWidth}%;` : "";
}

export function cssStyleSizeSpacing({ v, device, state }) {
  return `margin-right: ${styleSizeSpacing({
    v,
    device,
    state
  })}px;`;
}

export function cssStyleSizeTextSpacing({ v, device, state }) {
  return `margin-right: ${styleSizeTextSpacing({
    v,
    device,
    state
  })}px;`;
}
