import { defaultValueKey } from "visual/utils/onChange";

export function toolbarDisabledHorizontalAlign({
  device,
  state,
  devices = "all"
}) {
  return {
    id: defaultValueKey({ key: "horizontalAlign", device, state }),
    type: "toggle",
    devices,
    disabled: true
  };
}

export function toolbarDisabledAdvancedSettings({ device, devices = "all" }) {
  return {
    id: defaultValueKey({ key: "advancedSettings", device }),
    type: "advancedSettings",
    devices,
    disabled: true
  };
}

export function toolbarDisabledSettings({ device, devices = "all" }) {
  return {
    id: defaultValueKey({ key: "toolbarSettings", device }),
    type: "popover",
    devices,
    disabled: true
  };
}

export function toolbarDisabledShowOnTablet() {
  return {
    id: "showOnTablet",
    type: "toggle",
    disabled: true
  };
}

export function toolbarDisabledShowOnMobile() {
  return {
    id: "showOnMobile",
    type: "toggle",
    disabled: true
  };
}

export function toolbarDisabledLink({ device, devices = "all" }) {
  return {
    id: defaultValueKey({ key: "toolbarLink", device }),
    type: "popover",
    devices,
    disabled: true
  };
}

export function toolbarDisabledShowOnResponsive({ device }) {
  let r;
  if (device === "tablet") {
    r = toolbarDisabledShowOnTablet();
  } else if (device === "mobile") {
    r = toolbarDisabledShowOnMobile();
  } else {
    r = {};
  }

  return r;
}
