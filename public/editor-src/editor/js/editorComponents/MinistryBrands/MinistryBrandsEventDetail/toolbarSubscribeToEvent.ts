import { Num } from "@brizy/readers";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getButtonMaxBorderRadius } from "visual/editorComponents/MinistryBrands/utils/helpers";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const subscribeEventButtonBgColor = getColorToolbar(
    dvv("subscribeEventButtonBgColorPalette"),
    dvv("subscribeEventButtonBgColorHex"),
    dvv("subscribeEventButtonBgColorOpacity")
  );

  const subscribeEventButtonColor = getColorToolbar(
    dvv("subscribeEventButtonColorPalette"),
    dvv("subscribeEventButtonColorHex"),
    dvv("subscribeEventButtonColorOpacity")
  );

  const subscribeEventButtonTypographyFontSize =
    Num.read(dvv("subscribeEventButtonTypographyFontSize")) ?? 15;

  const subscribeEventButtonTypographyLineHeight =
    Num.read(dvv("subscribeEventButtonTypographyLineHeight")) ?? 1.6;

  const maxBorderRadius = getButtonMaxBorderRadius(
    subscribeEventButtonTypographyFontSize,
    subscribeEventButtonTypographyLineHeight
  );

  const fillType = dvv("subscribeEventButtonFillType");

  const customSize = dvv("subscribeEventButtonSize") !== "custom";
  const customBorderRadius = dvv("buttonsBorderRadiusType") !== "custom";

  const fillTypeDefault = fillType === "default";

  return [
    {
      id: "toolbarSubscribeEventButton",
      label: t("Button"),
      type: "popover",
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      position: 20,
      options: [
        {
          id: "subscribeEventButtonSizeGroup",
          type: "group",
          position: 10,
          options: [
            {
              id: "subscribeEventButtonSize",
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
              id: "subscribeEventButtonPaddingRL",
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
              id: "subscribeEventButtonPaddingTB",
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
          id: "subscribeEventButtonFillType",
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
          id: "subscribeEventButtonBorderRadiusTypeGroup",
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
          id: "subscribeEventButtonTypography",
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
                ? subscribeEventButtonBgColor
                : subscribeEventButtonColor
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
                  id: "subscribeEventButton",
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
                  id: "subscribeEventButtonColor",
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
                  id: "subscribeEventButtonBorder",
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
                  id: "subscribeEventButtonBoxShadow",
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
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "subscribeToEventButtonText",
          devices: "desktop",
          type: "inputText",
          placeholder: t("Button text..."),
          label: t("Button")
        },
        {
          id: "grid",
          type: "grid",
          config: {
            separator: true
          },
          columns: [
            {
              id: "col-1",
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
