import { t } from "visual/utils/i18n";
import {
  toolbarDisabledToolbarSettings,
  toolbarDisabledHorizontalAlign
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";
  return [
    toolbarDisabledHorizontalAlign({ v, device }),
    {
      id: "advancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      icon: "nc-cog",
      options: [
        {
          id: "settingsTabs",
          type: "tabs",
          align: "start",
          tabs: [
            {
              id: "moreSettingsAdvanced",
              label: t("Advanced"),
              tabIcon: "nc-cog",
              options: []
            }
          ]
        }
      ]
    },
    toolbarDisabledToolbarSettings({ device })
  ];
}

export function getItemsForTablet(v) {
  const device = "tablet";

  return [
    toolbarDisabledHorizontalAlign({ v, device }),
    {
      id: "tabletAdvancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      icon: "nc-cog",
      options: [
        {
          id: "settingsTabs",
          type: "tabs",
          align: "start",
          tabs: [
            {
              id: "settingsStyling",
              label: t("Styling"),
              tabIcon: "nc-styling",
              options: []
            },
            {
              id: "moreSettingsAdvanced",
              label: t("Advanced"),
              tabIcon: "nc-cog",
              options: []
            }
          ]
        }
      ]
    },
    toolbarDisabledToolbarSettings({ device })
  ];
}

export function getItemsForMobile(v) {
  const device = "mobile";

  return [
    toolbarDisabledHorizontalAlign({ v, device }),
    {
      id: "mobileAdvancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      icon: "nc-cog",
      options: [
        {
          id: "settingsTabs",
          type: "tabs",
          align: "start",
          tabs: [
            {
              id: "settingsStyling",
              label: t("Styling"),
              tabIcon: "nc-styling",
              options: []
            },
            {
              id: "moreSettingsAdvanced",
              label: t("Advanced"),
              tabIcon: "nc-cog",
              options: []
            }
          ]
        }
      ]
    },
    toolbarDisabledToolbarSettings({ device })
  ];
}
