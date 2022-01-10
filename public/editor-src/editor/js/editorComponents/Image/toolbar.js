import {
  getOptionColorHexByPalette,
  getDynamicContentChoices
} from "visual/utils/options";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

import {
  toolbarImageTags,
  toolbarLinkAnchor,
  toolbarImageLinkExternal
} from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

import { isSVG, isGIF } from "./utils";
import { IS_GLOBAL_POPUP, IS_STORY } from "visual/utils/models";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { placeholderObjFromStr } from "visual/editorComponents/EditorComponent/DynamicContent/utils";

export const getMaxHeight = (cW, v) => {
  const { imageWidth: iW, imageHeight: iH } = v;
  const originalContainerWidth = iH / (iW / cW);
  const maxHeight = ((cW * 2) / originalContainerWidth) * 100;

  return maxHeight >= 100 ? Math.round(maxHeight) : 100;
};

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

export const getItems = ({ property }) => ({
  v,
  device,
  component,
  context
}) => {
  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);
  const { cW, gallery } = property[device];

  const { inGallery = false, enableTags } = gallery || {};
  const dvv = key => defaultValueValue({ v, key, device });
  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );

  const widthSuffixValue = dvv("widthSuffix");
  const heightSuffixValue = dvv("heightSuffix");
  const sizeType = dvv("sizeType");

  const imageDynamicContentChoices = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.image
  );

  const placeholderData = placeholderObjFromStr(v.imagePopulation);
  const isCustomSizeType =
    (sizeType === "custom" && !placeholderData) ||
    placeholderData?.attr?.size === undefined;
  const isSvgOrGif =
    (isSVG(v.imageExtension) || isGIF(v.imageExtension)) && !placeholderData;

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
                  label: t("Image"),
                  type: "population-dev",
                  disabled:
                    (isSVG(v.imageExtension) ||
                      isGIF(v.imageExtension) ||
                      v.imagePopulation) &&
                    device !== "desktop",
                  config: {
                    choices:
                      device === "desktop" &&
                      !gallery.inGallery &&
                      imageDynamicContentChoices.length
                        ? imageDynamicContentChoices
                        : undefined
                  },
                  options: [
                    {
                      id: "",
                      type: "imageUpload-dev",
                      config: {
                        edit: device === "desktop"
                      }
                    }
                  ]
                },
                {
                  id: "zoom",
                  label: t("Zoom"),
                  type: "slider-dev",
                  disabled:
                    Boolean(v.imagePopulation) ||
                    isSVG(v.imageExtension) ||
                    isGIF(v.imageExtension) ||
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
                    isSVG(v.imageExtension) ||
                    isGIF(v.imageExtension) ||
                    IS_STORY,
                  devices: "desktop"
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
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(borderColorHex, v.borderColorOpacity)
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
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  devices: "desktop",
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
                  devices: "desktop",
                  type: "boxShadow-dev",
                  states: [NORMAL, HOVER]
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
      disabled: inGallery && v.linkLightBox === "on",
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
                toolbarLinkAnchor({ v, devices: "desktop", disabled: IS_STORY })
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
                    IS_STORY ||
                    (device === "desktop"
                      ? inPopup || inPopup2 || IS_GLOBAL_POPUP
                      : v.linkType !== "popup" || v.linkPopup === ""),
                  label: t("Popup"),
                  canDelete: device === "desktop",
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
        icon: "nc-cog",
        title: t("Settings")
      },
      roles: ["admin"],
      position: 110,
      disabled: inGallery || IS_STORY,
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
              ...(isSvgOrGif ? [] : [{ value: "px", title: "px" }]),
              { value: "%", title: "%" }
            ]
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
            units: v.imagePopulation
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
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      icon: "nc-cog",
      disabled: !IS_STORY,
      position: 110
    }
  ];
};
