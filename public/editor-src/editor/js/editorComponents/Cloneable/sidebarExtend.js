import { t } from "visual/utils/i18n";
import {
  toolbarPaddingFourFields,
  toolbarMargin,
  toolbarEntranceAnimation
} from "visual/utils/toolbar";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentChoices } from "visual/utils/options";
import { DCTypes } from "visual/global/Config/types/DynamicContent";

export function getItems({ v, device, context }) {
  const dvv = key => defaultValueValue({ v, key, device });

  const isRelative = dvv("elementPosition") === "relative";
  const richTextDC = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.richText
  );

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
            }),
            {
              id: "groupPosition",
              type: "group-dev",
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
                    max: dvv("widthSuffix") === "px" ? 1200 : 100,
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
                    min: dvv("offsetXSuffix") === "px" ? -1200 : -100,
                    max: dvv("offsetXSuffix") === "px" ? 1200 : 100,
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
                    min: dvv("offsetYSuffix") === "px" ? -1200 : -100,
                    max: dvv("offsetYSuffix") === "px" ? 1200 : 100,
                    units: [
                      { value: "px", title: "px" },
                      { value: "%", title: "%" }
                    ]
                  }
                }
              ]
            }
          ]
        },
        {
          id: "moreSettingsAdvanced",
          label: t("Advanced"),
          icon: "nc-cog",
          options: [
            {
              id: "showOnDesktop",
              label: t("Show on Desktop"),
              position: 10,
              closeTooltip: true,
              type: "switch-dev",
              devices: "desktop"
            },
            {
              id: "zIndex",
              type: "slider-dev",
              position: 20,
              label: t("Z-index"),
              devices: "desktop",
              config: {
                min: 0,
                max: 100
              }
            },
            {
              id: "customAttributes",
              label: t("Custom Attributes"),
              type: "codeMirror-dev",
              position: 45,
              placeholder: "key1:value1\nkey2:value2",
              display: "block",
              devices: "desktop",
              helper: {
                content:
                  "Set your custom attribute for wrapper element. Each attribute in a separate line. Separate attribute key from the value using : character."
              },
              population: richTextDC
            },
            toolbarEntranceAnimation({
              v,
              device,
              state: "normal"
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
    }),
    toolbarEntranceAnimation({
      v,
      device,
      devices: "responsive",
      state: "normal"
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
            max: dvv("widthSuffix") === "px" ? 1200 : 100,
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
            min: dvv("offsetXSuffix") === "px" ? -1200 : -100,
            max: dvv("offsetXSuffix") === "px" ? 1200 : 100,
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
            min: dvv("offsetYSuffix") === "px" ? -1200 : -100,
            max: dvv("offsetYSuffix") === "px" ? 1200 : 100,
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
