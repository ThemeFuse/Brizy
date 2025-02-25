import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const color = getColorToolbar(
    dvv("buttonColorPalette"),
    dvv("buttonColorHex"),
    dvv("buttonColorOpacity")
  );

  return [
    {
      id: "popoverCurrentElement",
      type: "popover",
      config: {
        icon: "nc-woo-cart",
        title: t("Shop Cart")
      },
      position: 60,
      options: [
        {
          id: "buttonDirection",
          label: t("Buttons"),
          type: "radioGroup",
          devices: "desktop",
          choices: [
            { value: "inline", icon: "nc-cart-inline" },
            { value: "column", icon: "nc-cart-column" }
          ]
        },
        {
          id: "borderRadiusTypeGroup",
          type: "group",
          devices: "desktop",
          options: [
            {
              id: "buttonBorderRadiusType",
              label: t("Corner"),
              type: "radioGroup",
              choices: [
                { value: "square", icon: "nc-corners-square" },
                { value: "rounded", icon: "nc-corners-round" },
                { value: "custom", icon: "nc-more" }
              ]
            },
            {
              id: "buttonBorderRadius",
              type: "slider",
              disabled: dvv("buttonBorderRadiusType") !== "custom",
              config: {
                min: 0,
                max: 400,
                units: [{ title: "px", value: "px" }]
              }
            }
          ]
        },
        {
          id: "buttonSpacing",
          label: t("Spacing"),
          type: "slider",
          devices: "desktop",
          config: {
            min: 5,
            max: 50,
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
          id: "button",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor2",
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
          id: "tabsToolbarColor",
          type: "tabs",
          tabs: [
            {
              id: "buttonColorTab",
              label: t("Color"),
              options: [
                {
                  id: "buttonColor",
                  type: "colorPicker",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "buttonBgColorTab",
              label: t("Overlay"),
              options: [
                {
                  id: "buttonBgColor",
                  type: "colorPicker",
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
