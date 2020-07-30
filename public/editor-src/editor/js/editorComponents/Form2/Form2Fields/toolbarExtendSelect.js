import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarBorder2,
  toolbarBorderColorHexField2,
  toolbarBorderWidthOneField2,
  toolbarBoxShadow2,
  toolbarBoxShadowHexField2,
  toolbarBoxShadowFields2
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });
  const { hex: selectBgColorHex } = getOptionColorHexByPalette(
    dvv("selectColorHex"),
    dvv("selectColorPalette")
  );

  return [
    {
      id: "toolbarColorSelect",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              selectBgColorHex,
              dvv("selectBgColorOpacity")
            )
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "tabsSelectColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabSelectText",
              label: t("Text"),
              options: [
                {
                  id: "selectColor",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: dvk("tabSelectBg"),
              label: t("Bg"),
              options: [
                {
                  id: "selectBgColor",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: dvk("tabSelectBorder"),
              label: t("Border"),
              options: [
                toolbarBorder2({
                  v,
                  device,
                  prefix: "select",
                  state: "normal",
                  devices: "desktop",
                  onChangeStyle: [
                    "onChangeBorderStyle2",
                    "onChangeElementBorderStyleDependencies2"
                  ],
                  onChangeHex: [
                    "onChangeBorderColorHexAndOpacity2",
                    "onChangeBorderColorHexAndOpacityPalette2",
                    "onChangeElementBorderColorHexAndOpacityDependencies2"
                  ],
                  onChangePalette: [
                    "onChangeBorderColorPalette2",
                    "onChangeBorderColorPaletteOpacity2",
                    "onChangeElementBorderColorHexAndOpacityDependencies2"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 38,
                      options: [
                        toolbarBorderColorHexField2({
                          v,
                          device,
                          prefix: "select",
                          state: "normal",
                          devices: "desktop",
                          onChange: [
                            "onChangeBorderColorHexAndOpacity2",
                            "onChangeBorderColorHexAndOpacityPalette2",
                            "onChangeElementBorderColorHexAndOpacityDependencies2"
                          ]
                        })
                      ]
                    },
                    {
                      width: 54,
                      options: [
                        toolbarBorderWidthOneField2({
                          v,
                          device,
                          prefix: "select",
                          state: "normal",
                          onChange: ["onChangeBorderWidthGrouped2"]
                        })
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: dvk("tabSelectBoxShadow"),
              label: t("Shadow"),
              options: [
                toolbarBoxShadow2({
                  v,
                  device,
                  prefix: "select",
                  state: "normal",
                  devices: "desktop",
                  onChangeType: [
                    "onChangeBoxShadowType2",
                    "onChangeBoxShadowTypeDependencies2"
                  ],
                  onChangeHex: [
                    "onChangeBoxShadowHexAndOpacity2",
                    "onChangeBoxShadowHexAndOpacityPalette2",
                    "onChangeBoxShadowHexAndOpacityDependencies2"
                  ],
                  onChangePalette: [
                    "onChangeBoxShadowPalette2",
                    "onChangeBoxShadowPaletteOpacity2",
                    "onChangeBoxShadowHexAndOpacityDependencies2"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 41,
                      options: [
                        toolbarBoxShadowHexField2({
                          v,
                          device,
                          prefix: "select",
                          state: "normal",
                          devices: "desktop",
                          onChange: [
                            "onChangeBoxShadowHexAndOpacity2",
                            "onChangeBoxShadowHexAndOpacityPalette2",
                            "onChangeBoxShadowHexAndOpacityDependencies2"
                          ]
                        })
                      ]
                    },
                    {
                      width: 59,
                      options: [
                        toolbarBoxShadowFields2({
                          v,
                          device,
                          prefix: "select",
                          state: "normal",
                          devices: "desktop",
                          onChange: [
                            "onChangeBoxShadowFields2",
                            "onChangeBoxShadowFieldsDependencies2"
                          ]
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
    }
  ];
}
