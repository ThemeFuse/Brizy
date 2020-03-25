import { defaultValueKey } from "visual/utils/onChange";

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

export function toolbarDisabledToolbarSettings({ device, devices = "all" }) {
  return {
    id: defaultValueKey({ key: "toolbarSettings", device }),
    type: "popover",
    devices,
    disabled: true
  };
}

export function toolbarDisabledMedia({ device, state, devices = "all" }) {
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("toolbarMedia"),
    type: "popover",
    devices,
    disabled: true
  };
}

export function toolbarDisabledShowOnDesktop({ devices = "desktop" }) {
  return {
    id: "showOnDesktop",
    type: "switch",
    disabled: true,
    devices
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

export function toolbarDisabledZIndex() {
  return {
    id: "zIndex",
    type: "slider",
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

export function toolbarDisabledPadding({ device, state, devices = "all" }) {
  const dvk = key => defaultValueKey({ key, device, state });
  return {
    id: dvk("padding"),
    devices,
    type: "multiPicker",
    disabled: true
  };
}

export function toolbarDisabledMargin({ device, state, devices = "all" }) {
  const dvk = key => defaultValueKey({ key, device, state });
  return {
    id: dvk("margin"),
    devices,
    type: "multiPicker",
    disabled: true
  };
}
