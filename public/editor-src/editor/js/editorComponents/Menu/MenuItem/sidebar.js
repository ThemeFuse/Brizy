import { t } from "visual/utils/i18n";

export default (level, isMMenu) => {
  return {
    title,
    getItems: isMMenu ? getItemsMMenu(level) : getItemsSimple(level)
  };
};

export const title = t("Menu Items");

export const getItemsSimple = level => () => {
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
            type: "tabs",
            disabled: true
          }
        ]
      : [])
  ];
};

// eslint-disable-next-line no-unused-vars
export const getItemsMMenu = _ => () => {
  return [
    {
      id: "borderRadiusPicker",
      type: "multiPicker",
      devices: "desktop",
      disabled: true
    }
  ];
};
