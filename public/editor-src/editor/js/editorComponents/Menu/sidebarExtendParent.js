import { t } from "visual/utils/i18n";
import { toolbarCustomCSS } from "visual/utils/toolbar";

export const title = t("Menu");

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
            toolbarCustomCSS({
              v,
              device,
              state: "normal",
              devices: "desktop"
            })
          ]
        }
      ]
    }
  ];
}
