import { cssStyleColor } from "visual/utils/cssStyle";

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
