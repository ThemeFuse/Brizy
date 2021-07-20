import { t } from "visual/utils/i18n";
import { getDynamicContentChoices } from "visual/utils/options";
import {
  toolbarBorderRadius,
  toolbarPaddingFourFields,
  toolbarMargin,
  toolbarEntranceAnimation
} from "visual/utils/toolbar";
import { DCTypes } from "visual/global/Config/types/DynamicContent";

export const title = t("Row");

export function getItems({ v, device, component, context }) {
  const inPopup = Boolean(component.props.meta.sectionPopup);
  const toolbarTagsChoices = [
    { title: t("Div"), value: "div" },
    { title: t("Header"), value: "header" },
    { title: t("Footer"), value: "footer" },
    { title: t("Main"), value: "main" },
    { title: t("Article"), value: "article" },
    { title: t("Section"), value: "section" },
    { title: t("Aside"), value: "aside" },
    { title: t("Nav"), value: "nav" }
  ];
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
              state: "normal",
              devices: "desktop",
              disabled: inPopup,
              onChangeGrouped: ["onChangeMarginGrouped"],
              onChangeUngrouped: ["onChangeMarginUngrouped"]
            }),
            toolbarBorderRadius({
              v,
              device,
              state: "normal",
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
                choices: richTextDC
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
                choices: richTextDC
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
              devices: "desktop",
              helper: {
                content:
                  "Set your custom attribute for wrapper element. Each attribute in a separate line. Separate attribute key from the value using : character."
              },
              population: richTextDC
            },
            {
              id: "hoverTransition",
              label: t("Hover Transition"),
              devices: "desktop",
              position: 60,
              type: "slider-dev",
              config: {
                min: 0,
                max: 99,
                units: [{ title: "ms", value: "ms" }]
              }
            },
            toolbarEntranceAnimation({
              v,
              device,
              state: "normal"
            }),
            {
              id: "tagName",
              label: t("HTML Tag"),
              type: "select-dev",
              choices: toolbarTagsChoices
            }
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
      state: "normal",
      devices: "responsive",
      disabled: inPopup,
      onChangeGrouped: ["onChangeMarginGrouped"],
      onChangeUngrouped: ["onChangeMarginUngrouped"]
    }),
    toolbarBorderRadius({
      v,
      device,
      devices: "responsive",
      state: "normal",
      onChangeGrouped: [
        "onChangeBorderRadiusGrouped",
        "onChangeBorderRadiusGroupedDependencies"
      ],
      onChangeUngrouped: [
        "onChangeBorderRadiusUngrouped",
        "onChangeBorderRadiusUngroupedDependencies"
      ]
    }),
    toolbarEntranceAnimation({
      v,
      device,
      devices: "responsive",
      state: "normal"
    })
  ];
}
