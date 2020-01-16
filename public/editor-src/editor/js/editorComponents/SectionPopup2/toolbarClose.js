import { t } from "visual/utils/i18n";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarDisabledMedia,
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

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
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
          id: dvk("tabsColor"),
          type: "tabs",
          tabs: [
            {
              id: dvk("tabIcon"),
              label: t("Icon"),
              options: [
                toolbarColor2({
                  v,
                  device,
                  state,
                  states: [NORMAL, HOVER],
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
                          state,
                          states: [NORMAL, HOVER],
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
                  state,
                  states: [NORMAL, HOVER],
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
                          state,
                          states: [NORMAL, HOVER],
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
