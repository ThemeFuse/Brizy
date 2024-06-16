import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { read as readNumber } from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { getButtonMaxBorderRadius } from "../utils/helpers";
import { Props, Value } from "./types";

// @ts-expect-error "advancedSettings" is old options
export const getItems: GetItems<Value, Props> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const { hex: buttonBgColorHex } = getOptionColorHexByPalette(
    dvv("buttonBgColorHex"),
    dvv("buttonBgColorPalette")
  );

  const { hex: buttonColorHex } = getOptionColorHexByPalette(
    dvv("buttonColorHex"),
    dvv("buttonColorPalette")
  );

  const buttonColorOpacity = dvv("buttonColorOpacity");
  const buttonBgColorOpacity = dvv("buttonBgColorOpacity");

  const customSize = dvv("buttonSize") !== "custom";
  const fillType = dvv("buttonFillType");

  const fillTypeDefault = fillType === "default";

  const detailButtonTypographyFontSize =
    readNumber(dvv("detailButtonTypographyFontSize")) ?? 15;

  const detailButtonTypographyLineHeight =
    readNumber(dvv("detailButtonTypographyLineHeight")) ?? 1.6;

  const customBorderRadius = dvv("buttonsBorderRadiusType") !== "custom";
  const maxBorderRadius = getButtonMaxBorderRadius(
    detailButtonTypographyFontSize,
    detailButtonTypographyLineHeight
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      position: 10,
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      options: [
        {
          id: "groupSize",
          type: "group",
          options: [
            {
              id: "buttonSize",
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
              id: "buttonHeight",
              label: t("Height"),
              disabled: customSize,
              type: "slider",
              config: {
                min: 0,
                max: 100,
                units: [{ value: "px", title: "px" }]
              }
            },
            {
              id: "buttonWidth",
              label: t("Width"),
              disabled: customSize,
              type: "slider",
              config: {
                min: 0,
                max: 100,
                units: [
                  { value: "%", title: "%" },
                  { value: "px", title: "px" }
                ]
              }
            }
          ]
        },
        {
          id: "buttonFillType",
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
    },
    {
      id: "popoverTypography",
      type: "popover",
      position: 20,
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      options: [
        {
          id: "buttonTypography",
          type: "typography",
          config: { fontFamily: device === "desktop" }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      position: 30,
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor:
              fillType === "filled"
                ? hexToRgba(buttonBgColorHex, buttonBgColorOpacity)
                : hexToRgba(buttonColorHex, buttonColorOpacity)
          }
        }
      },
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabButtonBg",
              label: t("Bg"),
              options: [
                {
                  id: "button",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  disabled: fillType !== "filled"
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "buttonColor",
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
                  id: "buttonBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  disabled: fillTypeDefault
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "buttonBoxShadow",
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
      type: "legacy-advancedSettings",
      devices: "desktop",
      position: 110,
      icon: "nc-cog"
    }
  ];
};
