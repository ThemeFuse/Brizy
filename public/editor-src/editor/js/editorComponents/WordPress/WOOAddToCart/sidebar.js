import { t } from "visual/utils/i18n";
import { toolbarCustomCSS } from "visual/utils/toolbar";

export const title = t("Woo Add To Cart");

export function getItems({ v, device }) {
  return [
    {
      id: "settingsTabs",
      type: "tabs",
      devices: "desktop",
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
