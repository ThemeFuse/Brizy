import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarColor2,
  toolbarColorHexField2,
  toolbarBorderWidthOneField2
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("titleColorHex"),
    dvv("titleColorPalette")
  );

  return [
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    },
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-woo-2",
        title: t("Additionals")
      },
      position: 60,
      options: [
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
          id: "tabsTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: dvk("tabTypographyTitle"),
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
              id: dvk("tabTypographyAttributes"),
              label: t("Attributes"),
              options: [
                {
                  id: "attributes",
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
            backgroundColor: hexToRgba(colorHex, v.titleColorOpacity)
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabTitle",
              label: t("Title"),
              options: [
                {
                  id: "titleColor",
                  type: "colorPicker-dev",
                  devices: "desktop"
                }
              ]
            },
            {
              id: "tabAttribute",
              label: t("Attribute"),
              options: [
                {
                  id: "attributeColor",
                  type: "colorPicker-dev",
                  devices: "desktop"
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                toolbarColor2({
                  v,
                  device,
                  state: "normal",
                  prefix: "borderColor",
                  devices: "desktop",
                  onChangeHex: [
                    "onChangeColorHexAndOpacity",
                    "onChangeColorHexAndOpacityPalette"
                  ],
                  onChangePalette: [
                    "onChangeColorPalette",
                    "onChangeColorPaletteOpacity"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 38,
                      options: [
                        toolbarColorHexField2({
                          v,
                          device,
                          state: "normal",
                          prefix: "borderColor",
                          devices: "desktop",
                          onChange: [
                            "onChangeColorHexAndOpacity",
                            "onChangeColorHexAndOpacityPalette"
                          ]
                        })
                      ]
                    },
                    {
                      width: 62,
                      options: [
                        toolbarBorderWidthOneField2({
                          v,
                          device,
                          devices: "desktop",
                          state: "normal",
                          onChange: ["onChangeBorderWidthGrouped2"]
                        })
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      icon: "nc-cog",
      position: 110
    }
  ];
}
