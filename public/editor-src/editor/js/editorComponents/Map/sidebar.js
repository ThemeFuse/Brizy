import {
  toolbarBorderRadius,
  toolbarHoverTransition
} from "visual/utils/toolbar";
import { t } from "visual/utils/i18n";

export const title = t("Map");

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
          options: [
            toolbarBorderRadius({
              v,
              device,
              state: "normal",
              devices: "desktop",
              onChangeGrouped: [
                "onChangeBorderRadiusGrouped",
                "onChangeBorderRadiusGroupedDependencies"
              ],
              onChangeUngrouped: [
                "onChangeBorderRadiusUngrouped",
                "onChangeBorderRadiusUngroupedDependencies"
              ]
            })
          ]
        },
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
