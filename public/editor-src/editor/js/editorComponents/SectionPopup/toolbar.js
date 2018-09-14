import { hexToRgba } from "visual/utils/color";
import { getOptionColor } from "visual/utils/options";
import { t } from "visual/utils/i18n";

export function getItemsForDesktop(v, component) {
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
          value: {
            width: v.bgImageWidth,
            height: v.bgImageHeight,
            src: v.bgImageSrc,
            x: v.bgPositionX,
            y: v.bgPositionY
          },
          onChange: ({ width, height, src, x, y }) => ({
            bgImageWidth: width,
            bgImageHeight: height,
            bgImageSrc: src,
            bgPositionX: x,
            bgPositionY: y,

            bgColorOpacity:
              src !== "" && v.bgColorOpacity === 1 ? 0.9 : v.bgColorOpacity,

            tempBgColorOpacity:
              src !== "" && v.bgColorOpacity === 1 ? 0.9 : v.tempBgColorOpacity,

            // Mobile
            mobileBgImageWidth:
              v.bgImageWidth === v.mobileBgImageWidth
                ? width
                : v.mobileBgImageWidth,

            mobileBgImageHeight:
              v.bgImageHeight === v.mobileBgImageHeight
                ? height
                : v.mobileBgImageHeight,

            mobileBgImageSrc:
              v.bgImageSrc === v.mobileBgImageSrc ? src : v.mobileBgImageSrc,

            mobileBgPositionX:
              v.bgPositionX === v.mobileBgPositionX ? x : v.mobileBgPositionX,

            mobileBgPositionY:
              v.bgPositionX === v.mobileBgPositionX ? y : v.mobileBgPositionY,

            mobileBgColorOpacity:
              src !== "" &&
              v.bgImageSrc === v.mobileBgImageSrc &&
              v.mobileBgColorOpacity === 1
                ? 0.9
                : v.mobileBgColorOpacity,

            tempMobileBgColorOpacity:
              src !== "" &&
              v.bgImageSrc === v.mobileBgImageSrc &&
              v.mobileBgColorOpacity === 1
                ? 0.9
                : v.tempMobileBgColorOpacity
          })
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
                {
                  id: "bgColor",
                  type: "colorPicker",
                  position: 10,
                  value: {
                    hex: bgColorHex,
                    opacity: v.bgColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
                    const bgColorOpacity =
                      hex !== v.bgColorHex && v.bgColorOpacity === 0
                        ? v.tempBgColorOpacity
                        : opacity;

                    return {
                      bgColorHex: hex,
                      bgColorOpacity: bgColorOpacity,
                      bgColorPalette:
                        isChanged === "hex" ? "" : v.bgColorPalette,

                      mobileBgColorHex:
                        v.bgColorHex === v.mobileBgColorHex
                          ? hex
                          : v.mobileBgColorHex,

                      mobileBgColorOpacity:
                        v.bgColorOpacity === v.mobileBgColorOpacity
                          ? bgColorOpacity
                          : v.mobileBgColorOpacity,

                      mobileBgColorPalette:
                        v.bgColorPalette === v.mobileBgColorPalette &&
                        isChanged === "hex"
                          ? ""
                          : v.mobileBgColorPalette,

                      tempBgColorOpacity:
                        bgColorOpacity > 0 && opacityDragEnd
                          ? bgColorOpacity
                          : v.tempBgColorOpacity
                    };
                  }
                },
                {
                  id: "bgColorPalette",
                  type: "colorPalette",
                  position: 20,
                  value: v.bgColorPalette,
                  onChange: value => ({
                    bgColorPalette: value,
                    bgColorHex: "",
                    bgColorOpacity:
                      v.bgColorOpacity === 0
                        ? v.tempBgColorOpacity
                        : v.bgColorOpacity,

                    mobileBgColorPalette:
                      v.bgColorPalette === v.mobileBgColorPalette
                        ? value
                        : v.mobileBgColorPalette,

                    mobileBgColorHex:
                      v.bgColorPalette === v.mobileBgColorPalette
                        ? ""
                        : v.mobileBgColorHex,

                    mobileBgColorOpacity:
                      v.bgColorPalette === v.mobileBgColorPalette
                        ? v.tempBgColorOpacity
                        : v.mobileBgColorOpacity
                  })
                },
                {
                  id: "bgColorFields",
                  type: "colorFields",
                  position: 30,
                  value: {
                    hex: bgColorHex,
                    opacity: v.bgColorOpacity
                  },
                  onChange: ({ hex, opacity, isChanged }) => {
                    const bgColorOpacity =
                      hex !== v.bgColorHex && v.bgColorOpacity === 0
                        ? v.tempBgColorOpacity
                        : opacity;

                    return {
                      bgColorPalette:
                        isChanged === "hex" ? "" : v.bgColorPalette,
                      bgColorHex: hex,
                      bgColorOpacity: bgColorOpacity,

                      mobileBgColorHex:
                        v.bgColorHex === v.mobileBgColorHex
                          ? hex
                          : v.mobileBgColorHex,

                      mobileBgColorOpacity:
                        v.bgColorOpacity === v.mobileBgColorOpacity
                          ? bgColorOpacity
                          : v.mobileBgColorOpacity,

                      mobileBgColorPalette:
                        v.bgColorPalette === v.mobileBgColorPalette &&
                        isChanged === "hex"
                          ? ""
                          : v.mobileBgColorPalette
                    };
                  }
                }
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

export function getItemsForMobile(v) {
  const { hex: mobileBgColorHex } = getOptionColor(v, "mobileBgColor");

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
          value: {
            width: v.mobileBgImageWidth,
            height: v.mobileBgImageHeight,
            src: v.mobileBgImageSrc,
            x: v.mobileBgPositionX,
            y: v.mobileBgPositionY
          },
          onChange: ({ width, height, src, x, y }) => ({
            mobileBgImageWidth: width,
            mobileBgImageHeight: height,
            mobileBgImageSrc: src,
            mobileBgPositionX: x,
            mobileBgPositionY: y,

            mobileBgColorOpacity:
              src !== "" && v.mobileBgColorOpacity === 1
                ? 0.9
                : v.mobileBgColorOpacity,

            tempMobileBgColorOpacity:
              src !== "" && v.mobileBgColorOpacity === 1
                ? 0.9
                : v.tempMobileBgColorOpacity
          })
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
          backgroundColor: hexToRgba(mobileBgColorHex, v.mobileBgColorOpacity)
        }
      },
      options: [
        {
          id: "mobileBgColor",
          type: "colorPicker",
          position: 10,
          value: {
            hex: mobileBgColorHex,
            opacity: v.mobileBgColorOpacity
          },
          onChange: ({ hex, opacity, isChanged }) => {
            const bgColorOpacity =
              hex !== v.mobileBgColorHex && v.mobileBgColorOpacity === 0
                ? v.tempBgColorOpacity
                : opacity;

            return {
              mobileBgColorHex: hex,
              mobileBgColorOpacity: bgColorOpacity,
              mobileBgColorPalette:
                isChanged === "hex" ? "" : v.mobileBgColorPalette
            };
          }
        },
        {
          id: "mobileBgColorPalette",
          type: "colorPalette",
          position: 20,
          value: v.mobileBgColorPalette,
          onChange: value => ({
            mobileBgColorPalette: value,
            mobileBgColorHex: "",
            mobileBgColorOpacity:
              v.mobileBgColorOpacity === 0
                ? v.tempBgColorOpacity
                : v.mobileBgColorOpacity
          })
        },
        {
          id: "mobileBgColorFields",
          type: "colorFields",
          position: 30,
          value: {
            hex: mobileBgColorHex,
            opacity: v.mobileBgColorOpacity
          },
          onChange: ({ hex, opacity, isChanged }) => ({
            mobileBgColorPalette:
              isChanged === "hex" ? "" : v.mobileBgColorPalette,
            mobileBgColorHex: hex,
            mobileBgColorOpacity: opacity
          })
        }
      ]
    }
  ];
}
