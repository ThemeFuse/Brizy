import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { getShapes } from "visual/utils/options";

export const title = () => t("Footer");

export function getItems({ v, device, context }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });

  const shapeTopColor = getColor(
    dvv("shapeTopColorPalette"),
    dvv("shapeTopColorHex"),
    dvv("shapeTopColorOpacity")
  );

  const shapeBottomColor = getColor(
    dvv("shapeBottomColorPalette"),
    dvv("shapeBottomColorHex"),
    dvv("shapeBottomColorOpacity")
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

  const isShapeTopType = dvv("shapeTopType") === "none";
  const isShapeBottomType = dvv("shapeBottomType") === "none";

  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "settingsTabs",
              type: "tabs",
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
                      id: "showOnDesktop",
                      label: t("Show on Desktop"),
                      position: 10,
                      closeTooltip: true,
                      type: "switch",
                      devices: "desktop"
                    },
                    {
                      id: "padding",
                      type: "padding",
                      label: t("Padding"),
                      position: 50,
                      config: {
                        units: ["px"]
                      }
                    },
                    {
                      id: "margin",
                      label: t("Margin"),
                      type: "margin",
                      position: 60
                    },
                    {
                      id: "border",
                      type: "corners",
                      label: t("Corner"),
                      position: 65
                    },
                    {
                      id: "shapeDividersGroup",
                      type: "group",
                      options: [
                        {
                          id: "shape",
                          label: t("Dividers"),
                          type: "radioGroup",
                          choices: [
                            { value: "top", icon: "nc-dividers-top" },
                            { value: "bottom", icon: "nc-dividers-bottom" }
                          ]
                        },
                        {
                          id: "shapeTopDividersGroup",
                          type: "group",
                          disabled: dvv("shape") !== "top",
                          options: [
                            {
                              id: "shapeTopType",
                              label: t("Type"),
                              type: "select",
                              choices: getShapes()
                            },
                            {
                              id: "shapeTopColors",
                              type: "popover",
                              label: t("Color"),
                              config: {
                                size: "auto",
                                title: t("Color"),
                                icon: {
                                  style: {
                                    backgroundColor: shapeTopColor
                                  }
                                }
                              },
                              disabled: isShapeTopType,
                              options: [
                                { id: "shapeTopColor", type: "colorPicker" }
                              ]
                            },
                            {
                              id: "shapeTopHeight",
                              type: "slider",
                              icon: "nc-height",
                              disabled: isShapeTopType,
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
                            {
                              id: "shapeTopHorizontal",
                              label: t("Flip"),
                              type: "toggleButton",
                              disabled: isShapeTopType,
                              config: {
                                icon: "nc-flip-horizontal",
                                type: "square"
                              }
                            },
                            {
                              id: "shapeTopIndex",
                              type: "radioGroup",
                              label: t("Arrangement"),
                              disabled: isShapeTopType,
                              choices: [
                                { value: "auto", icon: "nc-send-to-back" },
                                { value: "10", icon: "nc-bring-to-top" }
                              ]
                            }
                          ]
                        },
                        {
                          id: "shapeBottomDividersGroup",
                          type: "group",
                          disabled: dvv("shape") !== "bottom",
                          options: [
                            {
                              id: "shapeBottomType",
                              label: t("Type"),
                              type: "select",
                              choices: getShapes(),
                              iconClassName: "brz-ed-shape icon--bottom"
                            },
                            {
                              id: "shapeBottomColors",
                              type: "popover",
                              label: t("Color"),
                              config: {
                                size: "auto",
                                title: t("Color"),
                                icon: {
                                  style: {
                                    backgroundColor: shapeBottomColor
                                  }
                                }
                              },
                              disabled: isShapeBottomType,
                              options: [
                                {
                                  id: "shapeBottomColor",
                                  type: "colorPicker"
                                }
                              ]
                            },
                            {
                              id: "shapeBottomHeight",
                              type: "slider",
                              icon: "nc-height",
                              disabled: isShapeBottomType,
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
                            {
                              id: "shapeBottomHorizontal",
                              label: t("Flip"),
                              type: "toggleButton",
                              disabled: isShapeBottomType,
                              config: {
                                icon: "nc-flip-horizontal",
                                type: "square"
                              }
                            },
                            {
                              id: "shapeBottomIndex",
                              type: "radioGroup",
                              label: t("Arrangement"),
                              disabled: isShapeBottomType,
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
                      id: "zIndex",
                      type: "slider",
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
                      type: "population",
                      position: 40,
                      devices: "desktop",
                      display: "block",
                      helper: {
                        content: "Add your custom block name, example: my-block"
                      },
                      config: richTextDC,
                      option: {
                        id: "anchorName",
                        type: "inputText"
                      }
                    },
                    {
                      id: "cssClass",
                      label: t("CSS Class"),
                      type: "population",
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
                        type: "inputText"
                      }
                    },
                    {
                      id: "customAttributes",
                      label: t("Custom Attributes"),
                      type: "codeMirror",
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
                      type: "slider",
                      config: {
                        min: 0,
                        max: 99,
                        units: [{ title: "ms", value: "ms" }]
                      }
                    },
                    {
                      id: "tagName",
                      label: t("HTML Tag"),
                      type: "select",
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
              type: "tabs",
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
                      type: "animation"
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
