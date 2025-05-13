import { cssStyleColor } from "visual/utils/cssStyle";

export function cssStyleElementBreadcrumbsColorActive({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "activeColor"
  });
}

export function cssStyleElementBreadcrumbsColorArrows({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "arrowsColor"
  });
}
