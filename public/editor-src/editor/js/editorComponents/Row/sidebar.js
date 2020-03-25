import { t } from "visual/utils/i18n";
import { getDynamicContentChoices } from "visual/utils/options";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarBorderRadius,
  toolbarHoverTransition,
  toolbarShowOnDesktop,
  toolbarPaddingFourFields,
  toolbarMargin,
  toolbarZIndex,
  toolbarEntranceAnimation
} from "visual/utils/toolbar";

export const title = t("Row");

export function getItems({ v, device, component }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const cssIDDynamicContentChoices = getDynamicContentChoices("richText");

  const inPopup = Boolean(component.props.meta.sectionPopup);

  const toolbarTagsChoices = [
    {
      title: t("Div"),
      value: "div"
    },
    {
      title: t("Header"),
      value: "header"
    },
    {
      title: t("Footer"),
      value: "footer"
    },
    {
      title: t("Main"),
      value: "main"
    },
    {
      title: t("Article"),
      value: "article"
    },
    {
      title: t("Section"),
      value: "section"
    },
    {
      title: t("Aside"),
      value: "aside"
    },
    {
      title: t("Nav"),
      value: "nav"
    }
  ];

  return [
    {
      id: dvk("settingsTabs"),
      type: "tabs",
      align: "start",
      devices: "desktop",
      tabs: [
        {
          id: dvk("settingsStyling"),
          label: t("Styling"),
          tabIcon: "nc-styling",
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
          id: dvk("moreSettingsAdvanced"),
          label: t("Advanced"),
          tabIcon: "nc-cog",
          options: [
            toolbarShowOnDesktop({ v, devices: "desktop" }),
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
            }),
            toolbarHoverTransition({
              v,
              device,
              position: 60,
              devices: "desktop",
              state: "normal"
            }),
            {
              id: "tagName",
              label: t("Html Tag"),
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
    })
  ];
}
