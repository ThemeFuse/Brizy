import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  return [
    {
      id: "popoverCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-woo-cart",
        title: t("Shop Cart")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Cart"),
              options: [
                {
                  id: "subtotal",
                  label: t("Subtotal"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "purchases",
                  label: t("Cart Items"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "purchasesType",
                  type: "radioGroup-dev",
                  label: t("Style"),
                  devices: "desktop",
                  disabled: v.purchases === "off",
                  choices: [
                    {
                      value: "plain",
                      icon: "nc-cart-items-1",
                      title: t("Plain")
                    },
                    {
                      value: "bubble",
                      icon: "nc-cart-items-2",
                      title: t("Bubble")
                    }
                  ]
                }
              ]
            },
            {
              id: "tabIcon",
              label: t("Icon"),
              options: [
                {
                  id: "iconCustomSize",
                  type: "slider-dev",
                  label: t("Size"),
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                },
                {
                  id: "spacing",
                  type: "slider-dev",
                  disabled: v.subtotal === "off" && v.purchases === "off",
                  label: t("Spacing"),
                  config: {
                    min: 0,
                    max: 100,
                    disabled: v.subtotal !== "on",
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            }
          ]
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
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "tabsTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabsTypographyPrice",
              label: t("Total"),
              options: [
                {
                  id: "typography",
                  type: "typography-dev",
                  disabled: v.subtotal !== "on",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabsTypographyPurchases",
              label: t("Item"),
              options: [
                {
                  id: "purchases",
                  type: "typography-dev",
                  disabled:
                    v.purchases === "off" || v.purchasesType !== "plain",
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
            backgroundColor: hexToRgba(colorHex, dvv("colorOpacity"))
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "tabsToolbarColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "BgColorTab",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "colorTab",
              label: t("Total"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  disabled: v.subtotal !== "on",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "IconColorTab",
              label: t("Icon"),
              options: [
                {
                  id: "iconColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "PurchasesColorTab",
              label: t("Item"),
              options: [
                {
                  id: "purchasesColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  disabled:
                    v.purchases === "off" || v.purchasesType !== "plain",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "BorderTab",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "BubbleTab",
              label: t("Bub."),
              options: [
                {
                  id: "bubbleColor",
                  type: "colorPicker-dev",
                  disabled:
                    v.purchases === "off" || v.purchasesType !== "bubble",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "BubbleBgTab",
              label: t("Bub. Bg"),
              options: [
                {
                  id: "bubbleBgColor",
                  type: "colorPicker-dev",
                  disabled:
                    v.purchases === "off" || v.purchasesType !== "bubble",
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
      id: "sidebar",
      type: "toggle-dev",
      position: 100,
      choices: [
        {
          icon: "nc-link-sidebar",
          title: t("Sidebar"),
          value: "open"
        },
        {
          icon: "nc-link-sidebar",
          title: t("Sidebar"),
          value: "close"
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110
    }
  ];
}
