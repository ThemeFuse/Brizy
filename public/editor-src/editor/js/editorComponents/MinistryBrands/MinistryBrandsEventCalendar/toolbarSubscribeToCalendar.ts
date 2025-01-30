import { Num } from "@brizy/readers";
import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getButtonMaxBorderRadius } from "visual/editorComponents/MinistryBrands/utils/helpers";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import * as Str from "visual/utils/string/specs";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const bgColor = getColorToolbar(
    dvv("subscribeToCalendarBgPalette"),
    dvv("subscribeToCalendarBgColorHex"),
    dvv("subscribeToCalendarBgColorOpacity")
  );

  const color = getColorToolbar(
    dvv("subscribeToCalendarColorPalette"),
    dvv("subscribeToCalendarColorHex"),
    dvv("subscribeToCalendarColorOpacity")
  );

  const subscribeToCalendarTypographyFontSize =
    Num.read(dvv("subscribeToCalendarTypographyFontSize")) ?? 15;

  const subscribeToCalendarTypographyLineHeight =
    Num.read(dvv("subscribeToCalendarTypographyLineHeight")) ?? 1.6;

  const maxBorderRadius = getButtonMaxBorderRadius(
    subscribeToCalendarTypographyFontSize,
    subscribeToCalendarTypographyLineHeight
  );

  const fillType = dvv("subscribeToCalendarFillType");

  const customBorderRadius =
    dvv("subscribeToCalendarBorderRadiusType") !== "custom";

  const fillTypeDefault = fillType === "default";

  const isDisabledIcon = !Str.read(dvv("iconName"));

  return [
    {
      id: "toolbarSubscribeToCalendar",
      label: t("Button"),
      type: "popover",
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      position: 20,
      options: [
        {
          id: "subscribeToCalendarSizeGroup",
          type: "group",
          position: 10,
          options: [
            {
              id: "subscribeToCalendarWidth",
              label: t("Width"),
              type: "slider",
              config: {
                min: 1,
                max: 100,
                units: [
                  { value: "%", title: "%" },
                  { value: "px", title: "px" }
                ]
              }
            },
            {
              id: "subscribeToCalendarHeight",
              label: t("Height"),
              type: "slider",
              config: {
                min: 15,
                max: 500,
                units: [{ value: "px", title: "px" }]
              }
            }
          ]
        },
        {
          id: "subscribeToCalendarFillType",
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
          id: "subscribeToCalendarBorderRadiusTypeGroup",
          type: "group",
          devices: "desktop",
          disabled: fillTypeDefault,
          position: 30,
          options: [
            {
              id: "subscribeToCalendarBorderRadiusType",
              label: t("Corner"),
              type: "radioGroup",
              choices: [
                { value: "square", icon: "nc-corners-square" },
                { value: "rounded", icon: "nc-corners-round" },
                { value: "custom", icon: "nc-more" }
              ]
            },
            {
              id: "subscribeToCalendarBorderRadius",
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
          id: "subscribeToCalendarTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarEventCalendarSubscribeButton",
      type: "popover",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 70,
      options: [
        {
          id: "eventCalendarSubscribeButtonTabs",
          type: "tabs",
          tabs: [
            {
              id: "eventCalendarSubscribeButtonTab",
              label: t("Icon"),
              options: [
                {
                  id: "icon",
                  label: t("Icon"),
                  type: "iconSetter",
                  devices: "desktop",
                  config: { canDelete: true }
                },
                {
                  id: "iconPosition",
                  label: t("Position"),
                  devices: "desktop",
                  type: "radioGroup",
                  disabled: isDisabledIcon,
                  choices: [
                    { value: "left", icon: "nc-align-left" },
                    { value: "right", icon: "nc-align-right" }
                  ]
                },
                {
                  id: "iconSizeGroup",
                  type: "group",
                  devices: "desktop",
                  disabled: isDisabledIcon,
                  options: [
                    {
                      id: "iconSize",
                      label: t("Size"),
                      type: "radioGroup",
                      choices: [
                        { value: "small", icon: "nc-16" },
                        { value: "medium", icon: "nc-24" },
                        { value: "large", icon: "nc-32" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "iconCustomSize",
                      type: "slider",
                      disabled: dvv("iconSize") !== "custom",
                      config: {
                        min: 1,
                        max: 100,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "iconSpacing",
                  label: t("Spacing"),
                  type: "slider",
                  devices: "desktop",
                  roles: ["admin"],
                  disabled: isDisabledIcon,
                  config: {
                    min: 0,
                    max: 150,
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
      id: "toolbarColor",
      type: "popover",
      config: {
        title: t("Colors"),
        size: "medium",
        icon: {
          style: {
            backgroundColor: fillType === "filled" ? bgColor : color
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
                  id: "subscribeToCalendar",
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
                  id: "subscribeToCalendarColor",
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
                  id: "subscribeToCalendarBorder",
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
                  id: "subscribeToCalendarBoxShadow",
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
      id: "subscribeToCalendarHorizontalAlign",
      type: "toggle",
      position: 30,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 40,
      options: [
        {
          id: "subscribeToCalendarText",
          label: t("Text"),
          type: "inputText",
          devices: "desktop",
          config: {
            size: "medium"
          }
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
