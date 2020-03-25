import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { t } from "visual/utils/i18n";
import { IS_GLOBAL_POPUP } from "visual/utils/models";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import {
  toolbarBgImage,
  toolbarGradientType,
  toolbarBgColorHexField2,
  toolbarBgColor2,
  toolbarGradientLinearDegree,
  toolbarGradientRadialDegree,
  toolbarElementSectionSaved,
  toolbarContainerPopup2ScrollPage,
  toolbarContainerPopup2ClickOutsideToClose,
  toolbarContainerPopup2ShowCloseButton,
  toolbarContainerPopup2ContainerWidth,
  toolbarContainerPopup2ContainerTypeAndHeight,
  toolbarVerticalAlign
} from "visual/utils/toolbar";

export function getItems({ v, device, component }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  return [
    {
      id: dvk("toolbarPopup"),
      type: "popover",
      icon: "nc-popup",
      title: "Popup",
      position: 70,
      devices: "desktop",
      options: [
        {
          id: dvk("tabsPopup"),
          type: "tabs",
          tabs: [
            {
              id: dvk("tabPopup"),
              label: t("Popup"),
              options: [
                {
                  id: dvk("makeItGlobal"),
                  label: t("Make it Global"),
                  type: "switch",
                  devices: "desktop",
                  value: component.props.meta.globalBlockId ? "on" : "off",
                  onChange: value => {
                    value === "on"
                      ? component.becomeGlobal()
                      : component.becomeNormal();
                  }
                },
                {
                  id: "popupConditions",
                  type: "popupConditions",
                  disabled: !IS_GLOBAL_POPUP
                },
                toolbarContainerPopup2ScrollPage({
                  v,
                  device,
                  state: "normal",
                  position: 50
                })
              ]
            },
            {
              id: dvk("tabClose"),
              label: t("Close"),
              options: [
                toolbarContainerPopup2ClickOutsideToClose({
                  v,
                  device,
                  state: "normal"
                }),
                toolbarContainerPopup2ShowCloseButton({
                  v,
                  device,
                  state: "normal"
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: dvk("toolbarMedia"),
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 80,
      options: [
        {
          id: dvk("tabsMedia"),
          type: "tabs",
          tabs: [
            {
              id: dvk("tabMedia"),
              label: t("Image"),
              options: [
                toolbarBgImage({
                  v,
                  device,
                  state: "normal",
                  onChange: ["onChangeBgImage", "onChangeBgImageBgOpacity"]
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: dvk("toolbarColor"),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(bgColorHex, dvv("bgColorOpacity"))
        }
      },
      options: [
        {
          id: dvk("tabsColor"),
          type: "tabs",
          hideHandlesWhenOne: false,
          tabs: [
            {
              id: dvk("tabOverlay"),
              label: t("Overlay"),
              options: [
                toolbarBgColor2({
                  v,
                  device,
                  state: "normal",
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
                          state: "normal",
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
                          state: "normal",
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
                          state: "normal",
                          disabled:
                            dvv("bgColorType") === "solid" ||
                            dvv("gradientType") === "radial"
                        }),
                        toolbarGradientRadialDegree({
                          v,
                          device,
                          state: "normal",
                          disabled:
                            dvv("bgColorType") === "solid" ||
                            dvv("gradientType") === "linear"
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
    toolbarElementSectionSaved({
      device,
      state: "normal",
      component,
      devices: "desktop"
    }),
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      position: 90,
      choices: [
        {
          icon: "nc-hrz-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-hrz-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-hrz-align-right",
          title: t("Align"),
          value: "right"
        }
      ]
    },
    {
      id: "verticalAlign",
      type: "toggle-dev",
      disabled: dvv("columnsHeightStyle") === "fullHeight",
      position: 110,
      choices: [
        {
          icon: "nc-ver-align-top",
          title: t("Align"),
          value: "top"
        },
        {
          icon: "nc-ver-align-middle",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-ver-align-bottom",
          title: t("Align"),
          value: "bottom"
        }
      ]
    },
    {
      id: dvk("toolbarSettings"),
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        toolbarContainerPopup2ContainerWidth({ v, device, state: "normal" }),
        toolbarContainerPopup2ContainerTypeAndHeight({
          v,
          device,
          state: "normal"
        }),
        toolbarVerticalAlign({
          v,
          device,
          state: "normal",
          prefix: "popupRow",
          disabled: dvv("columnsHeightStyle") === "auto"
        }),
        {
          id: dvk("advancedSettings"),
          type: "advancedSettings",
          devices: "desktop",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    },
    {
      id: "remove",
      type: "button",
      disabled: !IS_GLOBAL_POPUP,
      title: t("Delete"),
      icon: "nc-trash",
      position: 250,
      onChange: () => {
        component.handleDropClick();
      }
    }
  ];
}
