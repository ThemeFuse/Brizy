import { cssStyleBorderRadius } from "visual/utils/cssStyle/cssStyleBorderRadius";
import { cssStyleBoxShadow } from "visual/utils/cssStyle/cssStyleBoxShadow";
import {
  styleBorderWidthGrouped,
  styleBorderColor,
  styleBorderStyle,
  styleElementWOOGallerySpacing,
  styleElementWOOGalleryBetweenThumbnail
} from "visual/utils/style2";

export function cssStyleElementWOOGalleryBorderThumbnail({ v, device, state }) {
  const borderWidth = styleBorderWidthGrouped({
    v,
    device,
    state,
    prefix: "thumbnail"
  });
  const borderStyle = styleBorderStyle({
    v,
    device,
    state,
    prefix: "thumbnail"
  });
  const borderColor = styleBorderColor({
    v,
    device,
    state,
    prefix: "thumbnail"
  });

  return borderWidth === undefined
    ? ""
    : `border:${borderWidth}px ${borderStyle} ${borderColor};`;
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
  state
}) {
  return cssStyleBoxShadow({ v, device, prefix: "thumbnail", state });
}

export function cssStyleElementWOOGallerySpacing({ v, device, state }) {
  const spacing = styleElementWOOGallerySpacing({ v, device, state });

  return (
    (spacing !== undefined || spacing !== null) && `margin-top: ${spacing}px;`
  );
}

export function cssStyleElementWOOGalleryParrentSize({ v, device, state }) {
  const between = styleElementWOOGalleryBetweenThumbnail({ v, device, state });

  return (
    (between !== undefined || between !== null) &&
    `margin-bottom: -${between}px;`
  );
}

export function cssStyleElementWOOGalleryBetweenThumbnail({
  v,
  device,
  state
}) {
  const between = styleElementWOOGalleryBetweenThumbnail({ v, device, state });

  return (
    (between !== undefined || between !== null) &&
    `margin: 0 ${between}px ${between}px 0;`
  );
}

export function cssStyleElementWOOGalleryThumbnailSize({ v, device, state }) {
  const between = styleElementWOOGalleryBetweenThumbnail({ v, device, state });

  return (
    (between !== undefined || between !== null) &&
    `width: calc(25% - ${(between * 3) / 4}px);`
  );
}
