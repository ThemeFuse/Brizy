import { t } from "visual/utils/i18n";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { toolbarBorderRadius } from "visual/utils/toolbar";

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
              id: dvk("titleColorTab"),
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
              id: dvk("costColorTab"),
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
              id: dvk("subtotalColorTab"),
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
              id: dvk("buttonColorTab"),
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
              id: dvk("buttonBgColorTab"),
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
    }
  ];
}
