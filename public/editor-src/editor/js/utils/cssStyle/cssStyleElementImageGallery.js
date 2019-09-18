import {
  styleElementImageGalleryGridColumn,
  styleElementImageGallerySpacing
} from "visual/utils/style2";

export function cssStyleElementImageGalleryWidth({ v, device, state }) {
  const spacing = styleElementImageGallerySpacing({
    v,
    device,
    state
  });

  return `width:calc(100% + ${spacing}px);`;
}

export function cssStyleElementImageGalleryMargin({ v, device, state }) {
  const spacing = styleElementImageGallerySpacing({
    v,
    device,
    state
  });

  return `margin:-${spacing / 2}px;`;
}

export function cssStyleElementImageGalleryItemWidth({ v, device, state }) {
  const gridColumn = styleElementImageGalleryGridColumn({ v, device, state });

  return `width:${gridColumn > 1 ? 100 / gridColumn : 100}%;`;
}

export function cssStyleElementImageGalleryItemPadding({ v, device, state }) {
  const spacing = styleElementImageGallerySpacing({
    v,
    device,
    state
  });

  return `padding:${spacing / 2}px;`;
}
