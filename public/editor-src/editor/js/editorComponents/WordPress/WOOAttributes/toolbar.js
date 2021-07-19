import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("titleColorHex"),
    dvv("titleColorPalette")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-woo-additional",
        title: t("Product Attributes")
      },
      position: 60,
      options: [
        {
          id: "titleGroup",
          type: "group-dev",
          options: [
            {
              id: "title",
              label: t("Title"),
              devices: "desktop",
              type: "switch-dev"
            },
            {
              id: "titleSpacing",
              label: t("Spacing"),
              type: "slider-dev",
              disabled: v.title === "odd",
              config: {
                min: 0,
                max: 100,
                units: [{ value: "px", title: "px" }]
              }
            }
          ]
        },
        {
          id: "style",
          label: t("Style"),
          type: "radioGroup-dev",
          devices: "desktop",
          choices: [
            { value: "table", icon: "nc-attributes-table" },
            { value: "dividers", icon: "nc-attributes-dividers" }
          ]
        },
        {
          id: "spacing",
          label: t("Spacing"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "between",
          type: "slider-dev",
          label: t("Between"),
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    },
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
          id: "tabsTypography",
          type: "tabs-dev",
          config: {
            showSingle: true
          },
          tabs: [
            {
              id: "tabTypographyTitle",
              label: t("Title"),
              options: [
                {
                  id: "title",
                  type: "typography-dev",
                  disabled: v.titleDisabled === "on",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabTypographyAttributes",
              label: t("Attributes"),
              options: [
                {
                  id: "attributes",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
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
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(colorHex, v.titleColorOpacity)
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabTitle",
              label: t("Title"),
              options: [
                {
                  id: "titleColor",
                  type: "colorPicker-dev",
                  disabled: v.titleDisabled === "on",
                  devices: "desktop"
                }
              ]
            },
            {
              id: "tabAttribute",
              label: t("Attributes"),
              options: [
                {
                  id: "attributeColor",
                  type: "colorPicker-dev",
                  devices: "desktop"
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
                  config: {
                    width: ["grouped"],
                    styles: ["solid", "dashed", "dotted"]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          position: 100,
          config: {
            min: 1,
            max: dvv("widthSuffix") === "%" ? 100 : 1000,
            units: [
              { value: "%", title: "%" },
              { value: "px", title: "px" }
            ]
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          position: 110,
          icon: "nc-cog"
        }
      ]
    }
  ];
}
