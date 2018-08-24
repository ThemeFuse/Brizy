import Config from "visual/global/Config";
import { calcWrapperSizes } from "./calculations";
import { t } from "visual/utils/i18n";
import { getOptionColor, getDynamicChoices } from "visual/utils/options";
import { hexToRgba } from "visual/utils/color";

export const getMinSize = () => 5;
export const getMaxSize = () => 100;
export const getMinHeight = () => 5;
export const getMaxHeight = (cW, v) => {
  const { imageWidth: iW, imageHeight: iH } = v;
  const originalContainerWidth = iH / (iW / cW);
  const maxHeight = ((cW * 2) / originalContainerWidth) * 100;

  return maxHeight >= 100 ? Math.round(maxHeight) : 100;
};

const dynamicContent = Config.get("dynamicContent");

export default ({
  desktopWrapperSizes,
  desktopContainerWidth,
  mobileWrapperSizes,
  mobileContainerWidth
}) => ({
  getItemsForDesktop: getItemsForDesktop(
    desktopWrapperSizes,
    desktopContainerWidth
  ),
  getItemsForMobile: getItemsForMobile(mobileWrapperSizes, mobileContainerWidth)
});

export const getItemsForDesktop = (wrapperSizes, cW) => v => {
  const maxBorderRadius = Math.round(
    Math.min(wrapperSizes.width, wrapperSizes.height) / 2
  );
  const { hex: boxShadowColorHex } = getOptionColor(v, "boxShadowColor");

  return [
    {
      id: "toolbarImage",
      type: "popover",
      icon: "nc-img",
      title: t("Image"),
      position: 80,
      options: [
        {
          id: "image",
          label: t("Image"),
          type: "imageSetter",
          population: {
            show: Boolean(dynamicContent),
            choices: getDynamicChoices("image")
          },
          value: {
            width: v.imageWidth,
            height: v.imageHeight,
            src: v.imageSrc,
            x: v.positionX,
            y: v.positionY,
            population: v.imagePopulation
          },
          onChange: ({ width, height, src, x, y, population }) => {
            if (population) {
              return {
                imagePopulation: population
              };
            }

            width = width || DEFAULT_IMAGE_SIZES.width;
            height = height || DEFAULT_IMAGE_SIZES.height;
            const newWrapperSize = calcWrapperSizes(cW, {
              imageWidth: width,
              imageHeight: height,
              resize: v.resize,
              width: v.width,
              height: 100
            });
            const newHeight =
              src === v.imageSrc
                ? v.height
                : (wrapperSizes.height / newWrapperSize.height) * 100;

            return {
              imageWidth: width,
              imageHeight: height,
              imageSrc: src,
              height: Math.round(newHeight),
              positionX: x,
              positionY: y,
              imagePopulation: "",
              mobilePositionX:
                v.positionX === v.mobilePositionX ? x : v.mobilePositionX,
              mobilePositionY:
                v.positionY === v.mobilePositionY ? y : v.mobilePositionY
            };
          }
        },
        {
          id: "zoom",
          label: t("Zoom"),
          type: "slider",
          disabled: Boolean(v.imagePopulation),
          slider: {
            min: 100,
            max: 200
          },
          value: {
            value: v.zoom
          },
          onChange: ({ value: zoom }) => ({
            zoom,
            mobileZoom: v.zoom === v.mobileZoom ? zoom : v.mobileZoom
          })
        }
        // {
        //   id: "media",
        //   type: "tabs",
        //   tabs: [
        //     {
        //       id: "image",
        //       label: t("Image"),
        //       options: []
        //     },
        //     {
        //       id: "style",
        //       label: t("Style"),
        //       options: [
        //          {
        //            id: "imageOpacity",
        //            label: t("Opacity"),
        //            type: "slider",
        //            slider: {
        //              min: 0,
        //              max: 100
        //            },
        //            input: {
        //              show: true,
        //              min: 0,
        //              max: 100
        //            },
        //            suffix: {
        //              show: true,
        //              choices: [
        //                {
        //                  title: "%",
        //                  value: "%"
        //                }
        //              ]
        //            },
        //            value: {
        //              value: v.imageOpacity
        //            },
        //            onChange: ({ value: imageOpacity }) => ({imageOpacity})
        //          },
        //          {
        //            id: "imageHue",
        //            label: t("Hue"),
        //            type: "slider",
        //            slider: {
        //              min: 0,
        //              max: 360
        //            },
        //            input: {
        //              show: true,
        //              min: 0,
        //              max: 360
        //            },
        //            suffix: {
        //              show: true,
        //              choices: [
        //                {
        //                  title: "deg",
        //                  value: "deg"
        //                }
        //              ]
        //            },
        //            value: {
        //              value: v.imageHue
        //            },
        //            onChange: ({ value: imageHue }) => ({imageHue})
        //          },
        //          {
        //            id: "imageBrightness",
        //            label: t("Brigh.."),
        //            type: "slider",
        //            slider: {
        //              min: 10,
        //              max: 200
        //            },
        //            input: {
        //              show: true,
        //              min: 10,
        //              max: 200
        //            },
        //            suffix: {
        //              show: true,
        //              choices: [
        //                {
        //                  title: "%",
        //                  value: "%"
        //                }
        //              ]
        //            },
        //            value: {
        //              value: v.imageBrightness
        //            },
        //            onChange: ({ value: imageBrightness }) => ({imageBrightness})
        //          },
        //          {
        //            id: "imageSaturation",
        //            label: t("Satur.."),
        //            type: "slider",
        //            slider: {
        //              min: 0,
        //              max: 200
        //            },
        //            input: {
        //              show: true,
        //              min: 0,
        //              max: 200
        //            },
        //            suffix: {
        //              show: true,
        //              choices: [
        //                {
        //                  title: "%",
        //                  value: "%"
        //                }
        //              ]
        //            },
        //            value: {
        //              value: v.imageSaturation
        //            },
        //            onChange: ({ value: imageSaturation }) => ({imageSaturation})
        //          }
        //       ]
        //     }
        //   ]
        // }
      ]
    },
    {
      id: "toolbarLink",
      type: "popover",
      icon: "nc-link",
      title: t("Link"),
      size: "medium",
      position: 90,
      options: [
        {
          id: "linkType",
          type: "tabs",
          value: v.linkType,
          tabs: [
            {
              id: "anchor",
              label: t("Anchor"),
              options: [
                {
                  id: "linkAnchor",
                  label: t("Anchor"),
                  type: "blockThumbnail",
                  value: v.linkAnchor
                }
              ]
            },
            {
              id: "external",
              label: t("URL"),
              options: [
                {
                  id: "linkExternal",
                  type: "input",
                  label: t("Link to"),
                  placeholder: "http://",
                  population: {
                    show: Boolean(dynamicContent),
                    choices: getDynamicChoices("link")
                  },
                  value: {
                    population: v.linkPopulation,
                    value: v.linkExternal
                  },
                  onChange: ({
                    value: linkExternal,
                    population: linkPopulation,
                    changed
                  }) => {
                    return {
                      linkExternal,
                      linkPopulation,
                      linkExternalType:
                        changed === "value" || linkPopulation === ""
                          ? "linkExternal"
                          : "linkPopulation"
                    };
                  }
                },
                {
                  id: "linkExternalBlank",
                  type: "switch",
                  label: t("Open In New Tab"),
                  value: v.linkExternalBlank
                },
                {
                  id: "linkExternalRel",
                  type: "switch",
                  label: t("Make it Nofollow"),
                  value: v.linkExternalRel
                }
              ]
            },
            {
              id: "lightBox",
              label: t("LightBox"),
              options: [
                {
                  id: "linkLightBox",
                  label: t("LightBox"),
                  type: "switch",
                  value: v.linkLightBox
                }
              ]
            }
          ]
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
          id: "resize",
          label: t("Size"),
          type: "slider",
          slider: {
            min: getMinSize(),
            max: getMaxSize()
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
            value: v.resize
          },
          onChange: ({ value: resize }) => ({
            resize,
            mobileResize: v.resize === v.mobileResize ? resize : v.mobileResize
          })
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider",
          slider: {
            min: getMinHeight(),
            max: getMaxHeight(cW, v)
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
            value: v.height
          },
          onChange: ({ value: height }) => ({
            height,
            mobileHeight: v.height === v.mobileHeight ? height : v.mobileHeight
          })
        },
        {
          type: "multiPicker",
          picker: {
            id: "borderRadiusType",
            label: t("Corner"),
            type: "radioGroup",
            choices: [
              {
                value: "square",
                icon: "nc-corners-square"
              },
              {
                value: "rounded",
                icon: "nc-corners-round"
              },
              {
                value: "custom",
                icon: "nc-more"
              }
            ],
            value: v.borderRadiusType,
            onChange: borderRadiusType => ({
              borderRadiusType,

              borderRadius:
                borderRadiusType === "square"
                  ? v.tempBorderRadius
                  : borderRadiusType === "rounded"
                    ? maxBorderRadius
                    : v.borderRadius
            })
          },
          choices: {
            custom: [
              {
                id: "borderRadius",
                type: "slider",
                slider: {
                  min: 0,
                  max: maxBorderRadius
                },
                input: {
                  show: true,
                  max: maxBorderRadius
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
                  value: Math.min(v.borderRadius, maxBorderRadius)
                },
                onChange: ({ value: borderRadius }) => ({
                  borderRadius,
                  tempBorderRadius: borderRadius
                })
              }
            ]
          }
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
                              {
                                id: "boxShadowColor",
                                type: "colorPicker",
                                value: {
                                  hex: boxShadowColorHex,
                                  opacity: v.boxShadowColorOpacity
                                },
                                onChange: ({
                                  hex,
                                  opacity,
                                  isChanged,
                                  opacityDragEnd
                                }) => {
                                  const boxShadowColorOpacity =
                                    hex !== v.boxShadowColorHex &&
                                    v.boxShadowColorOpacity === 0
                                      ? v.tempBoxShadowColorOpacity
                                      : opacity;

                                  return {
                                    boxShadowColorHex: hex,
                                    boxShadowColorOpacity: boxShadowColorOpacity,
                                    boxShadowColorPalette:
                                      isChanged === "hex"
                                        ? ""
                                        : v.boxShadowColorPalette
                                  };
                                }
                              },
                              {
                                id: "boxShadowColorPalette",
                                type: "colorPalette",
                                position: 20,
                                value: v.boxShadowColorPalette,
                                onChange: boxShadowColorPalette => ({
                                  boxShadowColorPalette,
                                  boxShadowColorHex: "",
                                  boxShadowColorOpacity:
                                    v.boxShadowColorOpacity === 0
                                      ? v.tempBoxShadowColorOpacity
                                      : v.boxShadowColorOpacity
                                })
                              },
                              {
                                id: "boxShadowColorFields",
                                type: "colorFields",
                                position: 30,
                                value: {
                                  hex: boxShadowColorHex,
                                  opacity: v.boxShadowColorOpacity
                                },
                                onChange: ({ hex, opacity, isChanged }) => {
                                  const boxShadowColorOpacity =
                                    hex !== v.boxShadowColorHex &&
                                    v.boxShadowColorOpacity === 0
                                      ? v.tempBoxShadowColorOpacity
                                      : opacity;

                                  return {
                                    boxShadowColorPalette:
                                      isChanged === "hex"
                                        ? ""
                                        : v.boxShadowColorPalette,
                                    boxShadowColorHex: hex,
                                    boxShadowColorOpacity: boxShadowColorOpacity
                                  };
                                }
                              }
                            ]
                          },
                          {
                            id: "boxShadowBlur",
                            type: "slider",
                            icon: "nc-blur",
                            slider: {
                              min: 0
                            },
                            input: {
                              show: true,
                              min: 0
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
                              value: v.boxShadowBlur
                            },
                            onChange: ({ value: boxShadowBlur }) => ({
                              boxShadowBlur,
                              boxShadowColorOpacity:
                                v.boxShadowColorOpacity === 0
                                  ? v.tempBoxShadowColorOpacity
                                  : v.boxShadowColorOpacity
                            })
                          },
                          {
                            id: "boxShadowSpread",
                            type: "slider",
                            icon: "nc-size",
                            slider: {
                              min: -100,
                              max: 100
                            },
                            input: {
                              show: true,
                              min: 0
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
                              value: v.boxShadowSpread
                            },
                            onChange: ({ value: boxShadowSpread }) => ({
                              boxShadowSpread,
                              boxShadowColorOpacity:
                                v.boxShadowColorOpacity === 0
                                  ? v.tempBoxShadowColorOpacity
                                  : v.boxShadowColorOpacity
                            })
                          },
                          {
                            id: "boxShadowVertical",
                            type: "slider",
                            icon: "nc-vertical",
                            slider: {
                              min: -100,
                              max: 100
                            },
                            input: {
                              show: true,
                              min: -100,
                              max: 100
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
                              value: v.boxShadowVertical
                            },
                            onChange: ({ value: boxShadowVertical }) => ({
                              boxShadowVertical,
                              boxShadowColorOpacity:
                                v.boxShadowColorOpacity === 0
                                  ? v.tempBoxShadowColorOpacity
                                  : v.boxShadowColorOpacity
                            })
                          },
                          {
                            id: "boxShadowHorizontal",
                            type: "slider",
                            icon: "nc-horizontal",
                            slider: {
                              min: -100,
                              max: 100
                            },
                            input: {
                              show: true,
                              min: -100,
                              max: 100
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
                              value: v.boxShadowHorizontal
                            },
                            onChange: ({ value: boxShadowHorizontal }) => ({
                              boxShadowHorizontal,
                              boxShadowColorOpacity:
                                v.boxShadowColorOpacity === 0
                                  ? v.tempBoxShadowColorOpacity
                                  : v.boxShadowColorOpacity
                            })
                          }
                        ]
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};

export const getItemsForMobile = (wrapperSizes, cW) => v => {
  return [
    {
      id: "toolbarImage",
      type: "popover",
      icon: "nc-img",
      title: t("Image"),
      position: 80,
      options: [
        {
          id: "mobileImage",
          label: t("Image"),
          type: "imageSetter",
          onlyPointer: true,
          population: {
            show: Boolean(dynamicContent),
            choices: getDynamicChoices("image", dynamicContent)
          },
          value: {
            width: v.imageWidth,
            height: v.imageHeight,
            src: v.imageSrc,
            x: v.mobilePositionX,
            y: v.mobilePositionY,
            population: v.imagePopulation
          },
          onChange: ({ width, height, x, y, population }) => {
            if (population) {
              return {
                imagePopulation: population
              };
            }

            width = width || DEFAULT_IMAGE_SIZES.width;
            height = height || DEFAULT_IMAGE_SIZES.height;
            const newWrapperSize = calcWrapperSizes(cW, {
              imageWidth: width,
              imageHeight: height,
              resize: v.mobileResize,
              width: v.mobileWidth,
              height: 100
            });
            const newHeight =
              (wrapperSizes.height / newWrapperSize.height) * 100;

            return {
              imageWidth: width,
              imageHeight: height,
              mobilePositionX: x,
              mobilePositionY: y,
              mobileHeight: Math.round(newHeight),
              imagePopulation: ""
            };
          }
        },
        {
          id: "mobileZoom",
          label: t("Zoom"),
          type: "slider",
          disabled: Boolean(v.imagePopulation),
          slider: {
            min: 100,
            max: 200
          },
          value: {
            value: v.mobileZoom
          },
          onChange: ({ value: mobileZoom }) => ({ mobileZoom })
        }
      ]
    },
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "mobileResize",
          label: t("Size"),
          type: "slider",
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
            value: v.mobileResize
          },
          onChange: ({ value: mobileResize }) => ({ mobileResize })
        },
        {
          id: "mobileHeight",
          label: t("Height"),
          type: "slider",
          slider: {
            max: getMaxHeight(cW, v)
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
            value: v.mobileHeight
          },
          onChange: ({ value: mobileHeight }) => ({ mobileHeight })
        }
      ]
    }
  ];
};

const DEFAULT_IMAGE_SIZES = {
  width: 1440,
  height: 960
};
