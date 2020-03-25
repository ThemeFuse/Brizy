import { t } from "visual/utils/i18n";
import { toolbarPaddingFourFields, toolbarMargin } from "visual/utils/toolbar";

export const title = t("Playlist Items");

export function getItems({ v, device }) {
  return [
    {
      id: "settingsTabs",
      type: "tabs",
      align: "start",
      tabs: [
        {
          id: "settingsStyling",
          label: t("Styling"),
          tabIcon: "nc-styling",
          options: [
            toolbarPaddingFourFields({
              v,
              device,
              state: "normal"
            }),
            toolbarMargin({
              v,
              device,
              state: "normal",
              onChangeGrouped: ["onChangeMarginGrouped"],
              onChangeUngrouped: ["onChangeMarginUngrouped"]
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
