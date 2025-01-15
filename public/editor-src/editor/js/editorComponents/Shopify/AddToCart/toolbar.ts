import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getCollectionItems } from "visual/utils/api";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import * as Str from "visual/utils/reader/string";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Value } from ".";

export const getItems: GetItems<Value> = ({ v, device, state, component }) => {
  const config = component.getGlobalConfig();

  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const iconName = dvv("iconName");

  const bgColor = getColor(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
  );

  const sourceType = Str.read(dvv("sourceType")) ?? "";
  const sourceItemsHandler =
    config?.api?.collectionItems?.getCollectionItems?.handler;

  const isCustomSize = dvv("size") === "custom";
  const isDefaultFillType = dvv("fillType") === "default";
  const isCustomBorderRadius = dvv("borderRadiusType") === "custom";

  return [
    {
      id: "toolbarCart",
      type: "popover",
      position: 50,
      config: {
        size: "auto",
        title: t("Products"),
        icon: "nc-woo-add-to-cart"
      },
      devices: "desktop",
      options: [
        {
          id: "groupProduct",
          type: "group",
          options: [
            {
              id: "itemId",
              label: t("Product"),
              type: "select",
              disabled: !sourceItemsHandler || sourceType === "",
              choices: {
                load: () =>
                  getCollectionItems(sourceType, config, [
                    { title: t("Auto"), value: "" }
                  ]),
                emptyLoad: {
                  title: t("There are no choices")
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: "toolbarButtonAndIconOptions",
      type: "popover",
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      position: 60,
      options: [
        {
          id: "",
          type: "tabs",
          tabs: [
            {
              id: "tabButton",
              label: t("Button"),
              options: [
                {
                  id: "sizeGroup",
                  type: "group",
                  position: 10,
                  options: [
                    {
                      id: "size",
                      label: t("Size"),
                      type: "radioGroup",
                      choices: [
                        { value: "small", icon: "nc-small" },
                        { value: "medium", icon: "nc-medium" },
                        { value: "large", icon: "nc-large" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "width",
                      label: t("Width"),
                      type: "slider",
                      disabled: !isCustomSize,
                      config: {
                        min: 1,
                        max: 100,
                        units: [{ value: "px", title: "px" }]
                      }
                    },
                    {
                      id: "height",
                      label: t("Height"),
                      type: "slider",
                      disabled: !isCustomSize,
                      config: {
                        min: 1,
                        max: 100,
                        units: [{ value: "px", title: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "fillType",
                  label: t("Fill"),
                  devices: "desktop",
                  type: "radioGroup",
                  position: 20,
                  choices: [
                    { value: "filled", icon: "nc-circle" },
                    { value: "outline", icon: "nc-outline" },
                    { value: "default", icon: "nc-close" }
                  ]
                },
                {
                  id: "borderRadiusTypeGroup",
                  type: "group",
                  devices: "desktop",
                  disabled: isDefaultFillType,
                  position: 30,
                  options: [
                    {
                      id: "borderRadiusType",
                      label: t("Corner"),
                      type: "radioGroup",
                      choices: [
                        { value: "square", icon: "nc-corners-square" },
                        { value: "rounded", icon: "nc-corners-round" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "borderRadius",
                      type: "slider",
                      disabled: !isCustomBorderRadius,
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "tabIcon",
              label: t("Icon"),
              options: [
                {
                  id: "icon",
                  label: t("Icon"),
                  type: "iconSetter",
                  config: { canDelete: true }
                },
                {
                  id: "iconPosition",
                  label: t("Position"),
                  type: "radioGroup",
                  disabled: iconName === "",
                  choices: [
                    { value: "left", icon: "nc-align-left" },
                    { value: "right", icon: "nc-align-right" }
                  ]
                },
                {
                  id: "iconCustomSize",
                  label: t("Size"),
                  type: "slider",
                  disabled: iconName === "",
                  config: {
                    min: 1,
                    max: 100,
                    units: [{ title: "px", value: "px" }]
                  }
                },
                {
                  id: "iconSpacing",
                  label: t("Spacing"),
                  type: "slider",
                  disabled: iconName === "",
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ title: "px", value: "px" }]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "popoverColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColor
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "",
                  type: "backgroundColor",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "buttonColorTab",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110
    }
  ];
};
