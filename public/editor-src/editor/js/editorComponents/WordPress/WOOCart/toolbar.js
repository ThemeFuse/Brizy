import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const purchasesType = dvv("purchasesType");
  const subtotal = dvv("subtotal");

  const purchasesOff = dvv("purchases") === "off";
  const plainType = purchasesType !== "plain";
  const bubbleType = purchasesType !== "bubble";

  const color = getColorToolbar(
    dvv("colorPalette"),
    dvv("colorHex"),
    dvv("colorOpacity")
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
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Cart"),
              options: [
                {
                  id: "subtotal",
                  label: t("Subtotal"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "purchases",
                  label: t("Cart Items"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "purchasesType",
                  type: "radioGroup",
                  label: t("Style"),
                  devices: "desktop",
                  disabled: purchasesOff,
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
                  type: "slider",
                  label: t("Size"),
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                },
                {
                  id: "spacing",
                  type: "slider",
                  disabled: subtotal === "off" && purchasesOff,
                  label: t("Spacing"),
                  config: {
                    min: 0,
                    max: 100,
                    disabled: subtotal !== "on",
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
      type: "popover",
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
          type: "tabs",
          tabs: [
            {
              id: "tabsTypographyPrice",
              label: t("Total"),
              options: [
                {
                  id: "typography",
                  type: "typography",
                  disabled: subtotal !== "on",
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
                  type: "typography",
                  disabled: purchasesOff || plainType,
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
          id: "tabsToolbarColor",
          type: "tabs",
          tabs: [
            {
              id: "BgColorTab",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
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
                  type: "colorPicker",
                  devices: "desktop",
                  disabled: subtotal !== "on",
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
                  type: "colorPicker",
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
                  type: "colorPicker",
                  devices: "desktop",
                  disabled: purchasesOff || plainType,
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
                  type: "border",
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
                  type: "colorPicker",
                  disabled: purchasesOff || bubbleType,
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
                  type: "colorPicker",
                  disabled: purchasesOff || bubbleType,
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
      type: "toggle",
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
      position: 110,
      devices: "desktop"
    }
  ];
}
