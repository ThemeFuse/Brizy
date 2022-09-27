import { cssStyleColor } from "visual/utils/cssStyle";
import { styleTypography2FontSize } from "visual/utils/style2";

export function cssStyleElementBreadcrumbsArrowSize({ v, device, state }) {
  return `font-size: ${styleTypography2FontSize({ v, device, state }) / 2}px;`;
}

export function cssStyleElementBreadcrumbsColorActive({ v, device, state }) {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "activeColor"
  });
}

export function cssStyleElementBreadcrumbsColorArrows({ v, device, state }) {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "arrowsColor"
  });
}
