import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getShapes } from "visual/utils/options";

export const title = () => t("Header");

export function getItems({ v, device }) {
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
                      id: "hoverTransition",
                      label: t("Hover Transition"),
                      devices: "desktop",
                      position: 100,
                      type: "slider",
                      config: {
                        min: 0,
                        max: 99,
                        units: [{ title: "ms", value: "ms" }]
                      }
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
