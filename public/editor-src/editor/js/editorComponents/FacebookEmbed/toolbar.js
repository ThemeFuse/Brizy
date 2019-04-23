import { t } from "visual/utils/i18n";
import { toolbarCustomCSS } from "visual/utils/toolbar";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";

import {
  toolbarBoxShadowHexAndOpacity,
  toolbarBoxShadowPalette,
  toolbarBoxShadowFields,
  toolbarBoxShadow,
  toolbarHoverTransition
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";

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
      id: "toolbarCurrentElement",
      type: "popover",
      icon: "nc-facebook",
      title: t("Embed"),
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
                {
                  id: "type",
                  type: "select",
                  label: t("Embed"),
                  choices: [
                    {
                      title: t("Post"),
                      value: "post"
                    },
                    {
                      title: t("Video"),
                      value: "video"
                    }
                  ],
                  value: v.type
                },
                {
                  id: "postAndVideoShowText",
                  label: t("Include Full Post"),
                  type: "switch",
                  value: v.postAndVideoShowText
                }
              ]
            },
            {
              id: "advanced",
              label: t("Advanced"),
              disabled: v.type === "video" ? false : true,
              options: [
                {
                  id: "videoAllowFullScreen",
                  label: t("Full Screen"),
                  type: "switch",
                  value: v.videoAllowFullScreen
                },
                {
                  id: "videoAutoPlay",
                  label: t("AutoPlay"),
                  type: "switch",
                  value: v.videoAutoPlay
                },
                {
                  id: "videoCaptions",
                  label: t("Captions"),
                  type: "switch",
                  value: v.videoCaptions
                }
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
                        toolbarBoxShadowHexAndOpacity({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBoxShadowHexAndOpacity",
                            "onChangeBoxShadowHexAndOpacityPalette",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        }),
                        toolbarBoxShadowPalette({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBoxShadowPalette",
                            "onChangeBoxShadowPaletteOpacity",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 41,
                              options: [
                                toolbarBoxShadowFields({
                                  v,
                                  device,
                                  state: "normal",
                                  onChange: [
                                    "onChangeBoxShadowHexAndOpacity",
                                    "onChangeBoxShadowHexAndOpacityPalette",
                                    "onChangeBoxShadowHexAndOpacityDependencies"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 59,
                              options: [
                                toolbarBoxShadow({
                                  v,
                                  device,
                                  state: "normal"
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
                        toolbarBoxShadowHexAndOpacity({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBoxShadowHexAndOpacity",
                            "onChangeBoxShadowHexAndOpacityPalette",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        }),
                        toolbarBoxShadowPalette({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBoxShadowPalette",
                            "onChangeBoxShadowPaletteOpacity",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 41,
                              options: [
                                toolbarBoxShadowFields({
                                  v,
                                  device,
                                  state: "hover",
                                  onChange: [
                                    "onChangeBoxShadowHexAndOpacity",
                                    "onChangeBoxShadowHexAndOpacityPalette",
                                    "onChangeBoxShadowHexAndOpacityDependencies"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 59,
                              options: [
                                toolbarBoxShadow({
                                  v,
                                  device,
                                  state: "hover"
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
        tabsState: !isOpen ? "tabNormal" : v.tabsState
      })
    },
    {
      id: "toolbarLink",
      type: "popover",
      icon: "nc-link",
      title: t("Link"),
      position: 80,
      options: [
        {
          id: "postHref",
          label: t("Link"),
          type: "input",
          disabled: v.type === "post" ? false : true,
          placeholder: t("Link"),
          value: {
            value: v.postHref
          },
          onChange: ({ value: postHref }) => ({
            postHref
          })
        },
        {
          id: "videoHref",
          label: t("Link"),
          type: "input",
          disabled: v.type === "video" ? false : true,
          placeholder: t("Link"),
          value: {
            value: v.videoHref
          },
          onChange: ({ value: videoHref }) => ({
            videoHref
          })
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
                  options: []
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: [
                    toolbarCustomCSS({ v }),
                    toolbarHoverTransition({ v, position: 100 })
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true
    }
  ];
}

export function getItemsForTablet(v) {
  const device = "tablet";

  const { hex: tabletBoxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device }),
    defaultValueValue({ v, key: "boxShadowColorPalette", device })
  );
  return [
    {
      id: "tabletToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            tabletBoxShadowColorHex,
            v.tabletBoxShadowColorOpacity
          )
        }
      },
      options: [
        {
          id: "tabletTabsColor",
          type: "tabs",
          hideHandlesWhenOne: false,
          tabs: [
            {
              id: "tabletBoxShadow",
              label: t("Shadow"),
              options: [
                toolbarBoxShadowHexAndOpacity({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBoxShadowHexAndOpacity",
                    "onChangeBoxShadowHexAndOpacityPalette",
                    "onChangeBoxShadowHexAndOpacityDependencies"
                  ]
                }),
                toolbarBoxShadowPalette({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBoxShadowPalette",
                    "onChangeBoxShadowPaletteOpacity",
                    "onChangeBoxShadowHexAndOpacityDependencies"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 41,
                      options: [
                        toolbarBoxShadowFields({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBoxShadowHexAndOpacity",
                            "onChangeBoxShadowHexAndOpacityPalette",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        })
                      ]
                    },
                    {
                      width: 59,
                      options: [
                        toolbarBoxShadow({
                          v,
                          device,
                          state: "normal"
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
      id: "tabletHorizontalAlign",
      type: "toggle",
      disabled: true
    }
  ];
}

export function getItemsForMobile(v) {
  const device = "mobile";

  const { hex: mobileBoxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device }),
    defaultValueValue({ v, key: "boxShadowColorPallete", device })
  );

  return [
    {
      id: "mobileToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            mobileBoxShadowColorHex,
            v.mobileBoxShadowColorOpacity
          )
        }
      },
      options: [
        {
          id: "mobileTabsColor",
          className: "",
          type: "tabs",
          hideHandlesWhenOne: false,
          tabs: [
            {
              id: "mobileBoxShadow",
              label: t("Shadow"),
              options: [
                toolbarBoxShadowHexAndOpacity({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBoxShadowHexAndOpacity",
                    "onChangeBoxShadowHexAndOpacityPalette",
                    "onChangeBoxShadowHexAndOpacityDependencies"
                  ]
                }),
                toolbarBoxShadowPalette({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBoxShadowPalette",
                    "onChangeBoxShadowPaletteOpacity",
                    "onChangeBoxShadowHexAndOpacityDependencies"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 41,
                      options: [
                        toolbarBoxShadowFields({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBoxShadowHexAndOpacity",
                            "onChangeBoxShadowHexAndOpacityPalette",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        })
                      ]
                    },
                    {
                      width: 59,
                      options: [
                        toolbarBoxShadow({
                          v,
                          device,
                          state: "normal"
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
      id: "mobileHorizontalAlign",
      type: "toggle",
      disabled: true
    }
  ];
}
