import {
  toolbarPaddingFourFields,
  toolbarMargin,
  toolbarShowOnDesktop,
  toolbarZIndex,
  toolbarCSSID,
  toolbarCustomCSSClass,
  toolbarEntranceAnimation
} from "visual/utils/toolbar";
import { getDynamicContentChoices } from "visual/utils/options";
import { t } from "visual/utils/i18n";

export function getItems({ v, device }) {
  const cssIDDynamicContentChoices = getDynamicContentChoices("richText");

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
          position: 10,
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
          options: [
            toolbarShowOnDesktop({ v, device }),
            toolbarZIndex({ v, device }),
            toolbarCSSID({
              v,
              device,
              state: "normal",
              population: cssIDDynamicContentChoices
            }),
            toolbarCustomCSSClass({
              v,
              device,
              state: "normal",
              population: cssIDDynamicContentChoices
            }),
            toolbarEntranceAnimation({ v, device })
          ]
        }
      ]
    },
    toolbarPaddingFourFields({
      v,
      device,
      devices: "responsive",
      state: "normal"
    }),
    toolbarMargin({
      v,
      device,
      devices: "responsive",
      state: "normal",
      onChangeGrouped: ["onChangeMarginGrouped"],
      onChangeUngrouped: ["onChangeMarginUngrouped"]
    })
  ];
}
