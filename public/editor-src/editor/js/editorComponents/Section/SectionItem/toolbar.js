import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import {
  toolbarBgImage,
  toolbarBgVideoUrl,
  toolbarGradientType,
  toolbarBgColorHexField2,
  toolbarBgColor2,
  toolbarGradientLinearDegree,
  toolbarGradientRadialDegree,
  toolbarBorder2,
  toolbarBorderColorHexField2,
  toolbarBorderWidthFourFields2,
  toolbarElementContainerTypeImageMap
} from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device, component, state }) {
  const dvv = key => defaultValueValue({ v, key, device });
  const dvvHover = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvvHover("bgColorHex"),
    dvvHover("bgColorPalette")
  );

  const { isSlider: inSlider } = component.props.meta.section;

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-background",
        title: t("Background")
      },
      position: 80,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: dvk("tabCurrentElement"),
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
                  state: "normal"
                }),
                toolbarBgImage({
                  v,
                  device,
                  state,
                  states:
                    // https://github.com/bagrinsergiu/blox-editor/issues/9032
                    dvv("media") === "image" ? [NORMAL, HOVER] : undefined,
                  disabled: dvv("media") !== "image",
                  onChange: [
                    "onChangeBgImage",
                    "onChangeBgImageBgOpacity",
                    "onChangeBgImageDependencies"
                  ]
                }),
                {
                  id: "bgAttachment",
                  label: t("Parallax"),
                  type: "select-dev",
                  devices: "desktop",
                  disabled: dvv("media") !== "image" || inSlider,
                  choices: [
                    { title: t("None"), value: "none" },
                    { title: t("Fixed"), value: "fixed" },
                    { title: t("Animated"), value: "animated" }
                  ]
                },
                toolbarBgVideoUrl({
                  v,
                  device,
                  devices: "desktop",
                  disabled: dvv("media") !== "video",
                  state: "normal"
                }),
                {
                  id: "bgVideoLoop",
                  label: t("Loop"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: dvv("media") !== "video"
                },
                {
                  id: "bgVideoStart",
                  type: "number-dev",
                  label: t("Start"),
                  devices: "desktop",
                  disabled: dvv("media") !== "video",
                  config: {
                    size: "short",
                    spinner: false,
                    max: 99999
                  },
                  helper: {
                    content: t("Specify a start time (in seconds)")
                  }
                },
                {
                  id: "bgMapAddress",
                  label: t("Address"),
                  type: "inputText-dev",
                  placeholder: t("Enter address"),
                  devices: "desktop",
                  disabled: dvv("media") !== "map"
                },
                {
                  id: "bgMapZoom",
                  label: t("Zoom"),
                  type: "slider-dev",
                  disabled: dvv("media") !== "map",
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
              id: dvk("tabOverlay"),
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
                    "onChangeBgColorHexAndOpacityDependencies2"
                  ],
                  onChangePalette: [
                    "onChangeBgColorPalette2",
                    "onChangeBgColorPaletteOpacity2",
                    "onChangeBgColorHexAndOpacityDependencies2"
                  ],
                  onChangeGradientHex: [
                    "onChangeBgColorHexAndOpacity2",
                    "onChangeBgColorHexAndOpacityPalette2",
                    "onChangeBgColorHexAndOpacityDependencies2"
                  ],
                  onChangeGradientPalette: [
                    "onChangeBgColorPalette2",
                    "onChangeBgColorPaletteOpacity2",
                    "onChangeBgColorHexAndOpacityDependencies2"
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
                            dvv("gradientActivePointer") === "startPointer"
                              ? "bg"
                              : "gradient",
                          onChange: [
                            "onChangeBgColorHexAndOpacity2",
                            "onChangeBgColorHexAndOpacityPalette2",
                            "onChangeBgColorHexAndOpacityDependencies2"
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
                          disabled: dvv("bgColorType") === "solid"
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
                            dvv("bgColorType") === "solid" ||
                            dvv("gradientType") === "radial"
                        }),
                        toolbarGradientRadialDegree({
                          v,
                          device,
                          state,
                          states: [NORMAL, HOVER],
                          disabled:
                            dvv("bgColorType") === "solid" ||
                            dvv("gradientType") === "linear"
                        })
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: dvk("tabBorder"),
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
                    "onChangeContainerBorderColorHexAndOpacityDependencies2"
                  ],
                  onChangePalette: [
                    "onChangeBorderColorPalette2",
                    "onChangeBorderColorPaletteOpacity2",
                    "onChangeContainerBorderColorHexAndOpacityDependencies2"
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
                            "onChangeContainerBorderColorHexAndOpacityDependencies2"
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
      position: 110,
      options: [
        {
          type: "multiPicker",
          position: 10,
          devices: "desktop",
          picker: {
            id: "containerType",
            label: t("Width"),
            type: "select-dev",
            choices: [
              { title: t("Boxed"), value: "boxed" },
              { title: t("Full"), value: "fullWidth" }
            ]
          },
          choices: {
            boxed: [
              {
                id: "containerSize",
                type: "slider-dev",
                config: {
                  min: 35,
                  max: 100,
                  units: [{ title: "%", value: "%" }]
                }
              }
            ]
          }
        },
        {
          id: "containerSize",
          type: "slider-dev",
          label: t("Width"),
          position: 10,
          devices: "responsive",
          config: {
            min: 35,
            max: 100,
            units: [{ title: "%", value: "%" }]
          }
        },
        {
          id: dvk("advancedSettings"),
          type: "advancedSettings",
          devices: "desktop",
          sidebarLabel: t("More Settings"),
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
