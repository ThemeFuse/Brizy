import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ key, v, device });

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
                  id: "navIcon",
                  label: t("Icon"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    {
                      value: "none",
                      title: "None",

                      icon: "nc-none"
                    },
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
              defaultValueValue({ v, key: "bgColorOpacity", device }) > 0
                ? hexToRgba(bgColorHex, v.bgColorOpacity)
                : hexToRgba(colorHex, v.colorOpacity)
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
        {
          icon: "nc-text-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-text-align-right",
          title: t("Align"),
          value: "right"
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}
