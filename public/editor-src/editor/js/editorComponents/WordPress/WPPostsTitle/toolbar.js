import { t } from "visual/utils/i18n";
import Config from "visual/global/Config";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

import {
  toolbarColor2,
  toolbarColorHexField2,
  toolbarTypography2FontFamily,
  toolbarTypography2FontStyle,
  toolbarTypography2FontSize,
  toolbarTypography2LineHeight,
  toolbarTypography2FontWeight,
  toolbarTypography2LetterSpacing,
  toolbarLinkAnchor,
  toolbarLinkExternal,
  toolbarLinkExternalBlank,
  toolbarLinkExternalRel,
  toolbarLinkPopup,
  toolbarHorizontalAlign,
  toolbarDisabledHorizontalAlign,
  toolbarDisabledToolbarSettings,
  toolbarCustomCSS
} from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device, state, component }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);
  const { isGlobalPopup: IS_GLOBAL_POPUP } = Config.get("wp") || {};

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  return [
    {
      id: dvk("toolbarColor"),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(colorHex, v.colorOpacity)
        }
      },
      options: [
        {
          id: dvk("tabsColor"),
          type: "tabs",
          tabs: [
            {
              id: dvk("tabText"),
              label: t("Text"),
              options: [
                toolbarColor2({
                  v,
                  device,
                  state,
                  states: [NORMAL, HOVER],
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
            }
          ]
        }
      ]
    },
    {
      id: dvk("popoverTypography"),
      type: "popover",
      icon: "nc-font",
      size: device === "desktop" ? "large" : "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          type: "grid",
          className: "brz-ed-grid__typography",
          columns: [
            {
              width: 54,
              options: [
                toolbarTypography2FontFamily({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal",
                  onChange: ["onChangeTypography2"]
                })
              ]
            },
            {
              width: 46,
              className: "brz-ed-popover__typography",
              options: [
                toolbarTypography2FontStyle({ v, device, state: "normal" }),
                {
                  type: "grid",
                  className: "brz-ed-grid__typography",
                  columns: [
                    {
                      width: "50",
                      options: [
                        toolbarTypography2FontSize({
                          v,
                          device,
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        }),
                        toolbarTypography2LineHeight({
                          v,
                          device,
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        })
                      ]
                    },
                    {
                      width: "50",
                      options: [
                        toolbarTypography2FontWeight({
                          v,
                          device,
                          state: "normal",
                          onChange: ["onChangeTypography2"]
                        }),
                        toolbarTypography2LetterSpacing({
                          v,
                          device,
                          state: "normal",
                          onChange: ["onChangeTypography2"]
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
      id: dvk("toolbarLink"),
      type: "popover",
      icon: "nc-link",
      size: "medium",
      title: t("Link"),
      position: 90,
      options: [
        {
          id: dvk("linkType"),
          type: "tabs",
          value: dvv("linkType"),
          tabs: [
            {
              id: dvk("external"),
              label: t("URL"),
              options: [
                toolbarLinkExternal({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarLinkExternalBlank({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarLinkExternalRel({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                })
              ]
            },
            {
              id: dvk("anchor"),
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
              id: dvk("popup"),
              label: t("Popup"),
              options: [
                toolbarLinkPopup({
                  v,
                  component,
                  state: "normal",
                  device: "desktop",
                  canDelete: device === "desktop",
                  disabled:
                    device === "desktop"
                      ? inPopup || inPopup2 || IS_GLOBAL_POPUP
                      : dvv("linkType") !== "popup" || dvv("linkPopup") === ""
                })
              ]
            }
          ]
        }
      ]
    },
    toolbarHorizontalAlign({
      v,
      device,
      state: "normal",
      prefix: "content",
      devices: "all"
    }),
    toolbarDisabledHorizontalAlign({ v, device }),
    toolbarDisabledToolbarSettings({ device }),
    {
      id: dvk("advancedSettings"),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      icon: "nc-cog",
      options: [
        {
          id: dvk("settingsTabs"),
          type: "tabs",
          align: "start",
          tabs: [
            {
              id: dvk("settingsStyling"),
              label: t("Styling"),
              tabIcon: "nc-styling",
              options: []
            },
            {
              id: dvk("moreSettingsAdvanced"),
              label: t("Advanced"),
              tabIcon: "nc-cog",
              options: [
                toolbarCustomCSS({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                })
              ]
            }
          ]
        }
      ]
    }
  ];
}
