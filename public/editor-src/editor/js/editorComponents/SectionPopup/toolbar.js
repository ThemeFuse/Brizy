import { hexToRgba } from "visual/utils/color";
import { getOptionColor, getDynamicContentChoices } from "visual/utils/options";
import { t } from "visual/utils/i18n";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import {
  toolbarBgColorHexAndOpacity,
  toolbarBgColorPalette,
  toolbarBgColorFields
} from "visual/utils/toolbar";

const imageDynamicContentChoices = getDynamicContentChoices("image");

export function getItemsForDesktop(v, component) {
  const device = "desktop";
  const { hex: bgColorHex } = getOptionColor(v, "bgColor");
  const { hex: colorHex } = getOptionColor(v, "color");

  return [
    {
      id: "toolbarPopup",
      type: "popover",
      icon: "nc-popup",
      title: "Popup",
      position: 70,
      options: [
        {
          id: "makeItGlobal",
          label: t("Make it Global"),
          type: "switch",
          value: component.props.meta.globalBlockId ? "on" : "off",
          onChange: value => {
            value === "on"
              ? component.becomeGlobal()
              : component.becomeNormal();
          }
        }
      ]
    },
    {
      id: "toolbarMedia",
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 80,
      options: [
        {
          id: "bgImage",
          label: t("Image"),
          type: "imageSetter",
          population: {
            show: imageDynamicContentChoices.length > 0,
            choices: imageDynamicContentChoices
          },
          value: {
            width: v.bgImageWidth,
            height: v.bgImageHeight,
            src: v.bgImageSrc,
            x: v.bgPositionX,
            y: v.bgPositionY,
            population: v.bgPopulation
          },
          onChange: ({ width, height, src, x, y, population }) => {
            if (population) {
              return {
                bgPopulation: population
              };
            }

            return {
              bgImageWidth: width,
              bgImageHeight: height,
              bgImageSrc: src,
              bgPositionX: x,
              bgPositionY: y,
              bgPopulation: "",

              bgColorOpacity:
                src !== "" && v.bgColorOpacity === 1 ? 0.9 : v.bgColorOpacity,

              tempBgColorOpacity:
                src !== "" && v.bgColorOpacity === 1
                  ? 0.9
                  : v.tempBgColorOpacity
            };
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(bgColorHex, v.bgColorOpacity)
        }
      },
      options: [
        {
          id: "colorTabs",
          type: "tabs",
          hideHandlesWhenOne: true,
          tabs: [
            {
              label: t("Overlay"),
              options: [
                toolbarBgColorHexAndOpacity({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette",
                    "onChangeBgColorHexAndOpacityDependencies"
                  ]
                }),
                toolbarBgColorPalette({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBgColorPalette",
                    "onChangeBgColorPaletteOpacity",
                    "onChangeBgColorHexAndOpacityDependencies"
                  ]
                }),
                toolbarBgColorFields({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBgColorHexAndOpacity",
                    "onChangeBgColorHexAndOpacityPalette",
                    "onChangeBgColorHexAndOpacityDependencies"
                  ]
                })
              ]
            },
            {
              label: t("Close"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  position: 10,
                  value: {
                    hex: colorHex,
                    opacity: v.colorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
                    opacity =
                      hex !== v.colorHex && v.colorOpacity === 0
                        ? v.tempColorOpacity
                        : opacity;

                    return {
                      colorHex: hex,

                      colorOpacity: opacity,

                      colorPalette: isChanged === "hex" ? "" : v.colorPalette,

                      // Temporary Value changes
                      tempColorOpacity:
                        opacity > 0 && opacityDragEnd
                          ? opacity
                          : v.tempColorOpacity,

                      // Normal + Hover Sync
                      hoverColorHex:
                        v.colorHex === v.hoverColorHex ? hex : v.hoverColorHex,

                      hoverColorOpacity:
                        v.colorOpacity === v.hoverColorOpacity
                          ? opacity
                          : v.hoverColorOpacity
                    };
                  }
                },
                {
                  id: "colorPalette",
                  type: "colorPalette",
                  position: 20,
                  value: v.colorPalette,
                  onChange: colorPalette => ({
                    colorPalette,

                    colorOpacity:
                      v.colorOpacity === 0 ? v.tempColorOpacity : v.colorOpacity
                  })
                },
                {
                  id: "colorFields",
                  type: "colorFields",
                  position: 30,
                  value: {
                    hex: colorHex,

                    opacity: v.colorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged }) => ({
                    colorPalette: isChanged === "hex" ? "" : v.colorPalette,

                    colorHex: hex,

                    colorOpacity: opacity
                  })
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "makeItSaved",
      type: "buttonTooltip",
      icon: "nc-save-section",
      position: 100,
      title: t("Save"),
      tooltipContent: t("Saved"),
      onChange: () => {
        component.becomeSaved();
      }
    }
  ];
}

export function getItemsForTablet(v) {
  const device = "tablet";
  const state = "normal";
  const { hex: tabletBgColorHex } =
    v.tabletBgColorHex !== null
      ? getOptionColor(v, "tabletBgColor")
      : getOptionColor(v, "bgColor");

  return [
    {
      id: "tabletToolbarMedia",
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 90,
      options: [
        {
          id: "tabletImage",
          label: t("Image"),
          type: "imageSetter",
          population: {
            show: imageDynamicContentChoices.length > 0,
            choices: imageDynamicContentChoices
          },
          value: {
            width: tabletSyncOnChange(v, "bgImageWidth"),
            height: tabletSyncOnChange(v, "bgImageHeight"),
            src: tabletSyncOnChange(v, "bgImageSrc"),
            x: tabletSyncOnChange(v, "bgPositionX"),
            y: tabletSyncOnChange(v, "bgPositionY"),
            population: v.bgPopulation
          },
          onChange: ({ width, height, src, x, y, population }) => {
            if (population) {
              return {
                bgPopulation: population
              };
            }

            return {
              tabletBgImageWidth: width,
              tabletBgImageHeight: height,
              tabletBgImageSrc: src,
              tabletBgPositionX: x,
              tabletBgPositionY: y,
              bgPopulation: "",

              tabletBgColorOpacity:
                src !== "" && tabletSyncOnChange(v, "bgColorOpacity") === 1
                  ? 0.9
                  : tabletSyncOnChange(v, "bgColorOpacity"),

              tempTabletBgColorOpacity:
                src !== "" && tabletSyncOnChange(v, "bgColorOpacity") === 1
                  ? 0.9
                  : v.tempTabletBgColorOpacity
            };
          }
        }
      ]
    },
    {
      id: "tabletToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 100,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            tabletBgColorHex,
            tabletSyncOnChange(v, "bgColorOpacity")
          )
        }
      },
      options: [
        toolbarBgColorHexAndOpacity({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        }),
        toolbarBgColorPalette({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorPalette",
            "onChangeBgColorPaletteOpacity",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        }),
        toolbarBgColorFields({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        })
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  const device = "mobile";
  const state = "normal";
  const { hex: mobileBgColorHex } =
    v.mobileBgColorHex !== null
      ? getOptionColor(v, "mobileBgColor")
      : getOptionColor(v, "bgColor");

  return [
    {
      id: "mobileToolbarMedia",
      type: "popover",
      icon: "nc-background",
      title: t("Background"),
      position: 90,
      options: [
        {
          id: "mobileImage",
          label: t("Image"),
          type: "imageSetter",
          population: {
            show: imageDynamicContentChoices.length > 0,
            choices: imageDynamicContentChoices
          },
          value: {
            width: mobileSyncOnChange(v, "bgImageWidth"),
            height: mobileSyncOnChange(v, "bgImageHeight"),
            src: mobileSyncOnChange(v, "bgImageSrc"),
            x: mobileSyncOnChange(v, "bgPositionX"),
            y: mobileSyncOnChange(v, "bgPositionY"),
            population: v.bgPopulation
          },
          onChange: ({ width, height, src, x, y, population }) => {
            if (population) {
              return {
                bgPopulation: population
              };
            }

            return {
              mobileBgImageWidth: width,
              mobileBgImageHeight: height,
              mobileBgImageSrc: src,
              mobileBgPositionX: x,
              mobileBgPositionY: y,
              bgPopulation: "",

              mobileBgColorOpacity:
                src !== "" && mobileSyncOnChange(v, "bgColorOpacity") === 1
                  ? 0.9
                  : mobileSyncOnChange(v, "bgColorOpacity"),

              tempMobileBgColorOpacity:
                src !== "" && mobileSyncOnChange(v, "bgColorOpacity") === 1
                  ? 0.9
                  : v.tempMobileBgColorOpacity
            };
          }
        }
      ]
    },
    {
      id: "mobileToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 100,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            mobileBgColorHex,
            mobileSyncOnChange(v, "bgColorOpacity")
          )
        }
      },
      options: [
        toolbarBgColorHexAndOpacity({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        }),
        toolbarBgColorPalette({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorPalette",
            "onChangeBgColorPaletteOpacity",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        }),
        toolbarBgColorFields({
          v,
          device,
          state,
          onChange: [
            "onChangeBgColorHexAndOpacity",
            "onChangeBgColorHexAndOpacityPalette",
            "onChangeBgColorHexAndOpacityDependencies"
          ]
        })
      ]
    }
  ];
}
