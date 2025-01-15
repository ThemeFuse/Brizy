import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state: "nomal" });

  const elementType = dvv("elementType");

  const color = getColor(
    dvv("categoryColorPalette"),
    dvv("categoryColorHex"),
    dvv("categoryColorOpacity")
  );

  return [
    {
      id: "toolbarWOOProductPage",
      type: "popover",
      config: {
        icon: "nc-woo-meta",
        title: t("Product Meta")
      },
      position: 20,
      options: [
        {
          id: "elementType",
          type: "select",
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
          type: "slider",
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
          type: "slider",
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
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "tabsTypography",
          type: "tabs",
          tabs: [
            {
              id: "tabTypographyCategory",
              label: t("Category"),
              options: [
                {
                  id: "category",
                  type: "typography",
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
                  type: "typography",
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
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: color
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabCategory",
              label: t("Category"),
              options: [
                {
                  id: "categoryColor",
                  type: "colorPicker",
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
                  type: "colorPicker",
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
                  type: "colorPicker",
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
      devices: "desktop"
    }
  ];
}
