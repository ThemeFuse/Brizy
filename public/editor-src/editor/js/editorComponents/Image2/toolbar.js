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
  toolbarImageLinkExternal,
  toolbarImageSetter
} from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

import { isSVG, isGIF } from "./utils";
import { IS_GLOBAL_POPUP, IS_STORY } from "visual/utils/models";

export const getMaxHeight = (cW, v) => {
  const { imageWidth: iW, imageHeight: iH } = v;
  const originalContainerWidth = iH / (iW / cW);
  const maxHeight = ((cW * 2) / originalContainerWidth) * 100;

  return maxHeight >= 100 ? Math.round(maxHeight) : 100;
};

const imageDynamicContentChoices = getDynamicContentChoices("image");

export default ({
  desktopWrapperSizes,
  desktopContainerWidth,
  tabletWrapperSizes,
  tabletContainerWidth,
  mobileWrapperSizes,
  mobileContainerWidth,
  gallery
}) => ({
  getItems: getItems({
    property: {
      desktop: {
        wrapperSizes: desktopWrapperSizes,
        cW: desktopContainerWidth,
        gallery
      },
      tablet: {
        wrapperSizes: tabletWrapperSizes,
        cW: tabletContainerWidth,
        gallery
      },
      mobile: {
        wrapperSizes: mobileWrapperSizes,
        cW: mobileContainerWidth,
        gallery
      }
    }
  })
});

export const getItems = ({ property }) => ({ v, device, state, component }) => {
  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);
  const { wrapperSizes, cW, gallery } = property[device];

  const { inGallery = false, enableTags } = gallery || {};

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device }),
    defaultValueValue({ v, key: "borderColorPalette", device })
  );

  const widthSuffixValue = defaultValueValue({ v, key: "widthSuffix", device });
  const heightSuffixValue = defaultValueValue({
    v,
    key: "heightSuffix",
    device
  });

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
                toolbarImageSetter({
                  v,
                  cW,
                  device,
                  state,
                  wrapperSizes,
                  disabled:
                    (isSVG(v.imageExtension) ||
                      isGIF(v.imageExtension) ||
                      v.imagePopulation) &&
                    device !== "desktop",
                  onlyPointer: device !== "desktop",
                  showPointer: !(
                    isSVG(v.imageExtension) || isGIF(v.imageExtension)
                  ),
                  dynamicContent: imageDynamicContentChoices,
                  gallery
                }),
                {
                  id: "zoom",
                  label: t("Zoom"),
                  type: "slider-dev",
                  disabled:
                    Boolean(v.imagePopulation) ||
                    isSVG(v.imageExtension) ||
                    isGIF(v.imageExtension),
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
                  devices: "desktop",
                  inGallery
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
          label: t("Width"),
          type: "slider-dev",
          disabled: isSVG(v.imageExtension) || isGIF(v.imageExtension),
          config: {
            min: 5,
            max: widthSuffixValue === "px" ? cW : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider-dev",
          disabled: isSVG(v.imageExtension) || isGIF(v.imageExtension),
          config: {
            min: 5,
            max: heightSuffixValue === "px" ? Math.round(cW * 2) : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
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
