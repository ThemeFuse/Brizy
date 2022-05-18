import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { NORMAL, HOVER } from "visual/utils/stateMode";

export const getItems = ({ v, device, state }) => {
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex: inputColorHex } = getOptionColorHexByPalette(
    dvv("inputColorHex"),
    dvv("inputColorPalette")
  );

  return [
    {
      id: "toolbarWOOProductPage",
      type: "popover-dev",
      config: {
        icon: "nc-woo-add-to-cart",
        title: t("Add To Cart")
      },
      position: 10,
      options: [
        {
          id: "inputPosition",
          label: t("Position"),
          type: "radioGroup-dev",
          devices: "desktop",
          choices: [
            { value: "left", icon: "nc-align-left" },
            { value: "right", icon: "nc-align-right" },
            { value: "top", icon: "nc-align-top" },
            { value: "bottom", icon: "nc-align-bottom" }
          ]
        },
        {
          id: "inputVerticalAlign",
          label: t("Align"),
          disabled: v.inputPosition === "top" || v.inputPosition === "bottom",
          type: "radioGroup-dev",
          devices: "desktop",
          choices: [
            { value: "top", icon: "nc-align-top" },
            { value: "center", icon: "nc-align-middle" },
            { value: "bottom", icon: "nc-align-bottom" }
          ]
        },
        {
          id: "inputHorizontalAlign",
          label: t("Align"),
          disabled: v.inputPosition === "left" || v.inputPosition === "right",
          type: "radioGroup-dev",
          devices: "desktop",
          choices: [
            { value: "left", icon: "nc-text-align-left" },
            { value: "center", icon: "nc-text-align-center" },
            { value: "right", icon: "nc-text-align-right" }
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
          id: "input",
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
            backgroundColor: hexToRgba(inputColorHex, dvv("inputColorOpacity"))
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "inputColorTab",
              label: t("Text"),
              options: [
                {
                  id: "inputColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "inputBgColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "inputBorder",
                  type: "border-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "inputBoxShadow",
                  type: "boxShadow-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
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
        icon: "nc-cog"
      },
      position: 110,
      options: [
        {
          id: "inputWidth",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 20,
            max: 100,
            units:
              v.inputPosition === "left" || v.inputPosition === "right"
                ? [{ value: "px", title: "px" }]
                : [
                    { value: "px", title: "px" },
                    { value: "%", title: "%" }
                  ]
          }
        },
        {
          id: "inputHeight",
          label: t("Height"),
          type: "slider-dev",
          config: {
            min: 20,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "grid",
          type: "grid",
          columns: [
            {
              id: "grid-settings",
              width: 50,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
