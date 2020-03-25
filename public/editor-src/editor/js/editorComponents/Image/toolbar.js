import { calcWrapperSizes } from "./calculations";
import {
  getOptionColorHexByPalette,
  getDynamicContentChoices
} from "visual/utils/options";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import {
  defaultValueValue,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";

import {
  toolbarLinkAnchor,
  toolbarImageLinkExternal,
  toolbarLinkExternalBlank,
  toolbarLinkExternalRel,
  toolbarBoxShadow2,
  toolbarBoxShadowHexField2,
  toolbarBoxShadowFields2,
  toolbarImageTags
} from "visual/utils/toolbar";

export const getMinSize = () => 5;
export const getMaxSize = () => 100;
export const getMinHeight = () => 5;
export const getMaxHeight = (cW, v) => {
  const { imageWidth: iW, imageHeight: iH } = v;
  const originalContainerWidth = iH / (iW / cW);
  const maxHeight = ((cW * 2) / originalContainerWidth) * 100;

  return maxHeight >= 100 ? Math.round(maxHeight) : 100;
};

const imageDynamicContentChoices = getDynamicContentChoices("image");

const isSVG = extension => extension === "svg";

export default ({
  desktopWrapperSizes,
  desktopContainerWidth,
  tabletWrapperSizes,
  tabletContainerWidth,
  mobileWrapperSizes,
  mobileContainerWidth,
  gallery
}) => ({
  getItemsForDesktop: getItemsForDesktop(
    desktopWrapperSizes,
    desktopContainerWidth,
    gallery
  ),
  getItemsForTablet: getItemsForTablet(
    tabletWrapperSizes,
    tabletContainerWidth,
    gallery
  ),
  getItemsForMobile: getItemsForMobile(
    mobileWrapperSizes,
    mobileContainerWidth,
    gallery
  )
});

export const getItemsForDesktop = (wrapperSizes, cW, gallery) => v => {
  const device = "desktop";
  const maxBorderRadius = Math.round(
    Math.min(wrapperSizes.width, wrapperSizes.height) / 2
  );

  const { hex: boxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device }),
    defaultValueValue({ v, key: "boxShadowColorPalette", device })
  );
  const { inGallery = false } = gallery || {};

  return [
    {
      id: "toolbarImage",
      type: "popover",
      icon: "nc-img",
      title: t("Image"),
      position: 80,
      options: [
        {
          id: "media",
          type: "tabs",
          tabs: [
            {
              id: "image",
              label: t("Image"),
              options: [
                {
                  id: "image",
                  label: t("Image"),
                  type: "imageSetter",
                  showPointer: !isSVG(v.imageExtension),
                  population: {
                    show: imageDynamicContentChoices.length > 0 && !inGallery,
                    choices: imageDynamicContentChoices
                  },
                  value: {
                    width: v.imageWidth,
                    height: v.imageHeight,
                    extension: v.imageExtension,
                    src: v.imageSrc,
                    x: v.positionX,
                    y: v.positionY,
                    population: v.imagePopulation
                  },
                  onChange: ({
                    width,
                    height,
                    src,
                    x,
                    y,
                    population,
                    extension
                  }) => {
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

                    let newHeight = v.height;
                    if (isSVG(extension)) {
                      newHeight = 100;
                    } else if (src !== v.imageSrc) {
                      newHeight = Math.round(
                        (wrapperSizes.height / newWrapperSize.height) * 100
                      );
                    }

                    return {
                      imageWidth: width,
                      imageHeight: height,
                      imageSrc: src,
                      imageExtension: extension,
                      height: newHeight,
                      positionX: x,
                      positionY: y,
                      imagePopulation: ""
                    };
                  }
                },
                {
                  id: "zoom",
                  label: t("Zoom"),
                  type: "slider",
                  disabled:
                    Boolean(v.imagePopulation) || isSVG(v.imageExtension),
                  slider: {
                    min: 100,
                    max: 200
                  },
                  input: {
                    show: true,
                    min: 100,
                    max: 200
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
                    value: v.zoom
                  },
                  onChange: ({ value: zoom }) => ({
                    zoom
                  })
                },
                {
                  id: "linkLightBox",
                  label: t("Open in Lightbox"),
                  type: "switch-dev",
                  disabled: inGallery,
                  devices: "desktop"
                }
              ]
            },
            {
              id: "tags",
              label: t("Tags"),
              options: [toolbarImageTags({ v, device, gallery })]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(boxShadowColorHex, v.boxShadowColorOpacity)
        }
      },
      options: [
        {
          id: "tabsState",
          tabsPosition: "left",
          type: "tabs",
          value: v.tabsState,
          tabs: [
            {
              id: "tabNormal",
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: "tabsColor",
                  type: "tabs",
                  value: v.tabsColor,
                  hideHandlesWhenOne: false,
                  tabs: [
                    {
                      id: "tabBoxShadow",
                      label: t("Shadow"),
                      options: [
                        toolbarBoxShadow2({
                          v,
                          device,
                          state: "normal",
                          onChangeType: [
                            "onChangeBoxShadowType2",
                            "onChangeBoxShadowTypeDependencies2"
                          ],
                          onChangeHex: [
                            "onChangeBoxShadowHexAndOpacity2",
                            "onChangeBoxShadowHexAndOpacityPalette2",
                            "onChangeBoxShadowHexAndOpacityDependencies2"
                          ],
                          onChangePalette: [
                            "onChangeBoxShadowPalette2",
                            "onChangeBoxShadowPaletteOpacity2",
                            "onChangeBoxShadowHexAndOpacityDependencies2"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 41,
                              options: [
                                toolbarBoxShadowHexField2({
                                  v,
                                  device,
                                  state: "normal",
                                  onChange: [
                                    "onChangeBoxShadowHexAndOpacity2",
                                    "onChangeBoxShadowHexAndOpacityPalette2",
                                    "onChangeBoxShadowHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 59,
                              options: [
                                toolbarBoxShadowFields2({
                                  v,
                                  device,
                                  state: "normal",
                                  onChange: [
                                    "onChangeBoxShadowFields2",
                                    "onChangeBoxShadowFieldsDependencies2"
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
              id: "tabHover",
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "tabsColor",
                  type: "tabs",
                  value: v.tabsColor,
                  hideHandlesWhenOne: false,
                  tabs: [
                    {
                      id: "tabBoxShadow",
                      label: t("Shadow"),
                      options: [
                        toolbarBoxShadow2({
                          v,
                          device,
                          state: "hover",
                          devices: "desktop",
                          onChangeType: [
                            "onChangeBoxShadowType2",
                            "onChangeBoxShadowTypeDependencies2"
                          ],
                          onChangeHex: [
                            "onChangeBoxShadowHexAndOpacity2",
                            "onChangeBoxShadowHexAndOpacityPalette2",
                            "onChangeBoxShadowHexAndOpacityDependencies2"
                          ],
                          onChangePalette: [
                            "onChangeBoxShadowPalette2",
                            "onChangeBoxShadowPaletteOpacity2",
                            "onChangeBoxShadowHexAndOpacityDependencies2"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 41,
                              options: [
                                toolbarBoxShadowHexField2({
                                  v,
                                  device,
                                  state: "hover",
                                  devices: "desktop",
                                  onChange: [
                                    "onChangeBoxShadowHexAndOpacity2",
                                    "onChangeBoxShadowHexAndOpacityPalette2",
                                    "onChangeBoxShadowHexAndOpacityDependencies2"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 59,
                              options: [
                                toolbarBoxShadowFields2({
                                  v,
                                  device,
                                  state: "hover",
                                  devices: "desktop",
                                  onChange: [
                                    "onChangeBoxShadowFields2",
                                    "onChangeBoxShadowFieldsDependencies2"
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
        tabsState: !isOpen ? "tabNormal" : v.tabsState
      })
    },
    {
      id: "toolbarLink",
      type: "popover",
      icon: "nc-link",
      title: t("Link"),
      size: "medium",
      position: 90,
      disabled: inGallery && v.linkLightBox === "on",
      options: [
        {
          id: "linkType",
          type: "tabs",
          value: v.linkType,
          tabs: [
            {
              id: "external",
              label: t("URL"),
              options: [
                toolbarImageLinkExternal({
                  v,
                  inGallery
                }),
                toolbarLinkExternalBlank({ v }),
                toolbarLinkExternalRel({ v })
              ]
            },
            {
              id: "anchor",
              label: t("Block"),
              options: [toolbarLinkAnchor({ v })]
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
      disabled: inGallery,
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
            resize
          })
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider",
          disabled: isSVG(v.imageExtension),
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
            height
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
          icon: "nc-cog"
        }
      ]
    }
  ];
};

export const getItemsForTablet = (wrapperSizes, cW, gallery) => v => {
  const { inGallery = false } = gallery || {};

  return [
    {
      id: "toolbarImage",
      type: "popover",
      icon: "nc-img",
      title: t("Image"),
      position: 80,
      options: [
        {
          id: "tabletImage",
          label: t("Image"),
          type: "imageSetter",
          onlyPointer: true,
          showPointer: !isSVG(v.imageExtension),
          population: {
            show: imageDynamicContentChoices.length > 0 && !inGallery,
            choices: imageDynamicContentChoices
          },
          value: {
            width: v.imageWidth,
            height: v.imageHeight,
            extension: v.imageExtension,
            src: v.imageSrc,
            x: tabletSyncOnChange(v, "positionX"),
            y: tabletSyncOnChange(v, "positionY"),
            population: v.imagePopulation
          },
          onChange: ({ width, height, x, y, population, extension }) => {
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
              resize: tabletSyncOnChange(v, "resize"),
              width: tabletSyncOnChange(v, "width"),
              height: 100
            });

            let newHeight = isSVG(extension)
              ? 100
              : Math.round((wrapperSizes.height / newWrapperSize.height) * 100);

            return {
              imageWidth: width,
              imageHeight: height,
              imageExtension: extension,
              tabletPositionX: x,
              tabletPositionY: y,
              tabletHeight: newHeight,
              imagePopulation: ""
            };
          }
        },
        {
          id: "tabletZoom",
          label: t("Zoom"),
          type: "slider",
          disabled: Boolean(v.imagePopulation),
          slider: {
            min: 100,
            max: 200
          },
          value: {
            value: tabletSyncOnChange(v, "zoom")
          },
          onChange: ({ value: tabletZoom }) => ({ tabletZoom })
        }
      ]
    },
    {
      id: "tabletToolbarLink",
      type: "popover",
      icon: "nc-link",
      position: 90,
      options: []
    },
    {
      id: "tabletToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      disabled: inGallery,
      options: [
        {
          id: "tabletResize",
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
            value: tabletSyncOnChange(v, "resize")
          },
          onChange: ({ value: tabletResize }) => ({ tabletResize })
        },
        {
          id: "tabletHeight",
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
            value: tabletSyncOnChange(v, "height")
          },
          onChange: ({ value: tabletHeight }) => ({ tabletHeight })
        }
      ]
    }
  ];
};

export const getItemsForMobile = (wrapperSizes, cW, gallery) => v => {
  const { inGallery = false } = gallery || {};

  return [
    {
      id: "toolbarImage",
      type: "popover",
      icon: "nc-img",
      title: t("Image"),
      position: 80,
      options: [
        {
          id: "media",
          type: "tabs",
          tabs: [
            {
              id: "image",
              label: t("Image"),
              options: [
                {
                  id: "mobileImage",
                  label: t("Image"),
                  type: "imageSetter",
                  onlyPointer: true,
                  showPointer: !isSVG(v.imageExtension),
                  population: {
                    show: imageDynamicContentChoices.length > 0 && !inGallery,
                    choices: imageDynamicContentChoices
                  },
                  value: {
                    width: v.imageWidth,
                    height: v.imageHeight,
                    extension: v.imageExtension,
                    src: v.imageSrc,
                    x: mobileSyncOnChange(v, "positionX"),
                    y: mobileSyncOnChange(v, "positionY"),
                    population: v.imagePopulation
                  },
                  onChange: ({
                    width,
                    height,
                    x,
                    y,
                    population,
                    extension
                  }) => {
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
                      resize: mobileSyncOnChange(v, "resize"),
                      width: mobileSyncOnChange(v, "width"),
                      height: 100
                    });
                    const newHeight = isSVG(extension)
                      ? 100
                      : Math.round(
                          (wrapperSizes.height / newWrapperSize.height) * 100
                        );

                    return {
                      imageWidth: width,
                      imageHeight: height,
                      imageExtension: extension,
                      mobilePositionX: x,
                      mobilePositionY: y,
                      mobileHeight: newHeight,
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
                    value: mobileSyncOnChange(v, "zoom")
                  },
                  onChange: ({ value: mobileZoom }) => ({ mobileZoom })
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mobileToolbarLink",
      type: "popover",
      icon: "nc-link",
      position: 90,
      options: []
    },
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      disabled: inGallery,
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
            value: mobileSyncOnChange(v, "resize")
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
            value: mobileSyncOnChange(v, "height")
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
