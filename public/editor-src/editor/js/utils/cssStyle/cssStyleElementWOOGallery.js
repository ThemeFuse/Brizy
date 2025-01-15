import {
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleSizeMinWidth,
  cssStyleSizeWidth
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import {
  styleElementWOOGalleryBetweenThumbnail,
  styleElementWOOGallerySpacing
} from "visual/utils/style2";

export function cssStyleElementWOOGalleryBorderThumbnail({ v, device, state }) {
  return cssStyleBorder({
    v,
    device,
    state,
    prefix: "thumbnail"
  });
}

export function cssStyleElementWOOGalleryBorderRadiusThumbnail({
  v,
  device,
  state
}) {
  return cssStyleBorderRadius({ v, device, state, prefix: "thumbnail" });
}

export function cssStyleElementWOOGalleryBoxShadowThumbnail({
  v,
  device,
  state,
  store
}) {
  return cssStyleBoxShadow({ v, device, prefix: "thumbnail", state, store });
}

export function cssStyleElementWOOGallerySpacing({ v, device, state }) {
  const spacing = styleElementWOOGallerySpacing({ v, device, state });

  return spacing !== undefined || spacing !== null
    ? v.thumbStyle === "bottom"
      ? `margin-top: ${spacing}px;`
      : "margin-top: 0;"
    : "";
}

export function cssStyleElementWOOGalleryParentSize({ v, device, state }) {
  const between = styleElementWOOGalleryBetweenThumbnail({ v, device, state });
  const spacing = styleElementWOOGallerySpacing({ v, device, state });

  return between !== undefined || between !== null
    ? v.thumbStyle === "bottom"
      ? `margin-bottom: -${between}px;`
      : v.thumbStyle === "top"
        ? `margin-bottom: ${(between - spacing) * -1}px;`
        : "margin-bottom: 0;"
    : "";
}

export function cssStyleElementWOOGalleryBetweenThumbnail({
  v,
  device,
  state
}) {
  const between = styleElementWOOGalleryBetweenThumbnail({ v, device, state });

  return between !== undefined || between !== null
    ? v.thumbStyle === "left" || v.thumbStyle === "right"
      ? `margin: 0 ${between}px ${between}px 0;`
      : `margin: 0 ${between}px ${between}px 0;`
    : "";
}

export function cssStyleElementWOOGalleryThumbnailSize({ v, device, state }) {
  const between = styleElementWOOGalleryBetweenThumbnail({ v, device, state });

  const thumbPerRow =
    v.thumbStyle === "left" || v.thumbStyle === "right"
      ? v.thumbPerRowRL
      : v.thumbPerRowTB;

  return (
    (between !== undefined || between !== null) &&
    `width: calc(${100 / thumbPerRow}% - ${
      (between * (thumbPerRow - 1)) / thumbPerRow
    }px);`
  );
}

export function cssStyleElementWOOGalleryChildStyle({
  v,
  device,
  store,
  state
}) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const thumbStyle = dvv("thumbStyle");
  const minWidth = cssStyleSizeMinWidth({
    v,
    device,
    state,
    store,
    prefix: "thumb"
  });
  const width = cssStyleSizeWidth({ v, device, state, store, prefix: "thumb" });

  return thumbStyle === "left" || thumbStyle === "right"
    ? `${minWidth} ${width}`
    : "";
}

export function cssStyleElementWOOGallerySpacingStyleLeftRigth({
  v,
  device,
  state
}) {
  const spacing = styleElementWOOGallerySpacing({ v, device, state });

  return v.thumbStyle === "left"
    ? `margin-right: ${spacing}px;`
    : v.thumbStyle === "right"
      ? `margin-left: ${spacing}px;`
      : "margin-right:0; margin-left:0;";
}

export function cssStyleElementWOOGalleryZoomReposition({ v }) {
  return v.thumbStyle === "right"
    ? "left: 1rem; right: auto;"
    : v.thumbStyle === "top"
      ? "bottom: 1rem; top: auto;"
      : "";
}
