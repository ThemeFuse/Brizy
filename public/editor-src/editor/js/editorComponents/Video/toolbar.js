import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { t } from "visual/utils/i18n";

import {
  toolbarElementVideoLink,
  toolbarElementVideoRatio,
  toolbarElementVideoControls,
  toolbarElementVideoCover,
  toolbarElementVideoCoverZoom,
  toolbarElementVideoPlaySize,
  toolbarBgColorHexAndOpacity,
  toolbarBgColorPalette,
  toolbarBgColorFields,
  toolbarSizeSizeSizePercent,
  toolbarBoxShadowHexAndOpacity,
  toolbarBoxShadowPalette,
  toolbarBoxShadowFields,
  toolbarBoxShadowBlur,
  toolbarBoxShadowSpread,
  toolbarBoxShadowVertical,
  toolbarBoxShadowHorizontal
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device }),
    defaultValueValue({ v, key: "bgColorPalette", device })
  );

  const { hex: boxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device }),
    defaultValueValue({ v, key: "borderColorPalette", device })
  );

  return [
    {
      id: "toolbarVideo",
      type: "popover",
      icon: "nc-play",
      title: t("Video"),
      position: 80,
      options: [
        {
          id: "videoTabs",
          type: "tabs",
          tabs: [
            {
              id: "videoTab",
              label: t("Video"),
              options: [
                toolbarElementVideoLink({ v }),
                toolbarElementVideoRatio({ v }),
                toolbarElementVideoControls({ v })
              ]
            },
            {
              id: "coverTab",
              label: t("Cover"),
              options: [
                toolbarElementVideoCover({ v }),
                toolbarElementVideoCoverZoom({ v }),
                toolbarElementVideoPlaySize({ v })
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 90,
      disabled: v.coverImageSrc === "",
      icon: {
        style: {
          backgroundColor: hexToRgba(bgColorHex, v.bgColorOpacity)
        }
      },
      options: [
        {
          id: "color",
          tabsPosition: "left",
          type: "tabs",
          tabs: [
            {
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                toolbarBgColorHexAndOpacity({
                  v,
                  device,
                  state: "normal",
                  prefix: "bg",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette"
                  ]
                }),
                toolbarBgColorPalette({
                  v,
                  device,
                  state: "normal",
                  prefix: "bg",
                  onChange: [
                    "onChangeBgColorPalette",
                    "onChangeBgColorPaletteOpacity"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 100,
                      options: [
                        toolbarBgColorFields({
                          v,
                          device,
                          state: "normal",
                          prefix: "bg",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette"
                          ]
                        })
                      ]
                    }
                  ]
                }
              ]
            },
            {
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                toolbarBgColorHexAndOpacity({
                  v,
                  device,
                  state: "hover",
                  prefix: "bg",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette"
                  ]
                }),
                toolbarBgColorPalette({
                  v,
                  device,
                  state: "hover",
                  prefix: "bg",
                  onChange: [
                    "onChangeBgColorPalette",
                    "onChangeBgColorPaletteOpacity"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 100,
                      options: [
                        toolbarBgColorFields({
                          v,
                          device,
                          state: "hover",
                          prefix: "bg",
                          onChange: [
                            "onChangeBgColorHexAndOpacity",
                            "onChangeBgColorHexAndOpacityPalette"
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
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        toolbarSizeSizeSizePercent({ v, device }),
        {
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog",
          options: [
            {
              id: "settingsTabs",
              type: "tabs",
              align: "start",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Styling"),
                  tabIcon: "nc-styling",
                  options: [
                    {
                      type: "multiPicker",
                      picker: {
                        id: "boxShadow",
                        label: t("Shadow"),
                        type: "switch",
                        value: v.boxShadow
                      },
                      choices: {
                        on: [
                          {
                            id: "boxShadowColors",
                            type: "popover",
                            size: "auto",
                            label: t("Color"),
                            title: t("Color"),
                            icon: {
                              style: {
                                backgroundColor: hexToRgba(
                                  boxShadowColorHex,
                                  v.boxShadowColorOpacity
                                )
                              }
                            },
                            options: [
                              toolbarBoxShadowHexAndOpacity({
                                v,
                                device,
                                state: "normal",
                                onChange: [
                                  "onChangeBoxShadowHexAndOpacity",
                                  "onChangeBoxShadowHexAndOpacityPalette"
                                ]
                              }),
                              toolbarBoxShadowPalette({
                                v,
                                device,
                                state: "normal",
                                onChange: [
                                  "onChangeBoxShadowPalette",
                                  "onChangeBoxShadowPaletteOpacity"
                                ]
                              }),
                              {
                                type: "grid",
                                className: "brz-ed-grid__color-fileds",
                                columns: [
                                  {
                                    width: 100,
                                    options: [
                                      toolbarBoxShadowFields({
                                        v,
                                        device,
                                        state: "normal",
                                        onChange: [
                                          "onChangeBoxShadowHexAndOpacity",
                                          "onChangeBoxShadowHexAndOpacityPalette"
                                        ]
                                      })
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                          toolbarBoxShadowBlur({ v, device, state: "normal" }),
                          toolbarBoxShadowSpread({
                            v,
                            device,
                            state: "normal"
                          }),
                          toolbarBoxShadowVertical({
                            v,
                            device,
                            state: "normal"
                          }),
                          toolbarBoxShadowHorizontal({
                            v,
                            device,
                            state: "normal"
                          })
                        ]
                      }
                    }
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: []
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}

export function getItemsForTablet(v) {
  const device = "tablet";
  return [
    {
      id: "tabletToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [toolbarSizeSizeSizePercent({ v, device })]
    }
  ];
}

export function getItemsForMobile(v) {
  const device = "mobile";
  return [
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [toolbarSizeSizeSizePercent({ v, device })]
    }
  ];
}
