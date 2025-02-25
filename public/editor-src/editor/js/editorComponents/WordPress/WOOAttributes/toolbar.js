import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });

  const titleEnabled = dvv("titleDisabled") === "on";

  const color = getColorToolbar(
    dvv("titleColorPalette"),
    dvv("titleColorHex"),
    dvv("titleColorOpacity")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-woo-additional",
        title: t("Product Attributes")
      },
      position: 60,
      options: [
        {
          id: "titleSpacing",
          label: t("Title"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "style",
          label: t("Style"),
          type: "radioGroup",
          devices: "desktop",
          choices: [
            { value: "table", icon: "nc-attributes-table" },
            { value: "dividers", icon: "nc-attributes-dividers" }
          ]
        },
        {
          id: "spacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "between",
          type: "slider",
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
                  type: "typography",
                  disabled: titleEnabled,
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
              id: "tabTitle",
              label: t("Title"),
              options: [
                {
                  id: "titleColor",
                  type: "colorPicker",
                  disabled: titleEnabled,
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
                  type: "colorPicker",
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
                  type: "border",
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
      type: "popover",
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
          type: "slider",
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
          id: "grid",
          type: "grid",
          config: {
            separator: true
          },
          columns: [
            {
              id: "grid-settings",
              width: 50,
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
            },
            {
              id: "grid-effects",
              width: 50,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
