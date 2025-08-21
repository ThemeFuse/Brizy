import { keyToDCFallback2Key } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import {
  getEnabledLinkOptions,
  isImagePointerEnabled,
  isImageZoomEnabled
} from "visual/global/Config/types/configs/featuresValue";
import { isPopup, isStory } from "visual/providers/EditorModeProvider";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { ImageType } from "visual/utils/image/types";
import { isGIFExtension, isSVGExtension } from "visual/utils/image/utils";
import {
  getMaskPositions,
  getMaskRepeat,
  getMaskShapes,
  getMaskSizes
} from "visual/utils/mask/Mask";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { popupToOldModel } from "visual/utils/options/PromptAddPopup/utils";
import { read as readString } from "visual/utils/reader/string";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { toolbarLinkAnchor } from "visual/utils/toolbar";
import { SizeType } from "../../global/Config/types/configs/common";
import { Device, GalleryRenderer, Props, V as Value } from "./types";
import { getImageDCSize } from "./utils";

interface Data {
  desktopContainerWidth: number;
  tabletContainerWidth: number;
  mobileContainerWidth: number;
  gallery: GalleryRenderer;
}

type Property = Record<Device, { cW: number; gallery: GalleryRenderer }>;

export default ({
  desktopContainerWidth,
  tabletContainerWidth,
  mobileContainerWidth,
  gallery
}: Data) => ({
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
  ({ property }: { property: Property }): GetItems<Value, Props> =>
  ({ v, device, component, context, editorMode, state }) => {
    const config = component.getGlobalConfig();
    const _isStory = isStory(editorMode);

    const inPopup = Boolean(component.props.meta.sectionPopup);
    const inPopup2 = Boolean(component.props.meta.sectionPopup2);
    const inPosts = Boolean(component.props.meta.posts);

    const { cW, gallery } = property[device];

    const isBigImageFromGallery = Boolean(v?.clonedFromGallery);

    const isZoomEnabled = isImageZoomEnabled(config);
    const isPointerEnabled = isImagePointerEnabled(config);

    const {
      inGallery = false,
      withBigImage = false,
      layout,
      enableTags
    } = gallery || {};
    const dvv = (key: string) => defaultValueValue({ v, key, device });

    const linkDC = getDynamicContentOption({
      options: context.dynamicContent.config,
      type: DCTypes.link
    });
    const borderColorOpacity = dvv("borderColorOpacity");
    const borderColor = getColorToolbar(
      dvv("borderColorPalette"),
      dvv("borderColorHex"),
      borderColorOpacity
    );

    const _enableTags = enableTags && !isBigImageFromGallery;

    const maskShape = readString(dvv("maskShape")) ?? "none";
    const maskPosition = readString(dvv("maskPosition")) ?? "center center";
    const maskSize = readString(dvv("maskSize")) ?? "cover";
    const maskScaleSuffix = readString(dvv("maskScaleSuffix")) ?? "%";
    const maskCustomUploadImageSrc = readString(
      dvv("maskCustomUploadImageSrc")
    );
    const maskShapeIsDisabled =
      maskShape === "none" ||
      (maskShape === SizeType.custom && !maskCustomUploadImageSrc);

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
    const isExternalImage = dvv("imageType") !== ImageType.Internal;

    const dcSize = getImageDCSize(imagePopulation, context);
    const isCustomSizeType = sizeType === SizeType.custom;
    const isSvgOrGif =
      (isSVGExtension(imageExtension) || isGIFExtension(imageExtension)) &&
      !dcSize;

    const zoomDisabled =
      Boolean(imagePopulation) ||
      isSVGExtension(imageExtension) ||
      isGIFExtension(imageExtension) ||
      sizeType !== SizeType.custom ||
      isBigImageFromGallery ||
      isExternalImage ||
      !isZoomEnabled;

    const {
      internalLink,
      linkPopup: linkPopupEnabled,
      linkAnchor,
      linkExternal
    } = getEnabledLinkOptions(config);

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
                    states: inPosts ? [NORMAL] : [NORMAL, HOVER],
                    disabled:
                      ((isSVGExtension(imageExtension) ||
                        isGIFExtension(imageExtension) ||
                        isExternalImage ||
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
                      type: "imageUpload",
                      config: {
                        pointer: isPointerEnabled,
                        edit: device === "desktop"
                      }
                    },
                    option: {
                      id: "",
                      type: "imageUpload",
                      config: {
                        edit: device === "desktop",
                        disableSizes:
                          (inGallery && layout === "justified") ||
                          isExternalImage ||
                          state === "hover",
                        pointer: !isExternalImage && isPointerEnabled
                      }
                    }
                  },
                  {
                    id: "zoom",
                    label: t("Zoom"),
                    type: "slider",
                    disabled: zoomDisabled,
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
                      _isStory ||
                      isExternalImage,
                    devices: "desktop"
                  }
                ]
              },
              {
                id: "tabMask",
                label: t("Mask"),
                position: 110,
                options:
                  inGallery && !isBigImageFromGallery
                    ? []
                    : [
                        {
                          id: "maskShape",
                          label: t("Shape"),
                          devices: "desktop",
                          type: "select",
                          choices: getMaskShapes()
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
                          disabled: maskShape !== SizeType.custom
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
                              choices: getMaskSizes()
                            },
                            {
                              id: "maskScale",
                              type: "slider",
                              disabled: maskSize !== SizeType.custom,
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
                              choices: getMaskPositions()
                            },
                            {
                              id: "maskPositionx",
                              label: t("X"),
                              type: "slider",
                              disabled: maskPosition !== SizeType.custom,
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
                              disabled: maskPosition !== SizeType.custom,
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
                          choices: getMaskRepeat()
                        }
                      ]
              },
              {
                id: "tabTags",
                label: t("Tags"),
                options: [
                  {
                    label: t("Tags"),
                    id: "tags",
                    type: "inputText",
                    helper: {
                      enabled: true,
                      content: t(
                        "Enter the tags, separated by a comma (art, sport, nature, etc)."
                      ),
                      position: "top-end"
                    },
                    placeholder: t("art, nature, etc."),
                    devices: "desktop",
                    disabled: !inGallery || !_enableTags
                  }
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
              backgroundColor: borderColor
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
        devices: "desktop",
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
                disabled: !internalLink,
                options: [
                  {
                    id: "linkPage",
                    type: "internalLink",
                    label: t("Find Page")
                  },
                  {
                    id: "linkInternalBlank",
                    label: t("Open In New Tab"),
                    type: "switch"
                  }
                ]
              },
              {
                id: "external",
                label: t("URL"),
                disabled: !linkExternal,
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
                      disabled: inGallery
                    }
                  },
                  {
                    id: "linkExternalBlank",
                    label: t("Open In New Tab"),
                    type: "switch"
                  },
                  {
                    id: "linkExternalRel",
                    label: t("Make it Nofollow"),
                    type: "switch"
                  }
                ]
              },
              {
                id: "anchor",
                label: t("Block"),
                disabled: !linkAnchor,
                options: [
                  toolbarLinkAnchor({
                    v,
                    disabled: _isStory,
                    device,
                    state
                  })
                ]
              },
              {
                id: "popup",
                label: t("Popup"),
                disabled: !linkPopupEnabled,
                options: [
                  {
                    id: "linkPopup",
                    type: "promptAddPopup",
                    disabled:
                      _isStory ||
                      (device === "desktop"
                        ? inPopup || inPopup2 || isPopup(editorMode)
                        : dvv("linkType") !== "popup" || linkPopup === ""),
                    label: t("Popup"),
                    config: {
                      canDelete: device === "desktop",
                      popupKey: `${component.getId()}_${linkPopup}`
                    },
                    dependencies: popupToOldModel
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
                    disabled: !_isStory,
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
        disabled: (inGallery && !isBigImageFromGallery) || _isStory,
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
        type: "advancedSettings",
        disabled: !_isStory,
        position: 110
      }
    ];
  };
