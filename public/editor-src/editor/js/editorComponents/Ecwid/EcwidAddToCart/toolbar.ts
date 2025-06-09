import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEcwidProducts } from "visual/utils/api";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  borderRadiusCSS,
  buttonSelector,
  buttonSizeCSS,
  fillTypeCSS,
  getCustomBorderRadiusCSSFn,
  getHeightCSSFn,
  getIconSpacingCSSFn,
  getWidthCSSFn,
  iconPositionCSS,
  iconSizeCSS
} from "./css";
import type { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state, component }) => {
  const config = component.getGlobalConfig();

  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const size = dvv("size");
  const borderRadiusType = dvv("borderRadiusType");
  const iconPosition = dvv("iconPosition");
  const fillType = dvv("fillType");

  const hasNoIcon = dvv("iconName") === "";
  const isDefaultFillType = fillType === "default";
  const isCustomSize = size === "custom";
  const isCustomBorderRadius = borderRadiusType === "custom";

  const bgColor = getColorToolbar(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
  );

  const color = getColorToolbar(
    dvv("colorPalette"),
    dvv("colorHex"),
    dvv("colorOpacity")
  );

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
              id: "entityId",
              label: t("Product"),
              type: "select",
              choices: {
                load: () => getEcwidProducts(config),
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
                      ],
                      style: buttonSizeCSS
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
                      },
                      style: getWidthCSSFn(size)
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
                      },
                      style: getHeightCSSFn(size)
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
                  ],
                  style: fillTypeCSS
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
                      ],
                      style: borderRadiusCSS
                    },
                    {
                      id: "borderRadius",
                      type: "slider",
                      disabled: !isCustomBorderRadius,
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ title: "px", value: "px" }]
                      },
                      style: getCustomBorderRadiusCSSFn(borderRadiusType)
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
                  disabled: hasNoIcon,
                  choices: [
                    { value: "left", icon: "nc-align-left" },
                    { value: "right", icon: "nc-align-right" }
                  ],
                  style: iconPositionCSS
                },
                {
                  id: "iconCustomSize",
                  label: t("Size"),
                  type: "slider",
                  disabled: hasNoIcon,
                  config: {
                    min: 1,
                    max: 100,
                    units: [{ title: "px", value: "px" }]
                  },
                  style: iconSizeCSS
                },
                {
                  id: "iconSpacing",
                  label: t("Spacing"),
                  type: "slider",
                  disabled: hasNoIcon,
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ title: "px", value: "px" }]
                  },
                  style: getIconSpacingCSSFn(iconPosition)
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
          },
          selector: buttonSelector
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
            backgroundColor: fillType === "filled" ? bgColor : color
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
                  states: [NORMAL, HOVER],
                  disabled: fillType !== "filled",
                  selector: buttonSelector
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
                  states: [NORMAL, HOVER],
                  selector: buttonSelector
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
                  states: [NORMAL, HOVER],
                  disabled: isDefaultFillType,
                  selector: buttonSelector
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
                  states: [NORMAL, HOVER],
                  disabled: isDefaultFillType,
                  selector: buttonSelector
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
