import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";

import {
  toolbarElementFbEmbedType,
  toolbarElementFbEmbedPostAndVideoShowText,
  toolbarElementFbEmbedVideoAllowFullScreen,
  toolbarElementFbEmbedVideoAutoPlay,
  toolbarElementFbEmbedVideoCaptions,
  toolbarElementFbEmbedPostHref,
  toolbarElementFbEmbedVideoHref,
  toolbarBorder2,
  toolbarBorderColorHexField2,
  toolbarBorderWidthFourFields2,
  toolbarBoxShadow2,
  toolbarBoxShadowHexField2,
  toolbarBoxShadowFields2,
  toolbarCustomCSS,
  toolbarHoverTransition,
  toolbarDisabledHorizontalAlign,
  toolbarDisabledToolbarSettings
} from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const { hex: borderColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device, state }),
    defaultValueValue({ v, key: "borderColorPalette", device, state })
  );

  return [
    {
      id: defaultValueKey({
        key: "popoverCurrentElement",
        device,
        state: "normal"
      }),
      type: "popover",
      icon: "nc-facebook",
      title: t("Embed"),
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Embed"),
              options: [
                toolbarElementFbEmbedType({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementFbEmbedPostHref({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementFbEmbedVideoHref({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementFbEmbedPostAndVideoShowText({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                })
              ]
            },
            {
              id: "advanced",
              label: t("Advanced"),
              options: [
                toolbarElementFbEmbedVideoAllowFullScreen({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementFbEmbedVideoAutoPlay({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementFbEmbedVideoCaptions({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: defaultValueKey({ key: "popoverColor", device, state: "normal" }),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      devices: "desktop",
      roles: ["admin"],
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(borderColorHex, v.borderColorOpacity)
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          hideHandlesWhenOne: false,
          tabs: [
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                toolbarBorder2({
                  v,
                  device,
                  state,
                  states: [NORMAL, HOVER],
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
                          state,
                          states: [NORMAL, HOVER],
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
                          state,
                          states: [NORMAL, HOVER],
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
                  state,
                  states: [NORMAL, HOVER],
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
                          state,
                          states: [NORMAL, HOVER],
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
                          state,
                          states: [NORMAL, HOVER],
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
    toolbarDisabledToolbarSettings({ device }),
    {
      id: defaultValueKey({
        key: "advancedSettings",
        device,
        state: "normal"
      }),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
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
              options: []
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
                toolbarCustomCSS({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                }),
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
    },
    toolbarDisabledHorizontalAlign({
      device,
      state: "normal"
    })
  ];
}
