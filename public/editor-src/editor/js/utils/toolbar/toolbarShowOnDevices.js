import { t } from "visual/utils/i18n";

export function toolbarShowOnDesktop({ v }) {
  return {
    id: "showOnDesktop",
    label: t("Show on Desktop"),
    type: "switch",
    value: v.showOnDesktop
  };
}

export function toolbarShowOnTablet({ v }) {
  return {
    id: "showOnTablet",
    type: "toggle",
    position: 10,
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

export function toolbarShowOnMobile({ v }) {
  return {
    id: "showOnMobile",
    type: "toggle",
    position: 70,
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
