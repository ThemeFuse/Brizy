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
      type: "sidebarTabs-dev",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "settingsTabs",
              type: "tabs-dev",
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
      type: "group-dev",
      options: [
        {
          id: "border",
          type: "corners-dev",
          label: t("Corner"),
          position: 65
        }
      ]
    },
    {
      id: "sidebarTabs",
      type: "sidebarTabs-dev",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "menuPadding",
              type: "padding-dev",
              label: t("Padding"),
              position: 50,
              config: {
                units: ["px"]
              }
            },
            {
              id: "menuBorder",
              type: "corners-dev",
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
      type: "sidebarTabs-dev",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "mMenuPadding",
              type: "padding-dev",
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
