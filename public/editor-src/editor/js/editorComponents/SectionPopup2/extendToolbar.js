import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarDisabledZIndex,
  toolbarDisabledShowOnDesktop,
  toolbarDisabledShowOnMobile,
  toolbarDisabledShowOnTablet
} from "visual/utils/toolbar";

export function getItems({ device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  return [
    toolbarDisabledShowOnMobile({}),
    toolbarDisabledShowOnTablet({}),
    {
      id: dvk("toolbarSettings"),
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      position: 110,
      devices: "desktop",
      options: [
        {
          id: dvk("advancedSettings"),
          type: "advancedSettings",
          sidebarLabel: t("More Settings"),
          label: t("More Settings"),
          icon: "nc-cog",
          position: 20,
          options: [
            {
              id: dvk("settingsTabs"),
              type: "tabs",
              align: "start",
              tabs: [
                {
                  id: dvk("moreSettingsAdvanced"),
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: [
                    toolbarDisabledZIndex(),
                    toolbarDisabledShowOnDesktop({})
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
