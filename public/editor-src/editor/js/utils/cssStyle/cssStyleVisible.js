import {
  styleShowOnDesktopFilter,
  styleShowOnDesktopOpacity,
  styleShowOnTabletFilter,
  styleShowOnTabletOpacity,
  styleShowOnMobileFilter,
  styleShowOnMobileOpacity,
  styleDisplayShowOnDesktop,
  styleDisplayShowOnTablet,
  styleDisplayShowOnMobile
} from "visual/utils/style2";

export function cssStyleVisible({ v, device, state }) {
  let desktopFilter;
  let desktopOpacity;
  let tabletFilter;
  let tabletOpacity;
  let mobileFilter;
  let mobileOpacity;
  let desktopPreview;
  let tabletPreview;
  let mobilePreview;
  let r;

  if (IS_EDITOR) {
    if (device === "desktop") {
      desktopFilter = styleShowOnDesktopFilter({ v, device, state });
      desktopOpacity = styleShowOnDesktopOpacity({ v, device, state });
    } else if (device === "tablet") {
      tabletFilter = styleShowOnTabletFilter({ v, device, state });
      tabletOpacity = styleShowOnTabletOpacity({ v, device, state });
    } else {
      mobileFilter = styleShowOnMobileFilter({ v, device, state });
      mobileOpacity = styleShowOnMobileOpacity({ v, device, state });
    }
  } else {
    if (device === "desktop") {
      desktopPreview = styleDisplayShowOnDesktop({ v, device, state });
    } else if (device === "tablet") {
      tabletPreview = styleDisplayShowOnTablet({ v, device, state });
    } else {
      mobilePreview = styleDisplayShowOnMobile({ v, device, state });
    }
  }

  if (IS_EDITOR) {
    if (device === "desktop" && desktopFilter !== "") {
      r = `filter:${desktopFilter};opacity:${desktopOpacity};`;
    } else if (device === "tablet" && tabletFilter !== "") {
      r = `filter:${tabletFilter};opacity:${tabletOpacity};`;
    } else if (device === "mobile" && mobileFilter !== "") {
      r = `filter:${mobileFilter};opacity:${mobileOpacity};`;
    } else {
      r = "";
    }
  } else if (IS_PREVIEW) {
    if (device === "desktop" && desktopPreview === "none") {
      r = `display:${desktopPreview};`;
    } else if (device === "tablet" && tabletPreview === "none") {
      r = `display:${tabletPreview};`;
    } else if (device === "mobile" && mobilePreview === "none") {
      r = `display:${mobilePreview};`;
    } else {
      r = "";
    }
  } else {
    r = "";
  }

  return r;
}

export function cssStyleVisibleMode({ v, device, state, mode = "editor" }) {
  const visible = cssStyleVisible({ v, device, state });

  return (IS_EDITOR && mode === "editor") || (IS_PREVIEW && mode === "preview")
    ? visible
    : "";
}
