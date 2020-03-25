import { t } from "visual/utils/i18n";
import { toolbarHoverTransition } from "visual/utils/toolbar";

export const title = t("Counter");

export function getItems({ v, device }) {
  return [
    {
      id: "settingsTabs",
      type: "tabs",
      devices: "desktop",
      align: "start",
      tabs: [
        {
          id: "moreSettingsAdvanced",
          label: t("Advanced"),
          tabIcon: "nc-cog",
          options: [
            toolbarHoverTransition({
              v,
              device,
              state: "normal",
              devices: "desktop",
              position: 100
            })
          ]
        }
      ]
    }
  ];
}
