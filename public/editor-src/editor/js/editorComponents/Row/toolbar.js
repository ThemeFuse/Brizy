import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import {
  getOptionColorHexByPalette,
  getDynamicContentChoices
} from "visual/utils/options";
import { IS_GLOBAL_POPUP } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  toolbarBgVideoUrl,
  toolbarBorder2,
  toolbarBorderColorHexField2,
  toolbarBorderWidthFourFields2,
  toolbarGradientType,
  toolbarBgColor2,
  toolbarBgColorHexField2,
  toolbarGradientLinearDegree,
  toolbarShowOnResponsive,
  toolbarElementContainerTypeImageMap,
  toolbarImageLinkExternal,
  toolbarLinkAnchor,
  toolbarLinkPopup
} from "visual/utils/toolbar";
import { NORMAL, HOVER } from "visual/utils/stateMode";
import { DCTypes } from "visual/global/Config/types/DynamicContent";

export function getItems({ v, device, component, state, context }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });
  const dvvh = key => defaultValueValue({ v, key, device, state });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);
  const imageDynamicContentChoices = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.image
  );

  return [
    toolbarShowOnResponsive({ v, device, devices: "responsive" }),
    {
      id: "toolbarMedia",
      type: "popover-dev",
      config: {
        icon: "nc-background",
        title: t("Background")
      },
      position: 80,
      options: [
        {
          id: "tabsMedia",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabMedia",
              label: t("Background"),
              options: [
                {
                  id: "media",
                  label: t("Type"),
                  type: "radioGroup-dev",
                  devices: "desktop",
                  choices: [
                    { value: "image", icon: "nc-media-image" },
                    { value: "video", icon: "nc-media-video" },
                    { value: "map", icon: "nc-media-map" }
                  ]
                },
                toolbarElementContainerTypeImageMap({
                  v,
                  device,
                  devices: "responsive",
                  state
                }),
                {
                  label: t("Image"),
                  id: "bg",
                  type: "imageUpload-dev",
                  states: [NORMAL, HOVER],
                  devices: "desktop",
                  disabled: dvvh("media") !== "image",
                  population: imageDynamicContentChoices
                },
                {
                  label: t("Image"),
                  id: "bg",
                  type: "imageUpload-dev",
                  states: [NORMAL, HOVER],
                  devices: "responsive",
                  disabled:
                    dvvh("media") !== "image" && dvvh("media") !== "video",
                  population: imageDynamicContentChoices
                },
                toolbarBgVideoUrl({
                  v,
                  device,
                  devices: "desktop",
                  state,
                  disabled: dvvh("media") !== "video"
                }),
                {
                  id: "bgVideoLoop",
                  label: t("Loop"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: dvvh("media") !== "video"
                },
                {
                  id: "bgMapAddress",
                  label: t("Address"),
                  type: "inputText-dev",
                  devices: "desktop",
                  disabled: dvv("media") !== "map",
                  placeholder: t("Enter address"),
                  config: {
                    size: "large"
                  }
                },
                {
                  id: "bgMapZoom",
                  label: t("Zoom"),
                  type: "slider-dev",
                  disabled: dvv("media") !== "map" || device !== "desktop",
                  config: {
                    min: 1,
                    max: 21
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
            backgroundColor: hexToRgba(bgColorHex, dvv("bgColorOpacity"))
          }
        }
      },
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabOverlay",
              label: t("Overlay"),
              options: [
                toolbarBgColor2({
                  v,
                  device,
                  state,
                  states: [NORMAL, HOVER],
                  onChangeType: ["onChangeBgColorType2"],
                  onChangeHex: [
                    "onChangeBgColorHexAndOpacity2",
                    "onChangeBgColorHexAndOpacityPalette2",
                    "onChangeBgColorHexAndOpacityDependencies2",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile2"
                  ],
                  onChangePalette: [
                    "onChangeBgColorPalette2",
                    "onChangeBgColorPaletteOpacity2",
                    "onChangeBgColorHexAndOpacityDependencies2",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile2"
                  ],
                  onChangeGradientHex: [
                    "onChangeBgColorHexAndOpacity2",
                    "onChangeBgColorHexAndOpacityPalette2",
                    "onChangeBgColorHexAndOpacityDependencies2",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile2"
                  ],
                  onChangeGradientPalette: [
                    "onChangeBgColorPalette2",
                    "onChangeBgColorPaletteOpacity2",
                    "onChangeBgColorHexAndOpacityDependencies2",
                    "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile2"
                  ],
                  onChangeGradient: ["onChangeGradientRange2"]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 30,
                      options: [
                        toolbarBgColorHexField2({
                          v,
                          device,
                          state,
                          states: [NORMAL, HOVER],
                          prefix:
                            dvvh("gradientActivePointer") === "startPointer"
                              ? "bg"
                              : "gradient",
                          onChange: [
                            "onChangeBgColorHexAndOpacity2",
                            "onChangeBgColorHexAndOpacityPalette2",
                            "onChangeBgColorHexAndOpacityDependencies2",
                            "onChangeBgColorHexAndOpacityColumnAndRowSyncMobile2"
                          ]
                        })
                      ]
                    },
                    {
                      width: 52,
                      options: [
                        toolbarGradientType({
                          v,
                          device,
                          state,
                          states: [NORMAL, HOVER],
                          className:
                            "brz-ed__select--transparent brz-ed__select--align-right",
                          disabled: dvvh("bgColorType") === "solid"
                        })
                      ]
                    },
                    {
                      width: 18,
                      options: [
                        toolbarGradientLinearDegree({
                          v,
                          device,
                          state,
                          states: [NORMAL, HOVER],
                          disabled:
                            dvvh("bgColorType") === "solid" ||
                            dvvh("gradientType") === "radial"
                        }),
                        {
                          v,
                          device,
                          state,
                          states: [NORMAL, HOVER],
                          disabled:
                            dvvh("bgColorType") === "solid" ||
                            dvvh("gradientType") === "linear"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
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
                    "onChangeContainerBorderStyleDependencies2"
                  ],
                  onChangeHex: [
                    "onChangeBorderColorHexAndOpacity2",
                    "onChangeBorderColorHexAndOpacityPalette2",
                    "onChangeContainerBorderColorHexAndOpacityDependencies2",
                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet2",
                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile2"
                  ],
                  onChangePalette: [
                    "onChangeBorderColorPalette2",
                    "onChangeBorderColorPaletteOpacity2",
                    "onChangeContainerBorderColorHexAndOpacityDependencies2",
                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet2",
                    "onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile2"
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
                            "onChangeContainerBorderColorHexAndOpacityDependencies2",
                            "onChangeBorderColorHexAndOpacityColumnAndRowSyncTablet2",
                            "onChangeBorderColorHexAndOpacityColumnAndRowSyncMobile2"
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
                {
                  id: "boxShadow",
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
        title: t("Link"),
        size: "medium"
      },
      position: 100,
      disabled:
        inPopup || inPopup2 || IS_GLOBAL_POPUP
          ? true
          : device === "desktop"
          ? v.linkLightBox === "on"
          : dvv("linkType") !== "popup" || dvv("linkPopup") === "",
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
                toolbarImageLinkExternal({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                {
                  id: "linkExternalBlank",
                  type: "switch-dev",
                  label: t("Open In New Tab"),
                  devices: "desktop"
                },
                {
                  id: "linkExternalRel",
                  type: "switch-dev",
                  label: t("Make it Nofollow"),
                  devices: "desktop"
                }
              ]
            },
            {
              id: "anchor",
              label: t("Block"),
              options: [
                toolbarLinkAnchor({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                })
              ]
            },
            {
              id: "popup",
              label: t("Popup"),
              options: [
                toolbarLinkPopup({
                  v,
                  component,
                  state: "normal",
                  device: "desktop",
                  devices: "desktop",
                  canDelete: true,
                  disabled: inPopup || inPopup2 || IS_GLOBAL_POPUP
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarLinkResponsive",
      type: "popover-dev",
      config: {
        icon: "nc-link",
        title: t("Link"),
        size: "medium"
      },
      position: 100,
      devices: "responsive",
      disabled: dvv("linkType") !== "popup" || dvv("linkPopup") === "",
      options: [
        {
          id: "linkType",
          type: "tabs-dev",
          config: {
            saveTab: true
          },
          tabs: [
            {
              id: "popup",
              label: t("Popup"),
              options: [
                toolbarLinkPopup({
                  v,
                  component,
                  state: "normal",
                  device: "desktop",
                  devices: "responsive",
                  canDelete: false,
                  disabled:
                    dvv("linkType") !== "popup" || dvv("linkPopup") === ""
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 100,
      options: [
        {
          id: "size",
          label: t("Width"),
          type: "slider-dev",
          position: 80,
          disabled: inPopup || inPopup2 || IS_GLOBAL_POPUP,
          config: {
            min: 40,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "multiPicker",
          type: "group-dev",
          devices: "desktop",
          position: 90,
          disabled: inPopup2 || IS_GLOBAL_POPUP,
          options: [
            {
              id: "columnsHeightStyle",
              label: t("Height"),
              type: "select-dev",
              devices: "desktop",
              position: 90,
              choices: [
                { title: t("Auto"), value: "auto" },
                { title: t("Custom"), value: "custom" }
              ]
            },
            {
              id: "columnsHeight",
              type: "slider-dev",
              devices: "desktop",
              disabled: !(v.columnsHeightStyle === "custom"),
              position: 1100,
              config: {
                min: 20,
                max: 500,
                units: [{ value: "px", title: "px" }]
              }
            },
            {
              id: "verticalAlign",
              label: t("Content"),
              type: "radioGroup-dev",
              devices: "desktop",
              disabled: !(v.columnsHeightStyle === "custom"),
              position: 1100,
              choices: [
                { value: "top", icon: "nc-align-top" },
                { value: "center", icon: "nc-align-middle" },
                { value: "bottom", icon: "nc-align-bottom" }
              ]
            }
          ]
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          devices: "desktop",
          sidebarLabel: t("More Settings"),
          label: t("More Settings"),
          icon: "nc-cog",
          position: 110
        }
      ]
    }
  ];
}
