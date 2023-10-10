import { keyToDCFallback2Key } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getCollectionTypes } from "visual/utils/api";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isGIFExtension, isSVGExtension } from "visual/utils/image/utils";
import {
  MaskPositions,
  MaskRepeat,
  MaskShapes,
  MaskSizes
} from "visual/utils/mask/Mask";
import { isPopup, isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { read as readString } from "visual/utils/reader/string";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  toolbarImageLinkExternal,
  toolbarImageTags,
  toolbarLinkAnchor,
  toolbarStoryAnchor
} from "visual/utils/toolbar";
import { getImageDCSize } from "./utils";

export default ({
  desktopContainerWidth,
  tabletContainerWidth,
  mobileContainerWidth,
  gallery
}) => ({
  getItems: getItems({
    property: {
      desktop: {
        cW: desktopContainerWidth,
        gallery
      },
      tablet: {
        cW: tabletContainerWidth,
        gallery
      },
      mobile: {
        cW: mobileContainerWidth,
        gallery
      }
    }
  })
});

export const getItems =
  ({ property }) =>
  ({ v, device, component, context }) => {
    const config = Config.getAll();

    const inPopup = Boolean(component.props.meta.sectionPopup);
    const inPopup2 = Boolean(component.props.meta.sectionPopup2);
    const { cW, gallery } = property[device];

    const isBigImageFromGallery = Boolean(v?.clonedFromGallery);

    const {
      inGallery = false,
      withBigImage = false,
      enableTags
    } = gallery || {};
    const dvv = (key) => defaultValueValue({ v, key, device });
    const { hex: borderColorHex } = getOptionColorHexByPalette(
      dvv("borderColorHex"),
      dvv("borderColorPalette")
    );

    const _enableTags = enableTags && !isBigImageFromGallery;
    const collectionTypesHandler =
      config?.api?.collectionTypes?.loadCollectionTypes.handler;
    const borderColorOpacity = dvv("borderColorOpacity");

    const maskShape = readString(dvv("maskShape")) ?? "none";
    const maskPosition = readString(dvv("maskPosition")) ?? "center center";
    const maskSize = readString(dvv("maskSize")) ?? "cover";
    const maskScaleSuffix = readString(dvv("maskScaleSuffix")) ?? "%";
    const maskCustomUploadImageSrc = readString(
      dvv("maskCustomUploadImageSrc")
    );
    const maskShapeIsDisabled =
      maskShape === "none" ||
      (maskShape === "custom" && !maskCustomUploadImageSrc);

    const widthSuffixValue = dvv("widthSuffix");
    const heightSuffixValue = dvv("heightSuffix");
    const sizeType = dvv("sizeType");

    const imageDynamicContentChoices = getDynamicContentOption({
      options: context.dynamicContent.config,
      type: DCTypes.image
    });

    const linkSource = dvv("linkSource");

    const imageExtension = dvv("imageExtension");
    const imagePopulation = dvv("imagePopulation");
    const linkPopup = dvv("linkPopup");

    const dcSize = getImageDCSize(imagePopulation, context);
    const isCustomSizeType = sizeType === "custom";
    const isSvgOrGif =
      (isSVGExtension(imageExtension) || isGIFExtension(imageExtension)) &&
      !dcSize;

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
                id: "tabImage",
                label: t("Image"),
                options: [
                  // Use population-dev option type instead of using the `population` config for imageUpload-dev,
                  // because the population id and imageUpload-dev id are different.
                  {
                    id: "image",
                    type: "population-dev",
                    label: t("Image"),
                    disabled:
                      ((isSVGExtension(imageExtension) ||
                        isGIFExtension(imageExtension) ||
                        imagePopulation) &&
                        device !== "desktop") ||
                      isBigImageFromGallery,
                    config:
                      device === "desktop" &&
                      !gallery.inGallery &&
                      imageDynamicContentChoices
                        ? imageDynamicContentChoices
                        : undefined,
                    fallback: {
                      id: keyToDCFallback2Key("image"),
                      type: "imageUpload-dev"
                    },
                    option: {
                      id: "",
                      type: "imageUpload-dev",
                      config: {
                        edit: device === "desktop"
                      }
                    }
                  },
                  {
                    id: "zoom",
                    label: t("Zoom"),
                    type: "slider-dev",
                    disabled:
                      Boolean(imagePopulation) ||
                      isSVGExtension(imageExtension) ||
                      isGIFExtension(imageExtension) ||
                      sizeType !== "custom" ||
                      isBigImageFromGallery,
                    config: {
                      min: 100,
                      max: 200,
                      inputMin: 100,
                      units: [{ value: "%", title: "%" }]
                    }
                  },
                  {
                    id: "linkLightBox",
                    label: t("Open in Lightbox"),
                    type: "switch-dev",
                    disabled:
                      inGallery ||
                      isSVGExtension(imageExtension) ||
                      isGIFExtension(imageExtension) ||
                      isBigImageFromGallery ||
                      isStory(config),
                    devices: "desktop"
                  }
                ]
              },
              {
                id: "tabMask",
                label: t("Mask"),
                position: 110,
                options: [
                  ...(inGallery && !isBigImageFromGallery
                    ? []
                    : [
                        {
                          id: "maskShape",
                          label: t("Shape"),
                          devices: "desktop",
                          type: "select-dev",
                          choices: MaskShapes
                        },
                        {
                          id: "maskCustomUpload",
                          type: "imageUpload-dev",
                          devices: "desktop",
                          label: t("Image"),
                          config: {
                            pointer: false,
                            disableSizes: true,
                            acceptedExtensions: ["png", "svg"]
                          },
                          helper: {
                            enabled: true,
                            content: t("Upload only [ .png or .svg ]")
                          },
                          disabled: maskShape !== "custom"
                        },
                        {
                          id: "groupSize",
                          type: "group-dev",
                          disabled: maskShapeIsDisabled,
                          options: [
                            {
                              id: "maskSize",
                              label: t("Size"),
                              type: "select-dev",
                              choices: MaskSizes
                            },
                            {
                              id: "maskScale",
                              type: "slider-dev",
                              disabled: maskSize !== "custom",
                              config: {
                                min: 1,
                                max: maskScaleSuffix === "px" ? 500 : 100,
                                units: [
                                  { value: "%", title: "%" },
                                  { value: "px", title: "px" }
                                ]
                              }
                            }
                          ]
                        },
                        {
                          id: "groupPosition",
                          type: "group-dev",
                          disabled: maskShapeIsDisabled,
                          options: [
                            {
                              id: "maskPosition",
                              type: "select-dev",
                              label: t("Position"),
                              choices: MaskPositions
                            },
                            {
                              id: "maskPositionx",
                              label: t("X"),
                              type: "slider-dev",
                              disabled: maskPosition !== "custom",
                              config: {
                                min: 1,
                                max: 100,
                                units: [{ value: "%", title: "%" }]
                              }
                            },
                            {
                              id: "maskPositiony",
                              label: t("Y"),
                              type: "slider-dev",
                              disabled: maskPosition !== "custom",
                              config: {
                                min: 1,
                                max: 100,
                                units: [{ value: "%", title: "%" }]
                              }
                            }
                          ]
                        },
                        {
                          id: "maskRepeat",
                          label: t("Repeat"),
                          type: "select-dev",
                          disabled: maskShapeIsDisabled || maskSize === "cover",
                          choices: MaskRepeat
                        }
                      ])
                ]
              },
              {
                id: "tabTags",
                label: t("Tags"),
                options: [
                  toolbarImageTags({
                    devices: "desktop",
                    gallery,
                    enableTags: _enableTags
                  })
                ]
              }
            ]
          }
        ]
      },
      {
        id: "toolbarColor",
        type: "popover-dev",
        devices: "desktop",
        config: {
          size: "auto",
          title: t("Colors"),
          icon: {
            style: {
              backgroundColor: hexToRgba(borderColorHex, borderColorOpacity)
            }
          }
        },
        roles: ["admin"],
        position: 80,
        options: [
          {
            id: "tabsColor",
            type: "tabs-dev",
            tabs: [
              {
                id: "tabOverlay",
                label: t("Overlay"),
                options: [
                  {
                    id: "",
                    type: "backgroundColor-dev",
                    states: [NORMAL, HOVER]
                  }
                ]
              },
              {
                id: "tabBorder",
                label: t("Border"),
                options: [
                  {
                    id: "border",
                    type: "border-dev",
                    states: [NORMAL, HOVER]
                  }
                ]
              },
              {
                id: "tabBoxShadow",
                label: t("Shadow"),
                options: [
                  {
                    id: "boxShadow",
                    type: "boxShadow-dev",
                    states: [NORMAL, HOVER],
                    disabled: !maskShapeIsDisabled
                  }
                ]
              },
              {
                id: "tabDropShadow",
                label: t("Shadow"),
                options: [
                  {
                    id: "maskShadow",
                    type: "textShadow-dev",
                    states: [NORMAL, HOVER],
                    disabled: maskShapeIsDisabled
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
          size: "medium",
          title: t("Link")
        },
        position: 90,
        disabled: (inGallery && dvv("linkLightBox") === "on") || withBigImage,
        options: [
          {
            id: "linkType",
            type: "tabs-dev",
            config: {
              saveTab: true,
              showSingle: true
            },
            tabs: [
              {
                id: "page",
                label: t("Page"),
                options: [
                  {
                    id: "linkSource",
                    type: "select-dev",
                    disabled: !collectionTypesHandler,
                    label: t("Type"),
                    devices: "desktop",
                    choices: {
                      load: () => getCollectionTypes(config),
                      emptyLoad: {
                        title: t("There are no choices")
                      }
                    },
                    config: {
                      size: "large"
                    }
                  },
                  {
                    id: "linkPage",
                    type: "internalLink-dev",
                    label: t("Find Page"),
                    devices: "desktop",
                    disabled: !linkSource,
                    config: {
                      postType: linkSource
                    }
                  }
                ]
              },
              {
                id: "external",
                label: t("URL"),
                options: [
                  toolbarImageLinkExternal({
                    v,
                    inGallery,
                    config: context.dynamicContent.config,
                    devices: "desktop"
                  }),
                  {
                    id: "linkExternalBlank",
                    label: t("Open In New Tab"),
                    type: "switch-dev",
                    devices: "desktop"
                  },
                  {
                    id: "linkExternalRel",
                    label: t("Make it Nofollow"),
                    type: "switch-dev",
                    devices: "desktop"
                  }
                ]
              },
              {
                id: "anchor",
                label: t("Block"),
                options: [
                  toolbarLinkAnchor({
                    v,
                    devices: "desktop",
                    disabled: isStory(config)
                  })
                ]
              },
              {
                id: "popup",
                label: t("Popup"),
                options: [
                  {
                    id: "linkPopup",
                    type: "promptAddPopup",
                    disabled:
                      isStory(config) ||
                      (device === "desktop"
                        ? inPopup || inPopup2 || isPopup(config)
                        : dvv("linkType") !== "popup" || linkPopup === ""),
                    label: t("Popup"),
                    canDelete: device === "desktop",
                    popupKey: `${component.getId()}_${linkPopup}`,
                    value: {
                      value: linkPopup,
                      popups: dvv("popups")
                    },
                    onChange: ({ value, popups }) => ({
                      linkPopup: value,
                      popups
                    })
                  }
                ]
              },
              {
                id: "story",
                label: t("Slides"),
                options: [toolbarStoryAnchor({ disabled: !isStory(config) })]
              }
            ]
          }
        ]
      },
      {
        id: "toolbarSettings",
        type: "popover-dev",
        config: {
          icon: "nc-cog",
          title: t("Settings")
        },
        roles: ["admin"],
        position: 110,
        disabled: (inGallery && !isBigImageFromGallery) || isStory(config),
        options: [
          {
            id: "width",
            label: isSvgOrGif ? t("Size") : t("Width"),
            type: "slider-dev",
            disabled: !isCustomSizeType && !isSvgOrGif,
            config: {
              min: 5,
              max: widthSuffixValue === "px" ? cW : 100,
              units: [
                { value: "px", title: "px" },
                { value: "%", title: "%" }
              ],
              inputMax: isSvgOrGif ? 100 : undefined
            }
          },
          {
            id: "height",
            label: t("Height"),
            type: "slider-dev",
            disabled: !isCustomSizeType || isSvgOrGif,
            config: {
              min: 5,
              max: heightSuffixValue === "px" ? Math.round(cW * 2) : 100,
              units: imagePopulation
                ? [{ value: "px", title: "px" }]
                : [
                    { value: "px", title: "px" },
                    { value: "%", title: "%" }
                  ]
            }
          },
          {
            id: "size",
            label: t("Size"),
            type: "slider-dev",
            disabled: isCustomSizeType || isSvgOrGif,
            config: {
              min: 5,
              max: 100,
              units: [{ value: "%", title: "%" }]
            }
          },
          {
            id: "grid",
            type: "grid",
            separator: true,
            columns: [
              {
                id: "grid-settings",
                width: 50,
                options: [
                  {
                    id: "styles",
                    type: "sidebarTabsButton-dev",
                    config: {
                      tabId: "styles",
                      text: t("Styling"),
                      icon: "nc-cog"
                    }
                  }
                ]
              },
              {
                id: "grid-effects",
                width: 50,
                options: [
                  {
                    id: "effects",
                    type: "sidebarTabsButton-dev",
                    config: {
                      tabId: "effects",
                      text: t("Effects"),
                      icon: "nc-flash"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "advancedSettings",
        type: "advancedSettings",
        icon: "nc-cog",
        disabled: !isStory(config),
        position: 110
      }
    ];
  };
