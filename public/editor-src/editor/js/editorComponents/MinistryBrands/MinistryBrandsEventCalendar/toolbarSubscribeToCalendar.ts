import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import * as Str from "visual/utils/string/specs";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("subscribeToCalendarBgColorHex"),
    dvv("subscribeToCalendarBgPalette")
  );

  const isDisabledIcon = !Str.read(dvv("iconName"));

  return [
    {
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "subscribeToCalendarTypography",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarEventCalendarSubscribeButton",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 70,
      options: [
        {
          id: "eventCalendarSubscribeButtonTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "eventCalendarSubscribeButtonTab",
              label: t("Icon"),
              options: [
                {
                  id: "icon",
                  label: t("Icon"),
                  type: "iconSetter-dev",
                  devices: "desktop",
                  config: { canDelete: true }
                },
                {
                  id: "iconPosition",
                  label: t("Position"),
                  devices: "desktop",
                  type: "radioGroup-dev",
                  disabled: isDisabledIcon,
                  choices: [
                    { value: "left", icon: "nc-align-left" },
                    { value: "right", icon: "nc-align-right" }
                  ]
                },
                {
                  id: "iconSizeGroup",
                  type: "group-dev",
                  devices: "desktop",
                  disabled: isDisabledIcon,
                  options: [
                    {
                      id: "iconSize",
                      label: t("Size"),
                      type: "radioGroup-dev",
                      choices: [
                        { value: "small", icon: "nc-16" },
                        { value: "medium", icon: "nc-24" },
                        { value: "large", icon: "nc-32" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "iconCustomSize",
                      type: "slider-dev",
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
                  type: "slider-dev",
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
      type: "popover-dev",
      config: {
        title: t("Colors"),
        size: "auto",
        icon: {
          style: {
            backgroundColor: hexToRgba(
              colorHex,
              dvv("subscribeToCalendarBgColorOpacity")
            )
          }
        }
      },
      devices: "desktop",
      position: 80,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabBgColor",
              label: t("Bg"),
              options: [
                {
                  id: "subscribeToCalendar",
                  type: "backgroundColor-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabColor",
              label: t("Text"),
              options: [
                {
                  id: "subscribeToCalendarColor",
                  type: "colorPicker-dev",
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
                  type: "border-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },

            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "subscribeToCalendarBoxShadow",
                  type: "boxShadow-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "subscribeToCalendarHorizontalAlign",
      type: "toggle-dev",
      position: 30,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 40,
      options: [
        {
          id: "subscribeToCalendarText",
          label: t("Text"),
          type: "inputText-dev",
          devices: "desktop"
        },
        {
          id: "subscribeToCalendarWidth",
          label: t("Width"),
          type: "slider-dev",
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
          type: "slider-dev",
          config: {
            min: 15,
            max: 500,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    }
  ];
};
