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
  toolbarBoxShadow2,
  toolbarBoxShadowHexField2,
  toolbarBoxShadowFields2,
  toolbarCustomCSS,
  toolbarHoverTransition,
  toolbarDisabledHorizontalAlign
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const { hex: boxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device }),
    defaultValueValue({ v, key: "boxShadowColorPalette", device })
  );
  const { hex: hoverBoxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "hoverBoxShadowColorHex", device }),
    defaultValueValue({ v, key: "hoverBoxShadowColorPalette", device })
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
          backgroundColor: hexToRgba(boxShadowColorHex, v.boxShadowColorOpacity)
        }
      },
      options: [
        {
          id: "tabsState",
          tabsPosition: "left",
          type: "tabs",
          value: v.tabsState,
          tabs: [
            {
              id: "tabNormal",
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: "tabsColor",
                  type: "tabs",
                  value: v.tabsColor,
                  hideHandlesWhenOne: false,
                  tabs: [
                    {
                      id: "tabBoxShadow",
                      label: t("Shadow"),
                      options: [
                        toolbarBoxShadow2({
                          v,
                          device,
                          state: "normal",
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
                                  state: "normal",
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
                                  state: "normal",
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
            {
              id: "tabHover",
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "tabsColor",
                  type: "tabs",
                  value: v.tabsColor,
                  hideHandlesWhenOne: false,
                  tabs: [
                    {
                      id: "tabBoxShadow",
                      label: t("Shadow"),
                      icon: {
                        style: {
                          backgroundColor: hexToRgba(
                            hoverBoxShadowColorHex,
                            v.hoverBoxShadowColorOpacity
                          )
                        }
                      },
                      options: [
                        toolbarBoxShadow2({
                          v,
                          device,
                          state: "hover",
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
                                  state: "hover",
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
                                  state: "hover",
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
          ]
        }
      ],
      onChange: (_, { isOpen }) => ({
        tabsState: !isOpen ? "" : v.tabsState
      })
    },
    {
      id: defaultValueKey({ key: "toolbarLink", device, state: "normal" }),
      type: "popover",
      icon: "nc-link",
      title: t("Link"),
      devices: "desktop",
      position: 80,
      options: [
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
        })
      ]
    },
    {
      id: defaultValueKey({ key: "toolbarSettings", device, state: "normal" }),
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
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
        }
      ]
    },
    toolbarDisabledHorizontalAlign({
      device,
      state: "normal"
    })
  ];
}
