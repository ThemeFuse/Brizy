import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";

export const title = t("WOORating");

export function getItems({ device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  return [
    {
      id: "settingsTabs",
      type: "tabs-dev",
      config: {
        align: "start"
      },
      tabs: [
        {
          id: dvk("settingsStyling"),
          label: t("Styling"),
          icon: "nc-styling",
          options: []
        },
        {
          id: dvk("moreSettingsAdvanced"),
          label: t("Advanced"),
          icon: "nc-cog",
          options: [
            {
              id: "hoverTransition",
              label: t("Hover Transition"),
              devices: "desktop",
              position: 70,
              type: "slider-dev",
              config: {
                min: 0,
                max: 99,
                units: [{ title: "ms", value: "ms" }]
              }
            }
          ]
        }
      ]
    }
  ];
}
