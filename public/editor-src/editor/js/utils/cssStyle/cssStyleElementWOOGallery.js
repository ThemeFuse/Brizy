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

export function cssStyleElementWOOGalleryBorderThumbnail({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleBorder({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "thumbnail"
  });
}

export function cssStyleElementWOOGalleryBorderRadiusThumbnail({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "thumbnail"
  });
}

export function cssStyleElementWOOGalleryBoxShadowThumbnail({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleBoxShadow({
    v,
    device,
    prefix: "thumbnail",
    state,
    getConfig,
    store
  });
}

export function cssStyleElementWOOGallerySpacing({
  v,
  device,
  getConfig,
  state
}) {
  const spacing = styleElementWOOGallerySpacing({
    v,
    device,
    getConfig,
    state
  });

  return spacing !== undefined || spacing !== null
    ? v.thumbStyle === "bottom"
      ? `margin-top: ${spacing}px;`
      : "margin-top: 0;"
    : "";
}

export function cssStyleElementWOOGalleryParentSize({
  v,
  device,
  getConfig,
  state
}) {
  const between = styleElementWOOGalleryBetweenThumbnail({
    v,
    device,
    getConfig,
    state
  });
  const spacing = styleElementWOOGallerySpacing({
    v,
    device,
    getConfig,
    state
  });

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
  getConfig,
  state
}) {
  const between = styleElementWOOGalleryBetweenThumbnail({
    v,
    device,
    getConfig,
    state
  });

  return between !== undefined || between !== null
    ? v.thumbStyle === "left" || v.thumbStyle === "right"
      ? `margin: 0 ${between}px ${between}px 0;`
      : `margin: 0 ${between}px ${between}px 0;`
    : "";
}

export function cssStyleElementWOOGalleryThumbnailSize({
  v,
  device,
  getConfig,
  state
}) {
  const between = styleElementWOOGalleryBetweenThumbnail({
    v,
    device,
    getConfig,
    state
  });

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
  getConfig,
  state
}) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const thumbStyle = dvv("thumbStyle");
  const minWidth = cssStyleSizeMinWidth({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "thumb"
  });
  const width = cssStyleSizeWidth({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "thumb"
  });

  return thumbStyle === "left" || thumbStyle === "right"
    ? `${minWidth} ${width}`
    : "";
}

export function cssStyleElementWOOGallerySpacingStyleLeftRigth({
  v,
  device,
  getConfig,
  state
}) {
  const spacing = styleElementWOOGallerySpacing({
    v,
    device,
    getConfig,
    state
  });

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
