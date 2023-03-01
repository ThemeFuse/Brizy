import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state: "nomal" });

  const elementType = dvv("elementType");

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("categoryColorHex"),
    dvv("categoryColorPalette")
  );

  return [
    {
      id: "toolbarWOOProductPage",
      type: "popover-dev",
      config: {
        icon: "nc-woo-meta",
        title: t("Product Meta")
      },
      position: 20,
      options: [
        {
          id: "elementType",
          type: "select-dev",
          label: t("Type"),
          devices: "desktop",
          choices: [
            {
              title: t("Column"),
              value: "column"
            },
            {
              title: t("Table"),
              value: "table"
            },
            {
              title: t("Inline"),
              value: "inline"
            }
          ]
        },
        {
          id: "topSpacing",
          type: "slider-dev",
          label: t("Between"),
          disabled: elementType === "inline",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "rightSpacing",
          label: t("Spacing"),
          type: "slider-dev",
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
          tabs: [
            {
              id: "tabTypographyCategory",
              label: t("Category"),
              options: [
                {
                  id: "category",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabTypographyValue",
              label: t("Values"),
              options: [
                {
                  id: "value",
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
            backgroundColor: hexToRgba(colorHex, dvv("categoryColorOpacity"))
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
              id: "tabCategory",
              label: t("Category"),
              options: [
                {
                  id: "categoryColor",
                  type: "colorPicker-dev",
                  devices: "dekstop"
                }
              ]
            },
            {
              id: "tabValue",
              label: t("Value"),
              options: [
                {
                  id: "valueColor",
                  type: "colorPicker-dev",
                  devices: "desktop"
                }
              ]
            },
            {
              id: "tabDividers",
              label: t("Dividers"),
              options: [
                {
                  id: "dividersColor",
                  disabled: elementType === "inline",
                  type: "colorPicker-dev",
                  devices: "desktop"
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
      roles: ["admin"],
      position: 110,
      devices: "desktop",
      icon: "nc-cog"
    }
  ];
}
