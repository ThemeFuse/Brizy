import { keyToDCFallback2Key } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
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
import { toolbarImageTags, toolbarLinkAnchor } from "visual/utils/toolbar";
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
      layout,
      enableTags
    } = gallery || {};
    const dvv = (key) => defaultValueValue({ v, key, device });

    const linkDC = getDynamicContentOption({
      options: context.dynamicContent.config,
      type: DCTypes.link
    });
    const { hex: borderColorHex } = getOptionColorHexByPalette(
      dvv("borderColorHex"),
      dvv("borderColorPalette")
    );

    const _enableTags = enableTags && !isBigImageFromGallery;

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
        type: "popover",
        config: {
          icon: "nc-img",
          title: t("Image")
        },
        position: 80,
        options: [
          {
            id: "media",
            type: "tabs",
            tabs: [
              {
                id: "tabImage",
                label: t("Image"),
                options: [
                  // Use population option type instead of using the `legacy-population` config for imageUpload,
                  // because the population id and imageUpload id are different.
                  {
                    id: "image",
                    type: "population",
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
                      type: "imageUpload"
                    },
                    option: {
                      id: "",
                      type: "imageUpload",
                      config: {
                        edit: device === "desktop",
                        disableSizes: inGallery && layout === "justified"
                      }
                    }
                  },
                  {
                    id: "zoom",
                    label: t("Zoom"),
                    type: "slider",
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
                    type: "switch",
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
                          type: "select",
                          choices: MaskShapes
                        },
                        {
                          id: "maskCustomUpload",
                          type: "imageUpload",
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
                          type: "group",
                          disabled: maskShapeIsDisabled,
                          options: [
                            {
                              id: "maskSize",
                              label: t("Size"),
                              type: "select",
                              choices: MaskSizes
                            },
                            {
                              id: "maskScale",
                              type: "slider",
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
                          type: "group",
                          disabled: maskShapeIsDisabled,
                          options: [
                            {
                              id: "maskPosition",
                              type: "select",
                              label: t("Position"),
                              choices: MaskPositions
                            },
                            {
                              id: "maskPositionx",
                              label: t("X"),
                              type: "slider",
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
                              type: "slider",
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
                          type: "select",
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
        type: "popover",
        devices: "desktop",
        config: {
          size: "medium",
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
            type: "tabs",
            tabs: [
              {
                id: "tabOverlay",
                label: t("Overlay"),
                options: [
                  {
                    id: "",
                    type: "backgroundColor",
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
                    type: "border",
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
                    type: "boxShadow",
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
                    type: "textShadow",
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
        type: "popover",
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
            type: "tabs",
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
                    id: "linkPage",
                    type: "internalLink",
                    label: t("Find Page"),
                    devices: "desktop"
                  }
                ]
              },
              {
                id: "external",
                label: t("URL"),
                options: [
                  {
                    id: "link",
                    type: "population",
                    label: t("Link to"),
                    config: linkDC,
                    option: {
                      id: "linkExternal",
                      type: "inputText",
                      placeholder: "http://",
                      disabled: inGallery,
                      devices: "desktop",
                      config: {
                        size: "medium"
                      }
                    }
                  },
                  {
                    id: "linkExternalBlank",
                    label: t("Open In New Tab"),
                    type: "switch",
                    devices: "desktop"
                  },
                  {
                    id: "linkExternalRel",
                    label: t("Make it Nofollow"),
                    type: "switch",
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
                    type: "legacy-promptAddPopup",
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
                options: [
                  {
                    id: "linkToSlide",
                    type: "number",
                    label: t("Slide"),
                    disabled: !isStory(config),
                    config: {
                      min: 1,
                      max: 1000000
                    }
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
            type: "slider",
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
            type: "slider",
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
            type: "slider",
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
            config: {
              separator: true
            },
            columns: [
              {
                id: "grid-settings",
                size: 1,
                options: [
                  {
                    id: "styles",
                    type: "sidebarTabsButton",
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
                size: 1,
                options: [
                  {
                    id: "effects",
                    type: "sidebarTabsButton",
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
        type: "legacy-advancedSettings",
        icon: "nc-cog",
        disabled: !isStory(config),
        position: 110
      }
    ];
  };
