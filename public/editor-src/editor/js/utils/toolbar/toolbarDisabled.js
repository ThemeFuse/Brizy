import { capByPrefix } from "visual/utils/string";

export function toolbarDisabledShowOnTablet({ devices = "responsive" }) {
  return {
    id: "showOnTablet",
    type: "showOnDevice",
    disabled: true,
    devices
  };
}

export function toolbarDisabledShowOnMobile({ devices = "responsive" }) {
  return {
    id: "showOnMobile",
    type: "showOnDevice",
    disabled: true,
    devices
  };
}

export function toolbarDisabledShowOnResponsive({ device }) {
  let r;
  if (device === "tablet") {
    r = toolbarDisabledShowOnTablet({});
  } else if (device === "mobile") {
    r = toolbarDisabledShowOnMobile({});
  } else {
    r = {};
  }

  return r;
}

export function toolbarDisabledPadding({ prefix = "", devices = "all" }) {
  const padding = capByPrefix(prefix, "padding");

  return {
    devices,
    id: padding,
    type: "group",
    disabled: true
  };
}

export function toolbarDisabledMargin({ devices = "all" }) {
  return {
    devices,
    id: "margin",
    type: "group",
    disabled: true
  };
}
