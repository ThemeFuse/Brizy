import {
  styleAlignFlexVerticalAlign,
  styleAlignFlexHorizontalAlign
} from "visual/utils/style2";

export function cssStyleFlexVerticalAlign({ v, device, state }) {
  const alignItems = styleAlignFlexVerticalAlign({ v, device, state });

  return alignItems === undefined ? "" : `align-items:${alignItems};`;
}

export function cssStyleFlexHorizontalAlign({ v, device, state }) {
  const alignItems = styleAlignFlexHorizontalAlign({ v, device, state });

  return alignItems === undefined ? "" : `justify-content:${alignItems};`;
}
