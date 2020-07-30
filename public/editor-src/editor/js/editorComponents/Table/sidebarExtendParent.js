import { t } from "visual/utils/i18n";
import {
  toolbarDisabledPadding,
  toolbarPaddingFourFieldsPxSuffix
} from "visual/utils/toolbar";

export const title = t("Table");

export function getItems({ v, device }) {
  return [
    {
      id: "settingsTabs",
      type: "tabs-dev",
      config: {
        align: "start"
      },
      devices: "desktop",
      tabs: [
        {
          id: "settingsStyling",
          label: t("Styling"),
          icon: "nc-styling",
          options: [
            toolbarDisabledPadding({ v, device }),
            toolbarPaddingFourFieldsPxSuffix({
              v,
              device,
              prefix: "table",
              state: "normal",
              onChangeGrouped: ["onChangePaddingGrouped"],
              onChangeUngrouped: ["onChangePaddingUngrouped"]
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
