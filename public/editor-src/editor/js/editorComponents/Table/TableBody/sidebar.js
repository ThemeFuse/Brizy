import { t } from "visual/utils/i18n";
import { toolbarPaddingFourFieldsPxSuffix } from "visual/utils/toolbar";

export const title = t("Table Sidebar");

export function getItems({ v, device }) {
  return [
    {
      id: "settingsTabs",
      type: "tabs-dev",
      align: "start",
      tabs: [
        {
          id: "settingsStyling",
          label: t("Styling"),
          tabIcon: "nc-styling",
          options: [
            toolbarPaddingFourFieldsPxSuffix({
              v,
              device,
              state: "normal",
              onChangeGrouped: ["onChangePaddingGrouped"],
              onChangeUngrouped: ["onChangePaddingUngrouped"]
            })
          ]
        },
        {
          id: "moreSettingsAdvanced",
          label: t("Advanced"),
          tabIcon: "nc-cog",
          options: []
        }
      ]
    }
  ];
}
