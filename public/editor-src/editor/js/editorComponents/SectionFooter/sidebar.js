import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { getShapes } from "visual/utils/options";
import {
  toolbarShapeBottomFlip,
  toolbarShapeTopFlip
} from "visual/utils/toolbar";

export const title = t("Footer");

export function getItems({ v, device, context }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: shapeTopColorHex } = getOptionColorHexByPalette(
    dvv("shapeTopColorHex"),
    dvv("shapeTopColorPalette")
  );
  const { hex: shapeBottomColorHex } = getOptionColorHexByPalette(
    dvv("shapeBottomColorHex"),
    dvv("shapeBottomColorPalette")
  );

  const toolbarTagsChoices = [
    { title: "Div", value: "div" },
    { title: t("Header"), value: "header" },
    { title: t("Footer"), value: "footer" },
    { title: t("Main"), value: "main" },
    { title: t("Article"), value: "article" },
    { title: t("Section"), value: "section" },
    { title: t("Aside"), value: "aside" },
    { title: t("Nav"), value: "nav" }
  ];
  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs-dev",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "settingsTabs",
              type: "tabs-dev",
              config: {
                align: "start"
              },
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  icon: "nc-styling",
                  options: [
                    {
                      id: "padding",
                      type: "padding-dev",
                      label: t("Padding"),
                      position: 50,
                      config: {
                        units: ["px"]
                      }
                    },
                    {
                      id: "margin",
                      label: t("Margin"),
                      type: "margin-dev",
                      position: 60
                    },
                    {
                      id: "border",
                      type: "corners-dev",
                      label: t("Corner"),
                      position: 65
                    },
                    {
                      id: "shapeDividersGroup",
                      type: "group-dev",
                      options: [
                        {
                          id: "shape",
                          label: t("Dividers"),
                          type: "radioGroup-dev",
                          choices: [
                            { value: "top", icon: "nc-dividers-top" },
                            { value: "bottom", icon: "nc-dividers-bottom" }
                          ]
                        },
                        {
                          id: "shapeTopDividersGroup",
                          type: "group-dev",
                          disabled: dvv("shape") !== "top",
                          options: [
                            {
                              id: "shapeTopType",
                              label: t("Type"),
                              type: "select-dev",
                              choices: getShapes()
                            },
                            {
                              id: "shapeTopColors",
                              type: "popover-dev",
                              label: t("Color"),
                              config: {
                                size: "auto",
                                title: t("Color"),
                                icon: {
                                  style: {
                                    backgroundColor: hexToRgba(
                                      shapeTopColorHex,
                                      dvv("shapeTopColorOpacity")
                                    )
                                  }
                                }
                              },
                              disabled: dvv("shapeTopType") === "none",
                              options: [
                                { id: "shapeTopColor", type: "colorPicker-dev" }
                              ]
                            },
                            {
                              id: "shapeTopHeight",
                              type: "slider-dev",
                              icon: "nc-height",
                              disabled: dvv("shapeTopType") === "none",
                              config: {
                                min: 0,
                                max:
                                  dvv("shapeTopHeightSuffix") === "px"
                                    ? 500
                                    : 100,
                                units: [
                                  { title: "px", value: "px" },
                                  { title: "%", value: "%" }
                                ]
                              }
                            },
                            toolbarShapeTopFlip({
                              v,
                              device,
                              disabled: dvv("shapeTopType") === "none",
                              state: "normal"
                            }),
                            {
                              id: "shapeTopIndex",
                              type: "radioGroup-dev",
                              label: t("Arrangement"),
                              disabled: dvv("shapeTopType") === "none",
                              choices: [
                                { value: "auto", icon: "nc-send-to-back" },
                                { value: "10", icon: "nc-bring-to-top" }
                              ]
                            }
                          ]
                        },
                        {
                          id: "shapeBottomDividersGroup",
                          type: "group-dev",
                          disabled: dvv("shape") !== "bottom",
                          options: [
                            {
                              id: "shapeBottomType",
                              label: t("Type"),
                              type: "select-dev",
                              choices: getShapes(),
                              iconClassName: "brz-ed-shape icon--bottom"
                            },
                            {
                              id: "shapeBottomColors",
                              type: "popover-dev",
                              label: t("Color"),
                              config: {
                                size: "auto",
                                title: t("Color"),
                                icon: {
                                  style: {
                                    backgroundColor: hexToRgba(
                                      shapeBottomColorHex,
                                      dvv("shapeBottomColorOpacity")
                                    )
                                  }
                                }
                              },
                              disabled: dvv("shapeBottomType") === "none",
                              options: [
                                {
                                  id: "shapeBottomColor",
                                  type: "colorPicker-dev"
                                }
                              ]
                            },
                            {
                              id: "shapeBottomHeight",
                              type: "slider-dev",
                              icon: "nc-height",
                              disabled: dvv("shapeBottomType") === "none",
                              config: {
                                min: 0,
                                max:
                                  dvv("shapeBottomHeightSuffix") === "px"
                                    ? 500
                                    : 100,
                                units: [
                                  { title: "px", value: "px" },
                                  { title: "%", value: "%" }
                                ]
                              }
                            },
                            toolbarShapeBottomFlip({
                              v,
                              device,
                              disabled: dvv("shapeBottomType") === "none",
                              state: "normal"
                            }),
                            {
                              id: "shapeBottomIndex",
                              type: "radioGroup-dev",
                              label: t("Arrangement"),
                              disabled: dvv("shapeBottomType") === "none",
                              choices: [
                                { value: "auto", icon: "nc-send-to-back" },
                                { value: "10", icon: "nc-bring-to-top" }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  icon: "nc-cog",
                  devices: "desktop",
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
                      label: t("Block Name"),
                      type: "population-dev",
                      position: 40,
                      devices: "desktop",
                      display: "block",
                      helper: {
                        content: "Add your custom block name, example: my-block"
                      },
                      config: richTextDC,
                      option: {
                        id: "anchorName",
                        type: "inputText-dev"
                      }
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
                      config: richTextDC,
                      option: {
                        id: "customClassName",
                        type: "inputText-dev"
                      }
                    },
                    {
                      id: "customAttributes",
                      label: t("Custom Attributes"),
                      type: "codeMirror-dev",
                      position: 45,
                      // eslint-disable-next-line
                      placeholder: 'key1:"value1"\nkey2:"value2"',
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
                    {
                      id: "tagName",
                      label: t("HTML Tag"),
                      type: "select-dev",
                      devices: "desktop",
                      choices: toolbarTagsChoices
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: "effects",
          title: t("Effects"),
          label: t("Effects"),
          options: [
            {
              id: "tabs",
              type: "tabs-dev",
              config: {
                align: "start"
              },
              tabs: [
                {
                  id: "entrance",
                  label: t("Entrance"),
                  options: [
                    {
                      id: "animation",
                      type: "animation-dev"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
