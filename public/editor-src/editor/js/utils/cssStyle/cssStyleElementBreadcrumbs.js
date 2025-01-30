import { cssStyleColor } from "visual/utils/cssStyle";

export function cssStyleElementBreadcrumbsColorActive({
  v,
  device,
  state,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "activeColor"
  });
}

export function cssStyleElementBreadcrumbsColorArrows({
  v,
  device,
  state,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "arrowsColor"
  });
}
