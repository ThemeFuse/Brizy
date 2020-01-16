import {
  styleAlignFlexVerticalAlign,
  styleAlignFlexHorizontalAlign,
  styleAlignHorizontal
} from "visual/utils/style2";

export function cssStyleFlexVerticalAlign({ v, device, state }) {
  const alignItems = styleAlignFlexVerticalAlign({ v, device, state });

  return alignItems === undefined ? "" : `align-items:${alignItems};`;
}

export function cssStyleFlexHorizontalAlign({ v, device, state }) {
  const alignItems = styleAlignFlexHorizontalAlign({ v, device, state });

  return alignItems === undefined ? "" : `justify-content:${alignItems};`;
}

export function cssStyleContentAlign({ v, device, state }) {
 const contentAlign = styleAlignHorizontal({ v, device, state, prefix: "content" });

  return contentAlign === undefined ? "" : `text-align:${contentAlign};`;
}

export function cssStyleMarginAlign({ v, device, state, prefix = "" }) {
  const aligns = {
    left: "margin-right: auto; margin-left: 0;",
    center: "margin-left: auto; margin-right: auto;",
    right: "margin-left: auto; margin-right: 0;"
  };
  const alignment = styleAlignHorizontal({ v, device, state, prefix });

  return alignment === undefined ? "" : aligns[alignment];
}
