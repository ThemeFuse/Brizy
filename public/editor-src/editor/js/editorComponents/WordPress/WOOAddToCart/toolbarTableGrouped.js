import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const labelColor = getColorToolbar(
    dvv("labelColorPalette"),
    dvv("labelColorHex"),
    dvv("labelColorOpacity")
  );

  return [
    {
      id: "toolbarWOOProductPage",
      type: "popover",
      config: {
        icon: "nc-woo-2"
      },
      position: 10,
      options: [
        {
          id: "tableSpacing",
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
          id: "tabsToolbarTypography",
          type: "tabs",
          tabs: [
            {
              id: "tabLabel",
              label: t("Label"),
              options: [
                {
                  id: "label",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabValue",
              label: t("Value"),
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
      id: "popoverColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: labelColor
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "labelColorTab",
              label: t("Label"),
              options: [
                {
                  id: "labelColor",
                  type: "colorPicker",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "labelBgTab",
              label: t("Bg"),
              options: [
                {
                  id: "labelBgColor",
                  type: "colorPicker",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "valueColorTab",
              label: t("Value"),
              options: [
                {
                  id: "valueColor",
                  type: "colorPicker",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "borderColorTab",
              label: t("Border"),
              options: [
                {
                  id: "tableBorder",
                  type: "border",
                  config: {
                    width: ["grouped"]
                  }
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "tableBoxShadow",
                  type: "boxShadow",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
