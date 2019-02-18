import { t } from "visual/utils/i18n";

export function toolbarShowOnDesktop({ v, position = 10 }) {
  return {
    id: "showOnDesktop",
    label: t("Show on Desktop"),
    position,
    type: "switch",
    value: v.showOnDesktop
  };
}

export function toolbarShowOnTablet({ v, position = 10 }) {
  return {
    id: "showOnTablet",
    type: "toggle",
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

export function toolbarShowOnMobile({ v, position = 10 }) {
  return {
    id: "showOnMobile",
    type: "toggle",
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
