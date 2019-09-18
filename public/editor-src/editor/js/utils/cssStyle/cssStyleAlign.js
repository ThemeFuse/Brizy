import {
  styleAlignFlexVerticalAlign,
  styleAlignFlexHorizontalAlign,
  styleAlignHorizontalAlign
} from "visual/utils/style2";

export function cssStyleFlexVerticalAlign({ v, device, state }) {
  const alignItems = styleAlignFlexVerticalAlign({ v, device, state });

  return alignItems === undefined ? "" : `align-items:${alignItems};`;
}

export function cssStyleFlexHorizontalAlign({ v, device, state }) {
  const alignItems = styleAlignFlexHorizontalAlign({ v, device, state });

  return alignItems === undefined ? "" : `justify-content:${alignItems};`;
}

export function cssStyleHorizontalAlign({ v, device, state }) {
  const textAlign = styleAlignHorizontalAlign({ v, device, state });

  return textAlign === undefined ? "" : `text-align:${textAlign};`;
}
