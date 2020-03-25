import { t } from "visual/utils/i18n";
import { toolbarCustomCSS } from "visual/utils/toolbar";
import { defaultValueKey } from "visual/utils/onChange";

export const title = t("Gallery");

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  return [
    {
      id: dvk("settingsTabs"),
      type: "tabs",
      align: "start",
      tabs: [
        {
          id: dvk("settingsStyling"),
          label: t("Styling"),
          tabIcon: "nc-styling",
          options: []
        },
        {
          id: dvk("moreSettingsAdvanced"),
          devices: "desktop",
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
