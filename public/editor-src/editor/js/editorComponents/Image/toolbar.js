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
  toolbarBoxShadow2,
  toolbarBoxShadowHexField2,
  toolbarBoxShadowFields2,
  toolbarImageTags
} from "visual/utils/toolbar";
import { IS_GLOBAL_POPUP } from "visual/utils/models";
import { DCTypes } from "visual/global/Config/types/DynamicContent";

export const getMinSize = () => 5;
export const getMaxSize = () => 100;
export const getMinHeight = () => 5;
export const getMaxHeight = (cW, v) => {
  const { imageWidth: iW, imageHeight: iH } = v;
  const originalContainerWidth = iH / (iW / cW);
  const maxHeight = ((cW * 2) / originalContainerWidth) * 100;

  return maxHeight >= 100 ? Math.round(maxHeight) : 100;
};

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

export const getItemsForDesktop = (wrapperSizes, cW, gallery) => (
  v,
  component
) => {
  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);
  const device = "desktop";
  const maxBorderRadius = Math.round(
    Math.min(wrapperSizes.width, wrapperSizes.height) / 2
  );
  const imageDynamicContentChoices = getDynamicContentChoices(
    component.context.dynamicContent.config,
    DCTypes.image
  );

  const { hex: boxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device }),
    defaultValueValue({ v, key: "boxShadowColorPalette", device })
  );
  const { inGallery = false } = gallery || {};

  return [
    {
      id: "toolbarImage",
      type: "popover-dev",
      config: {
        icon: "nc-img",
        title: t("Image")
      },
      position: 80,
      options: [
        {
          id: "media",
          type: "tabs-dev",
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
                  type: "slider-dev",
                  disabled:
                    Boolean(v.imagePopulation) || isSVG(v.imageExtension),
                  config: {
                    min: 100,
                    max: 200,
                    units: [{ value: "%", title: "%" }]
                  }
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
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              boxShadowColorHex,
              v.boxShadowColorOpacity
            )
          }
        }
      },
      roles: ["admin"],
      position: 80,
      options: [
        {
          id: "tabsState",
          tabsPosition: "left",
          type: "tabs",
          tabs: [
            {
              id: "tabNormal",
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: "tabsColor",
                  type: "tabs-dev",
                  config: {
                    showSingle: true
                  },
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
                  type: "tabs-dev",
                  config: {
                    showSingle: true
                  },
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
      ]
    },
    {
      id: "toolbarLink",
      type: "popover-dev",
      config: {
        icon: "nc-link",
        title: t("Link"),
        size: "medium"
      },
      position: 90,
      disabled: inGallery && v.linkLightBox === "on",
      options: [
        {
          id: "linkType",
          type: "tabs-dev",
          config: {
            saveTab: true
          },
          tabs: [
            {
              id: "external",
              label: t("URL"),
              options: [
                toolbarImageLinkExternal({
                  v,
                  inGallery
                }),
                {
                  id: "linkExternalBlank",
                  type: "switch-dev",
                  label: t("Open In New Tab")
                },
                {
                  id: "linkExternalRel",
                  type: "switch-dev",
                  label: t("Make it Nofollow")
                }
              ]
            },
            {
              id: "anchor",
              label: t("Block"),
              options: [toolbarLinkAnchor({ v, disabled: IS_GLOBAL_POPUP })]
            },
            {
              id: "popup",
              label: t("Popup"),
              options: [
                {
                  id: "linkPopup",
                  type: "promptAddPopup",
                  disabled: inPopup || inPopup2 || IS_GLOBAL_POPUP,
                  label: t("Popup"),
                  popupKey: `${component.getId()}_${v.linkPopup}`,
                  value: {
                    value: v.linkPopup,
                    popups: v.popups
                  },
                  onChange: ({ value, popups }) => ({
                    linkPopup: value,
                    popups
                  })
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        title: t("Settings")
      },
      roles: ["admin"],
      position: 110,
      disabled: inGallery,
      options: [
        {
          id: "resize",
          label: t("Size"),
          type: "slider-dev",
          config: {
            min: getMinSize(),
            max: getMaxSize(),
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider-dev",
          disabled: isSVG(v.imageExtension),
          config: {
            min: getMinHeight(),
            max: getMaxHeight(cW, v),
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "borderRadiusTypeGroup",
          type: "group-dev",
          options: [
            {
              id: "borderRadiusType",
              label: t("Corner"),
              type: "radioGroup",
              choices: [
                { value: "square", icon: "nc-corners-square" },
                { value: "rounded", icon: "nc-corners-round" },
                { value: "custom", icon: "nc-more" }
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
            {
              id: "borderRadius",
              type: "slider",
              disabled: v.borderRadiusType !== "custom",
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
                choices: [{ title: "px", value: "px" }]
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

export const getItemsForTablet = (wrapperSizes, cW, gallery) => (
  v,
  component
) => {
  const { inGallery = false } = gallery || {};
  const imageDynamicContentChoices = getDynamicContentChoices(
    component.context.dynamicContent.config,
    DCTypes.image
  );

  return [
    {
      id: "toolbarImage",
      type: "popover-dev",
      config: {
        icon: "nc-img",
        title: t("Image")
      },
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
          id: "zoom",
          label: t("Zoom"),
          type: "slider-dev",
          disabled: Boolean(v.imagePopulation),
          config: {
            min: 100,
            max: 200,
            units: [{ value: "%", title: "%" }]
          }
        }
      ]
    },
    {
      id: "tabletToolbarLink",
      type: "popover-dev",
      config: {
        icon: "nc-link"
      },
      position: 90,
      options: [
        {
          id: "linkPopup",
          type: "promptAddPopup",
          label: t("Popup"),
          disabled: v.linkType !== "popup" || v.linkPopup === "",
          canDelete: false,
          popupKey: `${component.getId()}_${v.linkPopup}`,
          value: {
            value: v.linkPopup,
            popups: v.popups
          },
          onChange: ({ value, popups }) => ({
            linkPopup: value,
            popups
          })
        }
      ]
    },
    {
      id: "tabletToolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      roles: ["admin"],
      position: 110,
      disabled: inGallery,
      options: [
        {
          id: "resize",
          label: t("Size"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider-dev",
          config: {
            max: getMaxHeight(cW, v),
            units: [{ value: "%", title: "%" }]
          }
        }
      ]
    }
  ];
};

export const getItemsForMobile = (wrapperSizes, cW, gallery) => (
  v,
  component
) => {
  const { inGallery = false } = gallery || {};
  const imageDynamicContentChoices = getDynamicContentChoices(
    component.context.dynamicContent.config,
    DCTypes.image
  );

  return [
    {
      id: "toolbarImage",
      type: "popover-dev",
      config: {
        icon: "nc-img",
        title: t("Image")
      },
      position: 80,
      options: [
        {
          id: "media",
          type: "tabs-dev",
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
                  id: "zoom",
                  label: t("Zoom"),
                  type: "slider-dev",
                  disabled: Boolean(v.imagePopulation),
                  config: {
                    min: 100,
                    max: 200,
                    units: [{ value: "%", title: "%" }]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mobileToolbarLink",
      type: "popover-dev",
      config: {
        icon: "nc-link"
      },
      position: 90,
      options: [
        {
          id: "linkPopup",
          type: "promptAddPopup",
          label: t("Popup"),
          disabled: v.linkType !== "popup" || v.linkPopup === "",
          canDelete: false,
          popupKey: `${component.getId()}_${v.linkPopup}`,
          value: {
            value: v.linkPopup,
            popups: v.popups
          },
          onChange: ({ value, popups }) => ({
            linkPopup: value,
            popups
          })
        }
      ]
    },
    {
      id: "mobileToolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      roles: ["admin"],
      position: 110,
      disabled: inGallery,
      options: [
        {
          id: "resize",
          label: t("Size"),
          type: "slider-dev",
          config: {
            min: 5,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider-dev",
          config: {
            max: getMaxHeight(cW, v),
            units: [{ value: "%", title: "%" }]
          }
        }
      ]
    }
  ];
};

const DEFAULT_IMAGE_SIZES = {
  width: 1440,
  height: 960
};
