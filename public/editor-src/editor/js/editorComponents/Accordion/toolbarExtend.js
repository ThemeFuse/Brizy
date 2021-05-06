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
                  id: "tagName",
                  label: t("HTML Tag"),
                  type: "select-dev",
                  choices: [
                    { title: t("SPAN"), value: "span" },
                    { title: t("DIV"), value: "div" },
                    { title: t("P"), value: "p" },
                    { title: t("H1"), value: "h1" },
                    { title: t("H2"), value: "h2" },
                    { title: t("H3"), value: "h3" },
                    { title: t("H4"), value: "h4" },
                    { title: t("H5"), value: "h5" },
                    { title: t("H6"), value: "h6" },
                    { title: t("PRE"), value: "pre" }
                  ]
                },
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
