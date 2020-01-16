import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarDisabledHorizontalAlign,
  toolbarDisabledToolbarSettings
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    toolbarDisabledHorizontalAlign({ v, device }),
    {
      id: defaultValueKey({ key: "advancedSettings", device }),
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

