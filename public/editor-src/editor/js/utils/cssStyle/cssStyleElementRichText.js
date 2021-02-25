import {
  styleElementRichTextMarginTop,
  styleElementRichTextMarginBottom
} from "visual/utils/style2/styleElementRichText";

export function cssStyleElementRichTextMartinTop({ v, device, state }) {
  const marginTop = styleElementRichTextMarginTop({ v, device, state });

  return marginTop === undefined ? 0 : `margin-top:${marginTop}px !important;`;
}

export function cssStyleElementRichTextMartinBottom({ v, device, state }) {
  const marginBottom = styleElementRichTextMarginBottom({ v, device, state });

  return marginBottom === undefined
    ? 0
    : `margin-bottom:${marginBottom}px !important;`;
}
