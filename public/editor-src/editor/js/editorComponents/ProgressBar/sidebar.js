import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import { toolbarBorderRadius } from "visual/utils/toolbar";

export const title = t("Progress");

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device });

  return [
    {
      id: "settingsTabs",
      type: "tabs-dev",
      cofig: {
        align: "start"
      },
      devices: "desktop",
      tabs: [
        {
          id: "settingsStyling",
          label: t("Styling"),
          icon: "nc-styling",
          options: [
            toolbarBorderRadius({
              v,
              device,
              state: "normal",
              devices: "desktop",
              onChangeGrouped: ["onChangeBorderRadiusGrouped"],
              onChangeUngrouped: ["onChangeBorderRadiusUngrouped"]
            })
          ]
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
              position: 100,
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
