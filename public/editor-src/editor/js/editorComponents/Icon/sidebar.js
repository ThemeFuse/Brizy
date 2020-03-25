import { t } from "visual/utils/i18n";
import { toolbarHoverTransition } from "visual/utils/toolbar";

export const title = t("Icon");

export function getItems({ v, device }) {
  return [
    {
      id: "settingsTabs",
      type: "tabs",
      align: "start",
      devices: "desktop",
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
              position: 100
            })
          ]
        }
      ]
    }
  ];
}
