import { t } from "visual/utils/i18n";

export function toolbarShowOnDesktop({ v, position = 10, devices = "all" }) {
  return {
    id: "showOnDesktop",
    label: t("Show on Desktop"),
    position,
    type: "switch",
    devices,
    value: v.showOnDesktop
  };
}

export function toolbarShowOnTablet({ v, position = 10, devices = "all" }) {
  return {
    id: "showOnTablet",
    type: "toggle",
    devices,
    position,
    choices: [
      {
        icon: "nc-eye-17",
        title: t("Disable on Tablet"),
        value: "on"
      },
      {
        icon: "nc-eye-ban-18",
        title: t("Enable on Tablet"),
        value: "off"
      }
    ],
    value: v.showOnTablet
  };
}

export function toolbarShowOnMobile({ v, position = 10, devices = "all" }) {
  return {
    id: "showOnMobile",
    type: "toggle",
    devices,
    position,
    choices: [
      {
        icon: "nc-eye-17",
        title: t("Disable on Mobile"),
        value: "on"
      },
      {
        icon: "nc-eye-ban-18",
        title: t("Enable on Mobile"),
        value: "off"
      }
    ],
    value: v.showOnMobile
  };
}

export function toolbarShowOnResponsive({
  v,
  device,
  state,
  devices = "all",
  position = 10
}) {
  if (device === "tablet") {
    return toolbarShowOnTablet({ v, position, devices });
  } else if (device === "mobile") {
    return toolbarShowOnMobile({ v, position, devices });
  } else {
    return {};
  }
}
