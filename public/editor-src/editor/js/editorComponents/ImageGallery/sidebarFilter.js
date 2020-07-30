import { t } from "visual/utils/i18n";
import {
  toolbarBorderRadius,
  toolbarPaddingFourFieldsPxSuffix
} from "visual/utils/toolbar";

export const title = t("Gallery Tags");

export function getItems({ v, device }) {
  return [
    {
      id: "settingsTabs",
      type: "tabs-dev",
      config: {
        align: "start"
      },
      tabs: [
        {
          id: "settingsStyling",
          label: t("Styling"),
          icon: "nc-styling",
          options: [
            toolbarPaddingFourFieldsPxSuffix({
              v,
              device,
              prefix: "filter",
              state: "normal",
              onChangeGrouped: ["onChangePaddingGrouped"],
              onChangeUngrouped: ["onChangePaddingUngrouped"]
            }),
            toolbarBorderRadius({
              v,
              device,
              prefix: "filter",
              state: "normal",
              onChangeGrouped: ["onChangeBorderRadiusGrouped"],
              onChangeUngrouped: ["onChangeBorderRadiusUngrouped"]
            })
          ]
        },
        {
          id: "moreSettingsAdvanced",
          label: t("Advanced"),
          icon: "nc-cog",
          options: []
        }
      ]
    }
  ];
}
