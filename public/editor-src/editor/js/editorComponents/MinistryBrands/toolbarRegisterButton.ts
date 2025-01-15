import { Num } from "@brizy/readers";
import { ElementModel } from "visual/component/Elements/Types";
import { getButtonMaxBorderRadius } from "visual/editorComponents/MinistryBrands/utils/helpers";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Params } from "../EditorComponent/types";
import { ToolbarItemType } from "../ToolbarItemType";

export const getItems = <
  M extends ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any> = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string, any> = Record<string, unknown>
>({
  v,
  device
}: Params<M, P, S>): ToolbarItemType[] => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const registerButtonBgColor = getColor(
    dvv("registerButtonBgColorPalette"),
    dvv("registerButtonBgColorHex"),
    dvv("registerButtonBgColorOpacity")
  );

  const registerButtonColor = getColor(
    dvv("registerButtonColorPalette"),
    dvv("registerButtonColorHex"),
    dvv("registerButtonColorOpacity")
  );

  const registerButtonTypographyFontSize =
    Num.read(dvv("registerButtonTypographyFontSize")) ?? 15;

  const registerButtonTypographyLineHeight =
    Num.read(dvv("registerButtonTypographyLineHeight")) ?? 1.6;

  const maxBorderRadius = getButtonMaxBorderRadius(
    registerButtonTypographyFontSize,
    registerButtonTypographyLineHeight
  );

  const fillType = dvv("registerButtonFillType");

  const customSize = dvv("registerButtonSize") !== "custom";
  const customBorderRadius = dvv("buttonsBorderRadiusType") !== "custom";

  const fillTypeDefault = fillType === "default";

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      position: 20,
      options: [
        {
          id: "registerButtonTabs",
          type: "tabs",
          tabs: [
            {
              id: "registerButtonTab",
              label: t("Button"),
              options: [
                {
                  id: "registerButtonSizeGroup",
                  type: "group",
                  position: 10,
                  options: [
                    {
                      id: "registerButtonSize",
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
                      id: "registerButtonPaddingRL",
                      label: t("Width"),
                      type: "slider",
                      disabled: customSize,
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ title: "px", value: "px" }]
                      }
                    },
                    {
                      id: "registerButtonPaddingTB",
                      label: t("Height"),
                      type: "slider",
                      disabled: customSize,
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "registerButtonFillType",
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
                  id: "registerButtonBorderRadiusTypeGroup",
                  type: "group",
                  devices: "desktop",
                  disabled: fillTypeDefault,
                  position: 30,
                  options: [
                    {
                      id: "buttonsBorderRadiusType",
                      label: t("Corner"),
                      type: "radioGroup",
                      choices: [
                        { value: "square", icon: "nc-corners-square" },
                        { value: "rounded", icon: "nc-corners-round" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "buttonsBorderRadius",
                      type: "slider",
                      disabled: customBorderRadius,
                      config: {
                        min: 0,
                        max: maxBorderRadius,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
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
          id: "registerButtonTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        title: t("Colors"),
        size: "medium",
        icon: {
          style: {
            backgroundColor:
              fillType === "filled"
                ? registerButtonBgColor
                : registerButtonColor
          }
        }
      },
      devices: "desktop",
      position: 80,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBgColor",
              label: t("Bg"),
              options: [
                {
                  id: "registerButton",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  disabled: fillType !== "filled"
                }
              ]
            },
            {
              id: "tabColor",
              label: t("Text"),
              options: [
                {
                  id: "registerButtonColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "registerButtonBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  disabled: fillTypeDefault
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "registerButtonBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER],
                  disabled: fillTypeDefault
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
      position: 110,
      icon: "nc-cog",
      devices: "desktop",
      title: t("Settings")
    }
  ];
};
