import { t } from "visual/utils/i18n";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { toolbarDisabledToolbarSettings } from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device });
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
        icon: "nc-woo-2",
        title: t("WOOCart")
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
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "purchases",
                  label: t("Purchases"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "purchasesType",
                  type: "select-dev",
                  label: t("Purchases Type"),
                  devices: "desktop",
                  disabled: v.purchases === "off",
                  choices: [
                    {
                      value: "plain",
                      title: t("Plain")
                    },
                    {
                      value: "bubble",
                      title: t("Bubble")
                    }
                  ]
                }
              ]
            },
            {
              id: "tabAdvanced",
              label: t("Advanced"),
              options: [
                {
                  id: "spacing",
                  type: "slider-dev",
                  disabled:
                    (v.subtotal === "off" && v.purchases === "off") ||
                    (v.purchases === "on" && v.purchasesType === "bubble"),
                  label: t("Spacing"),
                  config: {
                    min: 0,
                    max: 100,
                    disabled: v.subtotal !== "on",
                    units: [{ value: "px", title: "px" }]
                  }
                },
                {
                  id: "iconCustomSize",
                  type: "slider-dev",
                  label: t("Icon"),
                  config: {
                    min: 0,
                    max: 100,
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
          type: "tabs",
          tabs: [
            {
              id: "tabsTypographyPrice",
              label: t("Price"),
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
              label: t("Purchases"),
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
          id: dvk("tabsToolbarColor"),
          type: "tabs",
          tabs: [
            {
              id: dvk("BgColorTab"),
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
              id: dvk("colorTab"),
              label: t("Color"),
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
              id: dvk("IconColorTab"),
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
              id: dvk("PurchasesColorTab"),
              label: t("Prch."),
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
              id: dvk("BorderTab"),
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev",
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
      id: dvk("advancedSettings"),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog"
    },
    toolbarDisabledToolbarSettings({ v, device })
  ];
}
