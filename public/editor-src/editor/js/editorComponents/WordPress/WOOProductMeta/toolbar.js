import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "nomal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "nomal" });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("categoryColorHex"),
    dvv("categoryColorPalette")
  );

  return [
    {
      id: "toolbarWOOProductPage",
      type: "popover-dev",
      config: {
        icon: "nc-woo-2"
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
          disabled: v.elementType === "inline",
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
              id: dvk("tabTypographyCategory"),
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
              id: dvk("tabTypographyValue"),
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
            backgroundColor: hexToRgba(colorHex, v.categoryColorOpacity)
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
              id: "tabDviders",
              label: t("Dviders"),
              options: [
                {
                  id: "dvidersColor",
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
      id: dvk("advancedSettings"),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog"
    }
  ];
}
