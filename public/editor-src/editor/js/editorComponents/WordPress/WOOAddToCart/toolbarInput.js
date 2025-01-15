import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export const getItems = ({ v, device, state }) => {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const inputPosition = dvv("inputPosition");

  const inputColor = getColor(
    dvv("inputColorPalette"),
    dvv("inputColorHex"),
    dvv("inputColorOpacity")
  );

  return [
    {
      id: "toolbarWOOProductPage",
      type: "popover",
      config: {
        icon: "nc-woo-add-to-cart",
        title: t("Add to cart")
      },
      position: 10,
      options: [
        {
          id: "inputPosition",
          label: t("Position"),
          type: "radioGroup",
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
          disabled: inputPosition === "top" || inputPosition === "bottom",
          type: "radioGroup",
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
          disabled: inputPosition === "left" || inputPosition === "right",
          type: "radioGroup",
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
          id: "input",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
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
            backgroundColor: inputColor
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
              id: "inputColorTab",
              label: t("Text"),
              options: [
                {
                  id: "inputColor",
                  type: "colorPicker",
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
                  type: "colorPicker",
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
                  type: "border",
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
                  type: "boxShadow",
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
      type: "popover",
      config: {
        icon: "nc-cog"
      },
      position: 110,
      options: [
        {
          id: "inputWidth",
          label: t("Width"),
          type: "slider",
          config: {
            min: 20,
            max: 100,
            units:
              inputPosition === "left" || inputPosition === "right"
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
          type: "slider",
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
                  type: "sidebarTabsButton",
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
