import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { toolbarBorderRadius } from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("buttonColorHex"),
    dvv("buttonColorPalette")
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
          id: "button",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
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
            backgroundColor: hexToRgba(colorHex, dvv("buttonColorOpacity"))
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
              id: "buttonColorTab",
              label: t("Color"),
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
              label: t("Overlay"),
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
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
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
