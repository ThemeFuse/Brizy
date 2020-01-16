import { t } from "visual/utils/i18n";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { hexToRgba } from "visual/utils/color";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarElementEmbedCode,
  toolbarSizeWidthWidthPercent,
  toolbarBorderRadius,
  toolbarBorder2,
  toolbarBorderColorHexField2,
  toolbarBorderWidthFourFields2,
  toolbarBoxShadow2,
  toolbarBoxShadowHexField2,
  toolbarBoxShadowFields2,
  toolbarHoverTransition,
  toolbarDisabledAdvancedSettings
} from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const { hex: borderColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device }),
    defaultValueValue({ v, key: "borderColorPalette", device })
  );

  return [
    {
      id: defaultValueKey({
        key: "popoverCode",
        device,
        state: "normal"
      }),
      type: "popover",
      icon: "nc-iframe",
      size: "large",
      title: t("Embed"),
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        toolbarElementEmbedCode({
          v,
          device,
          devices: "desktop",
          state: "normal"
        })
      ]
    },
    {
      id: defaultValueKey({ key: "popoverColor", device, state: "normal" }),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      devices: "desktop",
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(borderColorHex, v.borderColorOpacity)
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                toolbarBorder2({
                  v,
                  device,
                  states: [NORMAL, HOVER],
                  state,
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
                          states: [NORMAL, HOVER],
                          state,
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
                        toolbarBorderWidthFourFields2({
                          v,
                          device,
                          states: [NORMAL, HOVER],
                          state,
                          onChangeType: ["onChangeBorderWidthType2"],
                          onChangeGrouped: [
                            "onChangeBorderWidthGrouped2",
                            "onChangeBorderWidthGroupedDependencies2"
                          ],
                          onChangeUngrouped: [
                            "onChangeBorderWidthUngrouped2",
                            "onChangeBorderWidthUngroupedDependencies2"
                          ]
                        })
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                toolbarBoxShadow2({
                  v,
                  device,
                  states: [NORMAL, HOVER],
                  state,
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
                          states: [NORMAL, HOVER],
                          state,
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
                          states: [NORMAL, HOVER],
                          state,
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
    },
    toolbarDisabledAdvancedSettings({ device }),
    {
      id: defaultValueKey({ key: "toolbarSettings", device, state: "normal" }),
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        toolbarSizeWidthWidthPercent({
          v,
          device,
          state: "normal"
        }),
        {
          id: defaultValueKey({
            key: "advancedSettings",
            device,
            state: "normal"
          }),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog",
          options: [
            {
              id: "settingsTabs",
              type: "tabs",
              devices: "desktop",
              align: "start",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Styling"),
                  tabIcon: "nc-styling",
                  devices: "desktop",
                  options: [
                    toolbarBorderRadius({
                      v,
                      device,
                      state: "normal",
                      devices: "desktop",
                      onChangeGrouped: [
                        "onChangeBorderRadiusGrouped",
                        "onChangeBorderRadiusGroupedDependencies"
                      ],
                      onChangeUngrouped: [
                        "onChangeBorderRadiusUngrouped",
                        "onChangeBorderRadiusUngroupedDependencies"
                      ]
                    })
                  ]
                },
                {
                  id: defaultValueKey({
                    key: "moreSettingsAdvanced",
                    device,
                    state: "normal"
                  }),
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: [
                    toolbarHoverTransition({
                      v,
                      device,
                      state: "normal",
                      devices: "desktop",
                      position: 100
                    })
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
