import { defaultValueValue } from "visual/utils/onChange";

export function styleShowOnDesktopFilter({ v }) {
  const showOnDesktop = v.showOnDesktop;

  return showOnDesktop === "on" || showOnDesktop === undefined
    ? ""
    : "blur(3px)";
}

export function styleShowOnDesktopOpacity({ v }) {
  const showOnDesktop = v.showOnDesktop;

  return showOnDesktop === "on" || showOnDesktop === undefined ? 1 : 0.9;
}

export function styleShowOnTabletFilter({ v }) {
  const showOnTablet = v.showOnTablet;

  return showOnTablet === "on" || showOnTablet === undefined ? "" : "blur(3px)";
}

export function styleShowOnTabletOpacity({ v }) {
  const showOnTablet = v.showOnTablet;

  return showOnTablet === "on" || showOnTablet === undefined ? 1 : 0.9;
}

export function styleShowOnMobileFilter({ v }) {
  const showOnMobile = v.showOnMobile;

  return showOnMobile === "on" || showOnMobile === undefined ? "" : "blur(3px)";
}

export function styleShowOnMobileOpacity({ v }) {
  const showOnMobile = v.showOnMobile;

  return showOnMobile === "on" || showOnMobile === undefined ? 1 : 0.9;
}
