import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device, state }) {
  return defaultValueValue({ v, device, state, key: "mMenu" }) === "on"
    ? getItemsMMenu({ v, device, state })
    : getItemsSimple({ v, device, state });
}

export function getItemsSimple() {
  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "settingsTabs",
              type: "tabs",
              config: {
                align: "start"
              },
              devices: "desktop",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  icon: "nc-styling",
                  options: []
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  icon: "nc-cog",
                  options: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "borderRadiusPicker",
      type: "group",
      options: [
        {
          id: "border",
          type: "corners",
          label: t("Corner"),
          position: 65
        }
      ]
    },
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "menuPadding",
              type: "padding",
              label: t("Padding"),
              position: 50,
              config: {
                units: ["px"]
              }
            },
            {
              id: "menuBorder",
              type: "corners",
              label: t("Corner"),
              position: 65
            }
          ]
        }
      ]
    }
  ];
}

export function getItemsMMenu() {
  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "mMenuPadding",
              type: "padding",
              label: t("Padding"),
              position: 50,
              config: {
                units: ["px"]
              }
            }
          ]
        }
      ]
    }
  ];
}
