import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { toolbarBorderRadius } from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("titleColorHex"),
    dvv("titleColorPalette")
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
          id: "buttonDirection",
          label: t("Buttons"),
          type: "select-dev",
          devices: "desktop",
          choices: [
            {
              value: "inline",
              title: "Inline"
            },
            {
              value: "column",
              title: "Column"
            }
          ]
        },
        {
          id: "buttonSpacing",
          label: t("Spacing"),
          type: "slider-dev",
          devices: "desktop",
          config: {
            min: 5,
            max: 50,
            units: [{ value: "px", title: "px" }]
          }
        },
        toolbarBorderRadius({
          v,
          device,
          prefix: "button",
          state: "normal",
          devices: "desktop",
          onChangeGrouped: ["onChangeBorderRadiusGrouped"],
          onChangeUngrouped: ["onChangeBorderRadiusUngrouped"]
        })
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
          type: "tabs",
          tabs: [
            {
              id: "tabsTypographyTitle",
              label: t("Title"),
              options: [
                {
                  id: "title",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabsTypographyCost",
              label: t("Price"),
              options: [
                {
                  id: "cost",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabsTypographySubtotal",
              label: t("Subtotal"),
              options: [
                {
                  id: "subtotal",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabsTypographyButton",
              label: t("Button"),
              options: [
                {
                  id: "button",
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
      id: "toolbarColor2",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(colorHex, dvv("titleColorOpacity"))
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
              id: "titleColorTab",
              label: t("Title"),
              options: [
                {
                  id: "titleColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "costColorTab",
              label: t("Price"),
              options: [
                {
                  id: "costColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "subtotalColorTab",
              label: t("Sub."),
              options: [
                {
                  id: "subtotalColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "buttonColorTab",
              label: t("Btn."),
              options: [
                {
                  id: "buttonColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "buttonBgColorTab",
              label: t("Bg Btn."),
              options: [
                {
                  id: "buttonBgColor",
                  type: "colorPicker-dev",
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
      id: "cartHorizontalAlign",
      type: "toggle-dev",
      disabled: dvv("sidebarWidth") >= 100 && dvv("sidebarWidthSuffix") === "%",
      position: 90,
      choices: [
        { icon: "nc-hrz-align-left", title: t("Align"), value: "left" },
        { icon: "nc-hrz-align-center", title: t("Align"), value: "center" },
        { icon: "nc-hrz-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "cartVerticalAlign",
      type: "toggle-dev",
      disabled:
        dvv("sidebarHeightStyle") === "fullHeight" ||
        (dvv("sidebarHeight") >= 100 && dvv("sidebarHeightSuffix") === "vh"),
      position: 110,
      choices: [
        { icon: "nc-ver-align-top", title: t("Align"), value: "top" },
        { icon: "nc-ver-align-middle", title: t("Align"), value: "center" },
        { icon: "nc-ver-align-bottom", title: t("Align"), value: "bottom" }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "sidebarWidth",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: dvv("sidebarWidthSuffix") === "px" ? 500 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "groupHeight",
          type: "group-dev",
          position: 100,
          options: [
            {
              id: "sidebarHeightStyle",
              label: t("Height"),
              type: "select-dev",
              choices: [
                { title: t("Auto"), value: "auto" },
                { title: t("Custom"), value: "custom" },
                { title: t("Full Height"), value: "fullHeight" }
              ]
            },
            {
              id: "sidebarHeight",
              type: "slider-dev",
              disabled: dvv("sidebarHeightStyle") !== "custom",
              config: {
                min: 20,
                max: dvv("sidebarHeightSuffix") === "px" ? 500 : 100,
                units: [
                  { title: "px", value: "px" },
                  { title: "%", value: "vh" }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: "duplicate",
      type: "button",
      disabled: true
    },
    {
      id: "remove",
      type: "button",
      disabled: true
    }
  ];
}
