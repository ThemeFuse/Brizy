import { t } from "visual/utils/i18n";
import { toolbarDisabledPadding } from "visual/utils/toolbar";

export default (level, isMMenu) => {
  return {
    title,
    getItems: isMMenu ? getItemsMMenu(level) : getItemsSimple(level)
  };
};

export const title = t("Menu Items");

export const getItemsSimple = level => ({ device, state }) => {
  return [
    ...(level < 1
      ? [
          {
            id: "borderRadiusPicker",
            type: "multiPicker",
            devices: "desktop",
            disabled: true
          }
        ]
      : []),
    ...(level >= 1
      ? [
          {
            id: "settingsTabs",
            type: "tabs-dev",
            disabled: true
          },
          toolbarDisabledPadding({ device, state, prefix: "menu" })
        ]
      : [])
  ];
};

// eslint-disable-next-line no-unused-vars
export const getItemsMMenu = _ => ({ device, state }) => {
  return [
    {
      id: "borderRadiusPicker",
      type: "multiPicker",
      devices: "desktop",
      disabled: true
    },
    toolbarDisabledPadding({ device, state, prefix: "menu" })
  ];
};
