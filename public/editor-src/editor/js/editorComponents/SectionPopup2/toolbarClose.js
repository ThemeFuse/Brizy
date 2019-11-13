import { t } from "visual/utils/i18n";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarDisabledMedia,
  toolbarContainerPopup2CloseFill,
  toolbarContainerPopup2CloseBorderRadius,
  toolbarContainerPopup2CloseCustomSize,
  toolbarContainerPopup2CloseBgSize,
  toolbarContainerPopup2ClosePosition,
  toolbarColor2,
  toolbarColorHexField2,
  toolbarBgColor2,
  toolbarBgColorHexField2,
  toolbarContainerPopup2CloseAlign,
  toolbarDisabledAdvancedSettings,
  toolbarContainerPopup2CloseHorizontalPosition,
  toolbarContainerPopup2CloseVerticalPosition
} from "visual/utils/toolbar";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: closeColorHex } = getOptionColorHexByPalette(
    dvv("closeColorHex"),
    dvv("closeColorPalette")
  );
  return [
    toolbarDisabledMedia({ device, state: "normal" }),
    {
      id: "toolbarCurrentElement",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      position: 70,
      options: [
        {
          id: "toolbarCurrentElementTabs",
          type: "tabs",
          tabs: [
            {
              id: "toolbarCurrentElementTabClose",
              label: t("Icon"),
              options: [
                toolbarContainerPopup2CloseHorizontalPosition({
                  v,
                  device,
                  state: "normal"
                }),
                toolbarContainerPopup2CloseVerticalPosition({
                  v,
                  device,
                  state: "normal"
                }),
                toolbarContainerPopup2CloseCustomSize({
                  v,
                  device,
                  state: "normal"
                })
              ]
            },
            {
              id: "toolbarCurrentElementTabBackground",
              label: t("Background"),
              options: [
                toolbarContainerPopup2CloseBgSize({
                  v,
                  device,
                  state: "normal"
                }),
                toolbarContainerPopup2CloseBorderRadius({
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
      id: dvk("toolbarColor"),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(closeColorHex, dvv("closeColorOpacity"))
        }
      },
      options: [
        {
          id: dvk("tabsState"),
          tabsPosition: "left",
          type: "tabs",
          value: dvv("tabsState"),
          tabs: [
            {
              id: "tabNormal",
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: dvk("tabsColor"),
                  type: "tabs",
                  value: dvv("tabsColor"),
                  tabs: [
                    {
                      id: dvk("tabIcon"),
                      label: t("Icon"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          state: "normal",
                          prefix: "closeColor",
                          onChangeHex: [
                            "onChangeColorHexAndOpacity",
                            "onChangeColorHexAndOpacityPalette"
                          ],
                          onChangePalette: [
                            "onChangeColorPalette",
                            "onChangeColorPaletteOpacity"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
                                toolbarColorHexField2({
                                  v,
                                  device,
                                  state: "normal",
                                  prefix: "closeColor",
                                  onChange: [
                                    "onChangeColorHexAndOpacity",
                                    "onChangeColorHexAndOpacityPalette"
                                  ]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: dvk("tabBackground"),
                      label: t("Background"),
                      options: [
                        toolbarBgColor2({
                          v,
                          device,
                          state: "normal",
                          prefix: "closeBg",
                          showSelect: false,
                          onChangeHex: [
                            "onChangeBgColorHexAndOpacity2",
                            "onChangeBgColorHexAndOpacityPalette2"
                          ],
                          onChangePalette: [
                            "onChangeBgColorPalette2",
                            "onChangeBgColorPaletteOpacity2"
                          ]
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
                                  prefix: "closeBg",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity2",
                                    "onChangeBgColorHexAndOpacityPalette2"
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
              id: dvk("tabHover"),
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: dvk("tabsColor"),
                  type: "tabs",
                  value: dvv("tabsColor"),
                  tabs: [
                    {
                      id: dvk("tabIcon"),
                      label: t("Icon"),
                      options: [
                        toolbarColor2({
                          v,
                          device,
                          state: "hover",
                          devices: "desktop",
                          prefix: "closeColor",
                          onChangeHex: [
                            "onChangeColorHexAndOpacity",
                            "onChangeColorHexAndOpacityPalette"
                          ],
                          onChangePalette: [
                            "onChangeColorPalette",
                            "onChangeColorPaletteOpacity"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 100,
                              options: [
                                toolbarColorHexField2({
                                  v,
                                  device,
                                  state: "hover",
                                  devices: "desktop",
                                  prefix: "closeColor",
                                  onChange: [
                                    "onChangeColorHexAndOpacity",
                                    "onChangeColorHexAndOpacityPalette"
                                  ]
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: dvk("tabBackground"),
                      label: t("Background"),
                      options: [
                        toolbarBgColor2({
                          v,
                          device,
                          state: "hover",
                          devices: "desktop",
                          prefix: "closeBg",
                          showSelect: false,
                          onChangeHex: [
                            "onChangeBgColorHexAndOpacity2",
                            "onChangeBgColorHexAndOpacityPalette2"
                          ],
                          onChangePalette: [
                            "onChangeBgColorPalette2",
                            "onChangeBgColorPaletteOpacity2"
                          ]
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
                                  state: "hover",
                                  devices: "desktop",
                                  prefix: "closeBg",
                                  onChange: [
                                    "onChangeBgColorHexAndOpacity2",
                                    "onChangeBgColorHexAndOpacityPalette2"
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
        [dvk("tabsState")]: !isOpen ? "" : dvv("tabsState"),
        [dvk("tabsColor")]: !isOpen ? "" : dvv("tabsColor")
      })
    },
    toolbarContainerPopup2ClosePosition({
      v,
      device,
      state: "normal"
    }),
    toolbarContainerPopup2CloseAlign({ v, device, state: "normal" }),
    {
      id: dvk("toolbarSettings"),
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [toolbarDisabledAdvancedSettings({ v, device, state: "normal" })]
    }
  ];
}
