import { ElementModel } from "visual/component/Elements/Types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import * as Num from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Params } from "../EditorComponent/types";
import { ToolbarItemType } from "../ToolbarItemType";
import { getButtonMaxBorderRadius } from "./utils/helpers";

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

  const detailButtonColorOpacity = dvv("detailButtonColorOpacity");
  const detailButtonBgColorOpacity = dvv("detailButtonBgColorOpacity");

  const detailButtonBgColor = getColorToolbar(
    dvv("detailButtonBgColorPalette"),
    dvv("detailButtonBgColorHex"),
    detailButtonBgColorOpacity
  );

  const detailButtonColor = getColorToolbar(
    dvv("detailButtonColorPalette"),
    dvv("detailButtonColorHex"),
    detailButtonColorOpacity
  );

  const detailButtonTypographyFontSize =
    Num.read(dvv("detailButtonTypographyFontSize")) ?? 15;

  const detailButtonTypographyLineHeight =
    Num.read(dvv("detailButtonTypographyLineHeight")) ?? 1.6;

  const maxBorderRadius = getButtonMaxBorderRadius(
    detailButtonTypographyFontSize,
    detailButtonTypographyLineHeight
  );

  const fillType = dvv("detailButtonFillType");

  const customSize = dvv("detailButtonSize") !== "custom";
  const customBorderRadius = dvv("buttonsBorderRadiusType") !== "custom";

  const fillTypeDefault = fillType === "default";

  return [
    {
      id: "toolbarDetailButton",
      label: t("Button"),
      type: "popover",
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      position: 20,
      options: [
        {
          id: "detailButtonSizeGroup",
          type: "group",
          position: 10,
          options: [
            {
              id: "detailButtonSize",
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
              id: "detailButtonPaddingRL",
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
              id: "detailButtonPaddingTB",
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
          id: "detailButtonFillType",
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
          id: "detailButtonBorderRadiusTypeGroup",
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
          id: "detailButtonTypography",
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
              fillType === "filled" ? detailButtonBgColor : detailButtonColor
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
                  id: "detailButton",
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
                  id: "detailButtonColor",
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
                  id: "detailButtonBorder",
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
                  id: "detailButtonBoxShadow",
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
      devices: "desktop",
      title: t("Settings")
    }
  ];
};
