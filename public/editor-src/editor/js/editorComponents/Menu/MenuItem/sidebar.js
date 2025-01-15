import { t } from "visual/utils/i18n";
import { toolbarDisabledPadding } from "visual/utils/toolbar";

export default (level, isMMenu) => {
  return {
    title,
    getItems: isMMenu ? getItemsMMenu(level) : getItemsSimple(level)
  };
};

export const title = () => t("Menu Items");

export const getItemsSimple =
  (level) =>
  ({ device, state }) => {
    return [
      ...(level < 1
        ? [
            {
              id: "borderRadiusPicker",
              type: "group",
              devices: "desktop",
              disabled: true
            }
          ]
        : []),
      ...(level >= 1
        ? [
            {
              id: "sidebarTabs",
              type: "sidebarTabs",
              disabled: true
            },
            toolbarDisabledPadding({ device, state, prefix: "menu" })
          ]
        : [])
    ];
  };

export const getItemsMMenu =
  () =>
  ({ device, state }) => {
    return [
      {
        id: "borderRadiusPicker",
        type: "group",
        devices: "desktop",
        disabled: true
      },
      toolbarDisabledPadding({ device, state, prefix: "menu" })
    ];
  };
