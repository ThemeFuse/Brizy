import { t } from "visual/utils/i18n";
import { toolbarPaddingFourFieldsPxSuffix } from "visual/utils/toolbar";

export const title = t("Table Sidebar");

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
