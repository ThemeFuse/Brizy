import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import { toolbarCustomCSS } from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    {
      id: defaultValueKey({
        key: "advancedSettings",
        device,
        state: "normal"
      }),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      devices: "desktop",
      roles: ["admin"],
      icon: "nc-cog",
      options: [
        {
          id: "settingsTabs",
          type: "tabs",
          align: "start",
          tabs: [
            {
              id: defaultValueKey({
                key: "moreSettingsAdvanced",
                device,
                state: "normal"
              }),
              label: t("Advanced"),
              tabIcon: "nc-cog",
              options: []
            }
          ]
        }
      ]
    }
  ];
}
