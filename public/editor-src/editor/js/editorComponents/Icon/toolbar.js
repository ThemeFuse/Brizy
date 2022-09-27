import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { t } from "visual/utils/i18n";
import {
  defaultValueValue,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";
import {
  toolbarLinkAnchor,
  toolbarStoryAnchor,
  toolbarLinkExternal
} from "visual/utils/toolbar";
import { IS_GLOBAL_POPUP, IS_STORY } from "visual/utils/models";
import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItemsForDesktop(v, component) {
  const inPopup = Boolean(component.props.meta?.sectionPopup);
  const inPopup2 = Boolean(component.props.meta?.sectionPopup2);
  const device = "desktop";
  const maxBorderRadius = IS_STORY
    ? Math.round(
        (v.customSize * 7.67 + v.tempPadding * 2 + v.tempBorderWidth * 2) / 2
      )
    : Math.round(
        (v.customSize + v.tempPadding * 2 + v.tempBorderWidth * 2) / 2
      );

  const { hex: colorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "colorHex", device }),
    defaultValueValue({ v, key: "colorPalette", device })
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 70,
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs-dev",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Icon"),
              options: [
                {
                  id: "iconImage",
                  label: t("Icon"),
                  type: "iconSetter",
                  position: 40,
                  value: {
                    name: v.name,
                    type: v.type
                  },
                  onChange: ({ name, type }) => ({
                    name: name,
                    type: type
                  })
                },
                {
                  id: "sizeGroup",
                  type: "group-dev",
                  position: 60,
                  disabled: IS_STORY,
                  options: [
                    {
                      id: "size",
                      label: t("Size"),
                      type: "radioGroup",
                      choices: [
                        { value: "small", icon: "nc-16" },
                        { value: "medium", icon: "nc-24" },
                        { value: "large", icon: "nc-32" },
                        { value: "custom", icon: "nc-more" }
                      ],
                      value: v.size,
                      onChange: size => {
                        const borderRadius = Math.round(
                          (v.borderRadius /
                            Math.round(
                              v[`${v.size}Size`] +
                                v.padding * 2 +
                                v.borderWidth * 2
                            )) *
                            Math.round(
                              v[`${size}Size`] +
                                v.padding * 2 +
                                v.borderWidth * 2
                            )
                        );

                        return {
                          size,
                          customSize:
                            size !== "custom" ? v[`${size}Size`] : v.customSize,
                          borderRadius:
                            size !== "custom" ? borderRadius : v.borderRadius
                        };
                      }
                    },
                    {
                      id: "customSize",
                      type: "slider",
                      disabled: v.size !== "custom",
                      slider: {
                        min: 14,
                        max: 180
                      },
                      input: {
                        show: true
                      },
                      suffix: {
                        show: true,
                        choices: [{ title: "px", value: "px" }]
                      },
                      value: {
                        value: v.customSize
                      },
                      onChange: ({ value: customSize }) => {
                        const borderRadius = Math.round(
                          (v.borderRadius /
                            Math.round(
                              v.customSize + v.padding * 2 + v.borderWidth * 2
                            )) *
                            Math.round(
                              customSize + v.padding * 2 + v.borderWidth * 2
                            )
                        );

                        return {
                          customSize,
                          borderRadius
                        };
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "iconBackground",
              label: t("Background"),
              roles: ["admin"],
              options: [
                {
                  id: "fillType",
                  label: t("Fill"),
                  type: "radioGroup",
                  choices: [
                    { value: "filled", icon: "nc-circle" },
                    { value: "outline", icon: "nc-outline" },
                    { value: "default", icon: "nc-close" }
                  ],
                  value: v.fillType,
                  onChange: fillType => {
                    return {
                      fillType,

                      tempFillType:
                        fillType !== "default" ? fillType : v.tempFillType,

                      padding:
                        fillType === "default"
                          ? 0
                          : fillType !== "default"
                          ? v.tempPadding
                          : v.padding,

                      borderRadiusType:
                        fillType === "default"
                          ? ""
                          : fillType !== "default"
                          ? v.tempBorderRadiusType
                          : v.borderRadiusType,

                      borderRadius:
                        fillType === "default"
                          ? 0
                          : fillType !== "default" &&
                            v.tempBorderRadiusType === "square"
                          ? v.tempBorderRadius
                          : fillType !== "default" &&
                            v.tempBorderRadiusType === "rounded"
                          ? maxBorderRadius
                          : v.borderRadius,

                      borderWidth:
                        fillType === "default"
                          ? 0
                          : fillType !== "default"
                          ? v.tempBorderWidth
                          : v.borderWidth,

                      borderColorOpacity:
                        fillType === "default"
                          ? 0
                          : fillType !== "default"
                          ? v.tempBorderColorOpacity
                          : v.borderColorOpacity,

                      borderColorPalette:
                        fillType === "default"
                          ? ""
                          : fillType !== "default"
                          ? v.tempBorderColorPalette
                          : v.borderColorPalette,

                      bgColorOpacity:
                        fillType === "default" || fillType === "outline"
                          ? 0
                          : fillType === "filled"
                          ? v.tempBgColorOpacity
                          : v.bgColorOpacity,

                      bgColorPalette:
                        fillType === "default" || fillType === "outline"
                          ? ""
                          : fillType === "filled"
                          ? v.tempBgColorPalette
                          : v.bgColorPalette,

                      gradientColorOpacity:
                        fillType === "default" || fillType === "outline"
                          ? 0
                          : fillType === "filled"
                          ? v.tempGradientColorOpacity
                          : v.gradientColorOpacity,

                      gradientColorPalette:
                        fillType === "default" || fillType === "outline"
                          ? ""
                          : fillType === "filled"
                          ? v.tempGradientColorPalette
                          : v.gradientColorPalette,

                      // Hover
                      hoverBgColorOpacity:
                        fillType === "default" ? 0 : v.tempHoverBgColorOpacity,

                      hoverBgColorPalette:
                        fillType === "default" || fillType === "outline"
                          ? ""
                          : fillType === "filled"
                          ? v.tempHoverBgColorPalette
                          : v.hoverBgColorPalette,

                      hoverBorderColorOpacity:
                        fillType === "default"
                          ? 0
                          : v.tempHoverBorderColorOpacity,

                      hoverBorderColorPalette:
                        fillType === "default"
                          ? ""
                          : fillType !== "default"
                          ? v.tempHoverBorderColorPalette
                          : v.hoverBorderColorPalette
                    };
                  }
                },
                {
                  id: "borderRadiusTypeGroup",
                  type: "group-dev",
                  options: [
                    {
                      id: "borderRadiusType",
                      label: t("Corner"),
                      type: "radioGroup",
                      choices: [
                        { value: "square", icon: "nc-corners-square" },
                        { value: "rounded", icon: "nc-corners-round" },
                        { value: "custom", icon: "nc-more" }
                      ],
                      value: v.borderRadiusType,
                      onChange: borderRadiusType => {
                        return {
                          borderRadiusType,

                          tempBorderRadiusType:
                            borderRadiusType !== ""
                              ? borderRadiusType
                              : v.tempBorderRadiusType,

                          fillType:
                            borderRadiusType !== ""
                              ? v.tempFillType
                              : v.fillType,

                          borderRadius:
                            borderRadiusType === "square"
                              ? v.tempBorderRadius
                              : borderRadiusType === "rounded"
                              ? maxBorderRadius
                              : v.borderRadius,

                          borderWidth:
                            borderRadiusType !== ""
                              ? v.tempBorderWidth
                              : v.borderWidth,

                          borderColorOpacity:
                            borderRadiusType !== ""
                              ? v.tempBorderColorOpacity
                              : v.borderColorOpacity,

                          borderColorPalette:
                            borderRadiusType !== ""
                              ? v.tempBorderColorPalette
                              : v.borderColorPalette,

                          bgColorOpacity:
                            borderRadiusType !== "" &&
                            v.tempFillType === "filled"
                              ? v.tempBgColorOpacity
                              : v.bgColorOpacity,

                          bgColorPalette:
                            borderRadiusType !== "" &&
                            v.tempFillType === "filled"
                              ? v.tempBgColorPalette
                              : v.bgColorPalette,

                          padding:
                            borderRadiusType !== "" ? v.tempPadding : v.padding,

                          // Hover
                          hoverBgColorOpacity:
                            borderRadiusType !== ""
                              ? v.tempHoverBgColorOpacity
                              : v.hoverBgColorOpacity,

                          hoverBorderColorOpacity:
                            borderRadiusType !== ""
                              ? v.tempHoverBorderColorOpacity
                              : v.hoverBorderColorOpacity
                        };
                      }
                    },
                    {
                      id: "borderRadius",
                      type: "slider",
                      disabled: v.borderRadiusType !== "custom",
                      slider: {
                        min: 0,
                        max: maxBorderRadius
                      },
                      input: {
                        show: true
                      },
                      suffix: {
                        show: true,
                        choices: [{ title: "px", value: "px" }]
                      },
                      value: {
                        value: v.borderRadius
                      },
                      onChange: ({ value: borderRadius }) => ({
                        borderRadius,
                        tempBorderRadius: borderRadius
                      })
                    }
                  ]
                },
                {
                  id: "padding",
                  label: t("Size"),
                  type: "slider",
                  slider: {
                    min: 0,
                    max: IS_STORY ? 50 : 180
                  },
                  input: {
                    show: true
                  },
                  suffix: {
                    show: true,
                    choices: IS_STORY
                      ? [{ title: "%", value: "%" }]
                      : [{ title: "px", value: "px" }]
                  },
                  value: {
                    value: v.padding
                  },
                  onChange: ({ value: padding }) => {
                    return {
                      padding,
                      tempPadding: padding,
                      borderRadius:
                        v.borderRadiusType === "rounded"
                          ? Math.round(
                              (v.customSize + padding * 2 + v.borderWidth * 2) /
                                2
                            )
                          : v.borderRadius,

                      borderWidth:
                        padding > 0 ? v.tempBorderWidth : v.borderWidth,

                      borderRadiusType:
                        padding > 0
                          ? v.tempBorderRadiusType
                          : v.borderRadiusType,

                      fillType: padding > 0 ? v.tempFillType : v.fillType,

                      borderColorOpacity:
                        padding > 0
                          ? v.tempBorderColorOpacity
                          : v.borderColorOpacity,

                      borderColorPalette:
                        padding > 0
                          ? v.tempBorderColorPalette
                          : v.borderColorPalette,

                      bgColorOpacity:
                        padding > 0 && v.tempFillType === "filled"
                          ? v.tempBgColorOpacity
                          : v.bgColorOpacity,

                      bgColorPalette:
                        padding > 0 && v.tempFillType === "filled"
                          ? v.tempBgColorPalette
                          : v.bgColorPalette
                    };
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
            backgroundColor: hexToRgba(colorHex, v.colorOpacity)
          }
        }
      },
      roles: ["admin"],
      position: 80,
      options: [
        {
          id: "tabsColor",
          className: "",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabText",
              label: t("Icon"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "",
                  type: "backgroundColor-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  devices: "desktop",
                  type: "border-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  devices: "desktop",
                  type: "boxShadow-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarLink",
      type: "popover-dev",
      config: {
        icon: "nc-link",
        size: "medium",
        title: t("Link")
      },
      position: 90,
      options: [
        {
          id: "linkType",
          type: "tabs-dev",
          config: {
            saveTab: true
          },
          tabs: [
            {
              id: "external",
              label: t("URL"),
              options: [
                toolbarLinkExternal({
                  v,
                  config: component.context.dynamicContent.config
                }),
                {
                  id: "linkExternalBlank",
                  label: t("Open In New Tab"),
                  type: "switch-dev"
                },
                {
                  id: "linkExternalRel",
                  label: t("Make it Nofollow"),
                  type: "switch-dev"
                }
              ]
            },
            {
              id: "anchor",
              label: t("Block"),
              options: [
                toolbarLinkAnchor({ v, disabled: IS_GLOBAL_POPUP || IS_STORY })
              ]
            },
            {
              id: "popup",
              label: t("Popup"),
              options: [
                {
                  id: "linkPopup",
                  type: "promptAddPopup",
                  disabled: inPopup || inPopup2 || IS_GLOBAL_POPUP || IS_STORY,
                  label: t("Popup"),
                  popupKey: `${component.getId()}_${v.linkPopup}`,
                  value: {
                    value: v.linkPopup,
                    popups: v.popups
                  },
                  onChange: ({ value, popups }) => ({
                    linkPopup: value,
                    popups
                  })
                }
              ]
            },
            {
              id: "story",
              label: t("Slides"),
              options: [toolbarStoryAnchor({ disabled: !IS_STORY })]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      devices: "desktop",
      type: "advancedSettings",
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}

export function getItemsForTablet(v, component) {
  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "tabletSizeGroup",
          type: "group-dev",
          options: [
            {
              id: "tabletSize",
              label: t("Size"),
              type: "radioGroup",
              choices: [
                { value: "small", icon: "nc-16" },
                { value: "medium", icon: "nc-24" },
                { value: "large", icon: "nc-32" },
                { value: "custom", icon: "nc-more" }
              ],
              value: tabletSyncOnChange(v, "size"),
              onChange: tabletSize => {
                return {
                  tabletSize,

                  tabletCustomSize:
                    tabletSize !== "custom"
                      ? v[`${tabletSize}Size`]
                      : v.tabletCustomSize
                };
              }
            },
            {
              id: "tabletCustomSize",
              type: "slider",
              disabled: v.tabletSize !== "custom",
              slider: {
                min: 14,
                max: 180
              },
              input: {
                show: true
              },
              suffix: {
                show: true,
                choices: [{ title: "px", value: "px" }]
              },
              value: {
                value: tabletSyncOnChange(v, "customSize")
              },
              onChange: ({ value: tabletCustomSize }) => ({
                tabletCustomSize
              })
            }
          ]
        },
        {
          id: "tabletPadding",
          label: t("Bg Size"),
          type: "slider",
          slider: {
            min: 0,
            max: 180
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [{ title: "px", value: "px" }]
          },
          disabled: v.fillType === "default",
          value: {
            value: tabletSyncOnChange(v, "padding")
          },
          onChange: ({ value: tabletPadding }) => ({ tabletPadding })
        }
      ]
    },
    {
      id: "tabletToolbarLink",
      type: "popover-dev",
      config: {
        icon: "nc-link"
      },
      disabled: v.linkPopup === "",
      position: 80,
      options: [
        {
          id: "linkPopup",
          type: "promptAddPopup",
          label: t("Popup"),
          disabled: v.linkType !== "popup" || v.linkPopup === "",
          canDelete: false,
          popupKey: `${component.getId()}_${v.linkPopup}`,
          value: {
            value: v.linkPopup,
            popups: v.popups
          },
          onChange: ({ value, popups }) => ({
            linkPopup: value,
            popups
          })
        }
      ]
    },
    {
      id: "tabletToolbarSettings",
      type: "popover-dev",
      disabled: true
    }
  ];
}

export function getItemsForMobile(v, component) {
  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "mobileSizeGroup",
          type: "group-dev",
          options: [
            {
              id: "mobileSize",
              label: t("Size"),
              type: "radioGroup",
              choices: [
                { value: "small", icon: "nc-16" },
                { value: "medium", icon: "nc-24" },
                { value: "large", icon: "nc-32" },
                { value: "custom", icon: "nc-more" }
              ],
              value: mobileSyncOnChange(v, "size"),
              onChange: mobileSize => {
                return {
                  mobileSize,

                  mobileCustomSize:
                    mobileSize !== "custom"
                      ? v[`${mobileSize}Size`]
                      : v.mobileCustomSize
                };
              }
            },
            {
              id: "mobileCustomSize",
              type: "slider",
              disabled: v.mobileSize !== "custom",
              slider: {
                min: 14,
                max: 180
              },
              input: {
                show: true
              },
              suffix: {
                show: true,
                choices: [{ title: "px", value: "px" }]
              },
              value: {
                value: mobileSyncOnChange(v, "customSize")
              },
              onChange: ({ value: mobileCustomSize }) => ({
                mobileCustomSize
              })
            }
          ]
        },
        {
          id: "mobilePadding",
          label: t("Bg Size"),
          type: "slider",
          slider: {
            min: 0,
            max: 180
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [{ title: "px", value: "px" }]
          },
          disabled: v.fillType === "default",
          value: {
            value: mobileSyncOnChange(v, "padding")
          },
          onChange: ({ value: mobilePadding }) => ({ mobilePadding })
        }
      ]
    },
    {
      id: "mobileToolbarLink",
      type: "popover-dev",
      config: {
        icon: "nc-link"
      },
      disabled: v.linkPopup === "",
      position: 80,
      options: [
        {
          id: "linkPopup",
          type: "promptAddPopup",
          label: t("Popup"),
          disabled: v.linkType !== "popup" || v.linkPopup === "",
          canDelete: false,
          popupKey: `${component.getId()}_${v.linkPopup}`,
          value: {
            value: v.linkPopup,
            popups: v.popups
          },
          onChange: ({ value, popups }) => ({
            linkPopup: value,
            popups
          })
        }
      ]
    },
    {
      id: "mobileToolbarSettings",
      type: "popover-dev",
      disabled: true
    }
  ];
}
