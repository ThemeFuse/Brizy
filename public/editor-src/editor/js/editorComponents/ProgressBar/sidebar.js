import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarBorderRadius,
  toolbarHoverTransition
} from "visual/utils/toolbar";

export const title = t("Progress");

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device });

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
