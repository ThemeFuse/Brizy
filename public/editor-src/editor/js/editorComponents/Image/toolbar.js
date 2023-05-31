import {
  keyToDCFallback2Key,
  placeholderObjFromStr
} from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isPopup, isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  toolbarImageLinkExternal,
  toolbarImageTags,
  toolbarLinkAnchor,
  toolbarStoryAnchor
} from "visual/utils/toolbar";
import { isGIF, isSVG } from "./utils";

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
    const useCustomPlaceholder =
      config.dynamicContent?.useCustomPlaceholder ?? false;
    const { cW, gallery } = property[device];

    const { inGallery = false, enableTags } = gallery || {};
    const dvv = (key) => defaultValueValue({ v, key, device });
    const { hex: borderColorHex } = getOptionColorHexByPalette(
      dvv("borderColorHex"),
      dvv("borderColorPalette")
    );

    const borderColorOpacity = dvv("borderColorOpacity");

    const maskShape = dvv("maskShape");
    const maskPosition = dvv("maskPosition");
    const maskSize = dvv("maskSize");
    const maskScaleSuffix = dvv("maskScaleSuffix");
    const maskCustomUploadImageSrc = dvv("maskCustomUploadImageSrc");
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

    const placeholderData = placeholderObjFromStr(
      imagePopulation,
      useCustomPlaceholder
    );
    const isCustomSizeType =
      (sizeType === "custom" && !placeholderData) ||
      !!(
        placeholderData &&
        (placeholderData.attr === undefined ||
          placeholderData.attr?.size === undefined)
      );
    const isSvgOrGif =
      (isSVG(imageExtension) || isGIF(imageExtension)) && !placeholderData;

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
                      (isSVG(imageExtension) ||
                        isGIF(imageExtension) ||
                        imagePopulation) &&
                      device !== "desktop",
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
                      isSVG(imageExtension) ||
                      isGIF(imageExtension) ||
                      sizeType !== "custom",
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
                      isSVG(imageExtension) ||
                      isGIF(imageExtension) ||
                      isStory(Config.getAll()),
                    devices: "desktop"
                  }
                ]
              },
              {
                id: "tabMask",
                label: t("Mask"),
                position: 110,
                options: [
                  {
                    id: "maskShape",
                    label: t("Shape"),
                    devices: "desktop",
                    type: "select-dev",
                    choices: [
                      { title: t("None"), value: "none" },
                      {
                        value: "circle",
                        icon: { name: "nc-mask-shape-circle" }
                      },
                      {
                        value: "rhombus",
                        icon: { name: "nc-mask-shape-rhombus" }
                      },
                      { value: "star", icon: { name: "nc-mask-shape-star" } },
                      {
                        value: "flower",
                        icon: { name: "nc-mask-shape-flower" }
                      },
                      {
                        value: "square",
                        icon: { name: "nc-mask-shape-square" }
                      },
                      {
                        value: "triangle",
                        icon: { name: "nc-mask-shape-triangle" }
                      },
                      { value: "blob1", icon: { name: "nc-mask-shape-blob1" } },
                      { value: "blob2", icon: { name: "nc-mask-shape-blob2" } },
                      { value: "blob3", icon: { name: "nc-mask-shape-blob3" } },
                      { value: "blob4", icon: { name: "nc-mask-shape-blob4" } },
                      {
                        value: "brush1",
                        icon: { name: "nc-mask-shape-brush1" }
                      },
                      {
                        value: "brush2",
                        icon: { name: "nc-mask-shape-brush2" }
                      },
                      {
                        value: "brush3",
                        icon: { name: "nc-mask-shape-brush3" }
                      },
                      {
                        value: "brush4",
                        icon: { name: "nc-mask-shape-brush4" }
                      },
                      { value: "poly1", icon: { name: "nc-mask-shape-poly1" } },
                      { value: "poly2", icon: { name: "nc-mask-shape-poly2" } },
                      { value: "poly3", icon: { name: "nc-mask-shape-poly3" } },
                      { value: "poly4", icon: { name: "nc-mask-shape-poly4" } },
                      { value: "custom", title: "Custom" }
                    ]
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
                        choices: [
                          { title: t("Fit"), value: "contain" },
                          { title: t("Fill"), value: "cover" },
                          { title: t("Custom"), value: "custom" }
                        ]
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
                        choices: [
                          { title: t("Center Center"), value: "center center" },
                          { title: t("Center Left"), value: "center left" },
                          { title: t("Center Right"), value: "center right" },
                          { title: t("Top Center"), value: "top center" },
                          { title: t("Top Right"), value: "top right" },
                          { title: t("Top Left"), value: "top left" },
                          { title: t("Bottom Center"), value: "bottom center" },
                          { title: t("Bottom Left"), value: "bottom left" },
                          { title: t("Bottom Right"), value: "bottom right" },
                          { title: t("Custom"), value: "custom" }
                        ]
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
                    choices: [
                      { title: t("No Repeat"), value: "no-repeat" },
                      { title: t("Repeat"), value: "repeat" },
                      { title: t("Repeat-X"), value: "repeat-x" },
                      { title: t("Repeat-Y"), value: "repeat-y" },
                      { title: t("Space"), value: "space" },
                      { title: t("Round"), value: "round" }
                    ]
                  }
                ]
              },
              {
                id: "tabTags",
                label: t("Tags"),
                options: [
                  toolbarImageTags({ devices: "desktop", gallery, enableTags })
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
        disabled: inGallery && dvv("linkLightBox") === "on",
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
                    disabled: isStory(Config.getAll())
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
                      isStory(Config.getAll()) ||
                      (device === "desktop"
                        ? inPopup || inPopup2 || isPopup(Config.getAll())
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
                  toolbarStoryAnchor({ disabled: !isStory(Config.getAll()) })
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
          icon: "nc-cog",
          title: t("Settings")
        },
        roles: ["admin"],
        position: 110,
        disabled: inGallery || isStory(Config.getAll()),
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
        disabled: !isStory(Config.getAll()),
        position: 110
      }
    ];
  };
