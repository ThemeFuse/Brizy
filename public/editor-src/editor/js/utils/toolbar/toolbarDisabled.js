import { defaultValueKey } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function toolbarDisabledAdvancedSettings({
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "advancedSettings", device, state }),
    type: "advancedSettings",
    devices,
    disabled: true
  };
}

export function toolbarDisabledToolbarSettings({ devices = "all" }) {
  return {
    id: "toolbarSettings",
    type: "popover-dev",
    devices,
    disabled: true
  };
}

export function toolbarDisabledShowOnTablet({ devices = "responsive" }) {
  return {
    id: "showOnTablet",
    type: "toggle",
    disabled: true,
    devices
  };
}

export function toolbarDisabledShowOnMobile({ devices = "responsive" }) {
  return {
    id: "showOnMobile",
    type: "toggle",
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

export function toolbarDisabledDuplicate({ device, devices = "all" }) {
  return {
    id: defaultValueKey({ key: "duplicate", device }),
    type: "button",
    devices,
    disabled: true
  };
}

export function toolbarDisabledRemove({ device, devices = "all" }) {
  return {
    id: defaultValueKey({ key: "remove", device }),
    type: "button",
    devices,
    disabled: true
  };
}

export function toolbarDisabledPadding({ prefix = "", devices = "all" }) {
  const padding = capByPrefix(prefix, "padding");

  return {
    devices,
    id: padding,
    type: "group-dev",
    disabled: true
  };
}

export function toolbarDisabledMargin({ devices = "all" }) {
  return {
    devices,
    id: "margin",
    type: "group-dev",
    disabled: true
  };
}
