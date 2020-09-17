import {
  toolbarPaddingFourFields,
  toolbarMargin,
  toolbarEntranceAnimation
} from "visual/utils/toolbar";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentChoices } from "visual/utils/options";
import { t } from "visual/utils/i18n";

export function getItems({ v, device }) {
  const cssIDDynamicContentChoices = getDynamicContentChoices("richText");

  const dvv = key => defaultValueValue({ v, key, device });
  const isRelative = dvv("elementPosition") === "relative";

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
          id: "moreSettingsAdvanced",
          label: t("Advanced"),
          icon: "nc-cog",
          options: [
            {
              id: "zIndex",
              type: "slider-dev",
              position: 20,
              label: t("Z-index"),
              // disabled: IS_STORY,
              config: {
                min: 0,
                max: 100
              }
            },
            {
              id: "rotate",
              type: "slider-dev",
              position: 21,
              label: t("Rotate"),
              //disabled: !IS_STORY,
              config: {
                min: 0,
                max: 360,
                units: [{ is: "deg", title: "deg" }]
              }
            },
            {
              id: "cssID",
              label: t("CSS ID"),
              type: "population-dev",
              position: 40,
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
            {
              id: "customAttributes",
              label: t("Custom Attributes"),
              type: "codeMirror-dev",
              position: 45,
              placeholder: "key1:value1\nkey2:value2",
              display: "block",
              helper: {
                content:
                  "Set your custom attribute for wrapper element. Each attribute in a separate line. Separate attribute key from the value using : character."
              }
            },
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
    }),
    {
      id: "groupPosition",
      type: "group-dev",
      devices: "responsive",
      options: [
        {
          id: "elementPosition",
          label: t("Position"),
          type: "select-dev",
          choices: [
            { value: "relative", title: "None" },
            { value: "absolute", title: "Absolute" },
            { value: "fixed", title: "Fixed" }
          ]
        },
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          disabled: isRelative,
          config: {
            min: 0,
            max: dvv("widthSuffix") === "px" ? 1200 : 300,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "offsetXAlignment",
          label: t("Horizontal Offset"),
          type: "radioGroup-dev",
          disabled: isRelative,
          choices: [
            { value: "left", icon: "nc-align-left" },
            { value: "right", icon: "nc-align-right" }
          ]
        },
        {
          id: "offsetX",
          type: "slider-dev",
          disabled: isRelative,
          config: {
            min: dvv("offsetXSuffix") === "px" ? -1200 : -200,
            max: dvv("offsetXSuffix") === "px" ? 1200 : 200,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "offsetYAlignment",
          label: t("Vertical Offset"),
          type: "radioGroup-dev",
          disabled: isRelative,
          choices: [
            { value: "top", icon: "nc-align-top" },
            { value: "bottom", icon: "nc-align-bottom" }
          ]
        },
        {
          id: "offsetY",
          type: "slider-dev",
          disabled: isRelative,
          config: {
            min: dvv("offsetYSuffix") === "px" ? -1200 : -200,
            max: dvv("offsetYSuffix") === "px" ? 1200 : 200,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        }
      ]
    }
  ];
}
