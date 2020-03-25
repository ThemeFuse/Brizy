import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import { toolbarCustomCSS, toolbarHoverTransition } from "visual/utils/toolbar";

export const title = t("Post Info");

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
          label: t("Advanced"),
          tabIcon: "nc-cog",
          options: [
            toolbarCustomCSS({ v, devices: "desktop" }),
            toolbarHoverTransition({
              v,
              device,
              state: "normal",
              position: 70,
              devices: "desktop"
            })
          ]
        }
      ]
    }
  ];
}
