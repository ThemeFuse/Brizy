import { ElementModel } from "visual/component/Elements/Types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import { ToolbarItemType } from "../ToolbarItemType";

export interface Value extends ElementModel {
  bgColorHex: string;
  bgColorPalette: string;
  bgColorOpacity: number;

  colorHex: string;
  colorPalette: string;
  colorOpacity: number;

  navIcon: "none" | "thin" | "heavy" | "tail" | "filled" | "outline";
  navIconSize: "small" | "medium" | "large" | "custom";
}

export function getItems({
  v,
  device
}: {
  v: Value;
  device: ResponsiveMode;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ key, v, device });

  // Color
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-toggle",
        title: t("Accordion")
      },
      position: 60,
      options: [
        {
          id: "media",
          type: "tabs-dev",
          position: 60,
          tabs: [
            {
              id: "accordion",
              label: t("Accordion"),
              options: [
                {
                  id: "collapsible",
                  label: t("Collapsible"),
                  devices: "desktop",
                  type: "switch-dev"
                },
                {
                  id: "animDuration",
                  type: "slider-dev",
                  label: t("Duration"),
                  config: {
                    min: 0,
                    max: 2,
                    step: 0.1,
                    units: [{ value: "s", title: "s" }]
                  }
                }
              ]
            },
            {
              id: "tabIcon",
              label: t("Icon"),
              position: 80,
              options: [
                {
                  id: "navIcon",
                  label: t("Icon"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    { value: "none", title: "None", icon: "nc-none" },
                    {
                      value: "thin",
                      title: "Thin",
                      icon: "nc-down-arrow-thin"
                    },
                    {
                      value: "heavy",
                      title: "Heavy",
                      icon: "nc-down-arrow-heavy"
                    },
                    {
                      value: "tail",
                      title: "Tail",
                      icon: "nc-down-arrow-tail"
                    },
                    {
                      value: "filled",
                      title: "Round",
                      icon: "nc-down-arrow-filled"
                    },
                    {
                      value: "outline",
                      title: "Outline",
                      icon: "nc-down-arrow-outline"
                    }
                  ]
                },
                {
                  id: "groupSettings",
                  type: "group-dev",
                  disabled: dvv("navIcon") === "none",
                  options: [
                    {
                      id: "navIconSize",
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
                      id: "navIconCustomSize",
                      type: "slider-dev",
                      disabled: dvv("navIconSize") !== "custom",
                      config: {
                        min: 8,
                        max: 100,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "spacing",
                  type: "slider-dev",
                  label: t("Spacing"),
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            },
            {
              id: "tags",
              label: t("Tags"),
              position: 80,
              options: []
            }
          ]
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "popoverColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor:
              dvv("bgColorOpacity") > 0
                ? hexToRgba(bgColorHex, dvv("bgColorOpacity"))
                : hexToRgba(colorHex, dvv("colorOpacity"))
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "boxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow-dev",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "advancedSettings",
      // @ts-expect-error: Need transform to ts
      type: "advancedSettings",
      devices: "desktop",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}
