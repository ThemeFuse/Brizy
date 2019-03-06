import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColor } from "visual/utils/options";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

import {
  toolbarBoxShadowHexAndOpacity,
  toolbarBoxShadowPalette,
  toolbarBoxShadowFields,
  toolbarBoxShadowBlur,
  toolbarBoxShadowSpread,
  toolbarBoxShadowVertical,
  toolbarBoxShadowHorizontal,
  toolbarCustomCSS
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";

  const { hex: boxShadowColorHex } = getOptionColor(v, "boxShadowColor");

  return [
    {
      id: "toolbarMap",
      type: "popover",
      icon: "nc-pin",
      title: t("Map"),
      position: 90,
      options: [
        {
          id: "address",
          label: t("Address"),
          type: "input",
          placeholder: t("Enter address"),
          value: {
            value: v.address
          },
          onChange: ({ value: address }) => ({
            address
          })
        },
        {
          id: "zoom",
          label: t("Zoom"),
          type: "slider",
          slider: {
            min: 1,
            max: 21
          },
          input: {
            show: true
          },
          value: {
            value: v.zoom
          },
          onChange: ({ value: zoom }) => ({ zoom })
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
          id: "size",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: v.size
          },
          onChange: ({ value: size }) => ({ size })
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider",
          slider: {
            min: 5,
            max: 500
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "px",
                value: "px"
              }
            ]
          },
          value: {
            value: v.height
          },
          onChange: ({ value: height }) => ({ height })
        },
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
  return [
    {
      id: "tabletToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "tabletSize",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: tabletSyncOnChange(v, "size")
          },
          onChange: ({ value: tabletSize }) => ({ tabletSize })
        },
        {
          id: "tabletHeight",
          label: t("Height"),
          type: "slider",
          slider: {
            min: 5,
            max: 500
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "px",
                value: "px"
              }
            ]
          },
          value: {
            value: tabletSyncOnChange(v, "height")
          },
          onChange: ({ value: tabletHeight }) => ({ tabletHeight })
        }
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  return [
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "mobileSize",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: mobileSyncOnChange(v, "size")
          },
          onChange: ({ value: mobileSize }) => ({ mobileSize })
        },
        {
          id: "mobileHeight",
          label: t("Height"),
          type: "slider",
          slider: {
            min: 5,
            max: 500
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "px",
                value: "px"
              }
            ]
          },
          value: {
            value: mobileSyncOnChange(v, "height")
          },
          onChange: ({ value: mobileHeight }) => ({ mobileHeight })
        }
      ]
    }
  ];
}
