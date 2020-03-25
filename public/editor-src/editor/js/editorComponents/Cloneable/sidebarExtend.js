import { t } from "visual/utils/i18n";
import {
  toolbarPaddingFourFields,
  toolbarMargin,
  toolbarShowOnDesktop,
  toolbarZIndex,
  toolbarEntranceAnimation
} from "visual/utils/toolbar";
import { getDynamicContentChoices } from "visual/utils/options";

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
              state: "normal",
              devices: "desktop"
            }),
            toolbarMargin({
              v,
              device,
              devices: "desktop",
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
            toolbarShowOnDesktop({
              v,
              device,
              state: "normal",
              devices: "desktop"
            }),
            toolbarZIndex({
              v,
              device,
              state: "normal",
              devices: "desktop"
            }),
            {
              id: "cssID",
              label: t("CSS ID"),
              type: "population-dev",
              position: 30,
              devices: "desktop",
              display: "block",
              helper: {
                content: "Add your custom ID without the #pound, example: my-id"
              },
              config: {
                choices: cssIDDynamicContentChoices
              },
              options: [
                {
                  id: "customID",
                  type: "inputText-dev"
                }
              ]
            },
            {
              id: "cssClass",
              label: t("CSS Class"),
              type: "population-dev",
              position: 40,
              devices: "desktop",
              display: "block",
              helper: {
                content:
                  "Add your custom class without the .dot, example: my-class"
              },
              config: {
                choices: cssIDDynamicContentChoices
              },
              options: [
                {
                  id: "customClassName",
                  type: "inputText-dev"
                }
              ]
            },
            toolbarEntranceAnimation({
              v,
              device,
              state: "normal",
              devices: "desktop"
            })
          ]
        }
      ]
    },
    toolbarPaddingFourFields({
      v,
      device,
      state: "normal",
      devices: "responsive"
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
