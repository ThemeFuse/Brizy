import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import {
  toolbarBgImage,
  toolbarGradientType,
  toolbarBgColorHexField2,
  toolbarBgColor2,
  toolbarGradientLinearDegree,
  toolbarGradientRadialDegree,
  toolbarHorizontalAlign,
  toolbarContainerPopup2ContainerWidth,
  toolbarContainerPopup2ContainerType,
  toolbarContainerPopup2ContainerHeight,
  toolbarVerticalAlignToggle,
  toolbarContainerPopup2ShowCloseButton,
  toolbarContainerPopup2ShowCloseButtonAfter
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
        toolbarContainerPopup2ShowCloseButton({
          v,
          device,
          state: "normal"
        }),
        toolbarContainerPopup2ShowCloseButtonAfter({
          v,
          device,
          state: "normal",
          disabled: dvv("showCloseButton") === "off"
        })
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
          id: defaultValueKey({ key: "background", device, state: "normal" }),
          label: t("tabsCurrentElement"),
          type: "tabs",
          value: defaultValueValue({
            v,
            key: "tabsCurrentElement",
            device,
            state: "normal"
          }),
          tabs: [
            {
              id: defaultValueKey({
                v,
                key: "tabCurrentElement",
                device,
                state: "normal"
              }),
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
    toolbarHorizontalAlign({
      v,
      device,
      position: 90,
      state: "normal"
    }),
    toolbarVerticalAlignToggle({
      v,
      device,
      disabled: dvv("columnsHeightStyle") === "fullHeight",
      state: "normal"
    }),
    {
      id: dvk("makeItSaved"),
      type: "buttonTooltip",
      icon: "nc-save-section",
      position: 100,
      title: t("Save"),
      devices: "desktop",
      tooltipContent: t("Saved"),
      onChange: () => {
        component.becomeSaved();
      }
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
        {
          type: "multiPicker",
          picker: toolbarContainerPopup2ContainerType({
            v,
            device,
            state: "normal"
          }),
          choices: {
            custom: [
              toolbarContainerPopup2ContainerHeight({
                v,
                device,
                state: "normal"
              })
            ]
          }
        },
        {
          id: dvk("advancedSettings"),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog",
          devices: "desktop",
          options: [
            {
              id: dvk("settingsTabs"),
              type: "tabs",
              align: "start",
              tabs: [
                {
                  id: dvk("moreSettingsAdvanced"),
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
