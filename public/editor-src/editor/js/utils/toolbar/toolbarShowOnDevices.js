import { t } from "visual/utils/i18n";

export function toolbarShowOnTablet({
  v,
  position = 10,
  devices = "all",
  closeTooltip = true
}) {
  return {
    id: "showOnTablet",
    type: "toggle",
    devices,
    position,
    closeTooltip,
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

export function toolbarShowOnMobile({
  v,
  position = 10,
  devices = "all",
  closeTooltip = true
}) {
  return {
    id: "showOnMobile",
    type: "toggle",
    devices,
    position,
    closeTooltip,
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
  devices = "all",
  position = 10,
  closeTooltip = true
}) {
  if (device === "tablet") {
    return toolbarShowOnTablet({ v, position, devices, closeTooltip });
  } else if (device === "mobile") {
    return toolbarShowOnMobile({ v, position, devices, closeTooltip });
  } else {
    return {};
  }
}
