import { isStory } from "visual/providers/EditorModeProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { v, contexts } = data;

  const { maskShape = "none" } = v;

  const _isStory = isStory(contexts.mode);

  const styles: Styles = {
    ".brz && .brz-eventFeatured": {
      standart: ["cssStylePaddingBG", "cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-eventFeatured": {
      standart: [
        "cssStylementOfMinistryBrandsParentBgColor",
        "cssStylementOfMinistryBrandsParentBgGradient",
        "cssStylementOfMinistryBrandsParentBorder",
        "cssStylementOfMinistryBrandsParentBoxShadow"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__item--media": {
      standart: [
        "cssStyleElementOfMinistryBrandsImageWidth",
        "cssStyleElementOfMinistryBrandsImagePadding",
        "cssStyleMinistryElementMediaBorderRadius"
      ]
    },
    ".brz && .brz-ministryBrands__item--media:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsImgBorder",
        ...(maskShape === "none"
          ? ["cssStyleElementOfMinistryBrandsImgBoxShadow"]
          : ["cssStyleElementOfMinistryBrandsImgMaskShadow"])
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__item--media::after": {
      standart: [
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ]
    },
    ".brz && .brz-ministryBrands__item--media:hover::after": {
      standart: [
        "cssStyleElementOfMinistryBrandsImgBgColor",
        "cssStyleElementOfMinistryBrandsImgBgGradient"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__item--media :is(img, video, iframe)": {
      standart: [
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ]
    },
    ".brz && .brz-ministryBrands__item--media:hover :is(img, video, iframe)": {
      standart: ["cssStyleElementOfMinistryBrandsImgFilters"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventFeatured__item": {
      standart: [
        "cssStyleElementOfMinistryBrandsHorizontalAlign",
        "cssStyleElementOfMinistryBrandsSpacing"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-title": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemTitleMargin",
        "cssStyleElementMinistryBrandsMetaItemTitlePadding"
      ]
    },

    ".brz && .brz-ministryBrands__item--meta-date": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemDateMargin",
        "cssStyleElementMinistryBrandsMetaItemDatePadding"
      ]
    },

    ".brz && .brz-ministryBrands__item--meta-category": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemCategoryMargin",
        "cssStyleElementMinistryBrandsMetaItemCategoryPadding"
      ]
    },

    ".brz && .brz-ministryBrands__item--meta-group": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemGroupMargin",
        "cssStyleElementMinistryBrandsMetaItemGroupPadding"
      ]
    },

    ".brz && .brz-ministryBrands__item--meta-location": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemLocationMargin",
        "cssStyleElementMinistryBrandsMetaItemLocationPadding"
      ]
    },

    ".brz && .brz-ministryBrands__item--meta-address": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemAddressMargin",
        "cssStyleElementMinistryBrandsMetaItemAddressPadding"
      ]
    },

    ".brz && .brz-ministryBrands__item--meta-room": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemRoomMargin",
        "cssStyleElementMinistryBrandsMetaItemRoomPadding"
      ]
    },

    ".brz && .brz-ministryBrands__item--meta-coordinator": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemCoordinatorMargin",
        "cssStyleElementMinistryBrandsMetaItemCoordinatorPadding"
      ]
    },

    ".brz && .brz-ministryBrands__item--meta-coordinatorEmail": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemCoordinatorEmailMargin",
        "cssStyleElementMinistryBrandsMetaItemCoordinatorEmailPadding"
      ]
    },

    ".brz && .brz-ministryBrands__item--meta-coordinatorPhone": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemCoordinatorPhoneMargin",
        "cssStyleElementMinistryBrandsMetaItemCoordinatorPhonePadding"
      ]
    },

    ".brz && .brz-ministryBrands__item--meta-cost": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemCostMargin",
        "cssStyleElementMinistryBrandsMetaItemCostPadding"
      ]
    },

    ".brz && .brz-ministryBrands__item--meta-website": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemWebsiteMargin",
        "cssStyleElementMinistryBrandsMetaItemWebsitePadding"
      ]
    },

    ".brz && .brz-ministryBrands__meta--icons": {
      standart: ["cssStyleElementOfMinistryBrandsMetaIconsSpacing"]
    },
    ".brz && .brz-eventFeatured__item--meta--link > .brz-ministryBrands__meta--icons:hover":
      {
        standart: ["cssStyleColor"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventFeatured__item--meta:hover": {
      standart: ["cssStyleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && :is(.brz-eventFeatured__item--meta, .brz-eventFeatured__item--meta--link)":
      {
        standart: ["getAllCssStyleTypography"]
      },
    ".brz && .brz-eventFeatured__item--meta--title": {
      standart: ["cssStyleElementOfMinistryBrandsTitleTypography"]
    },
    ".brz && .brz-eventFeatured__item--meta--title:hover": {
      standart: ["cssStyleElementOfMinistryBrandsTitleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-eventFeatured__item--meta--date": {
      standart: ["cssStyleElementOfMinistryBrandsDateTypography"]
    },
    ".brz && .brz-eventFeatured__item--meta--date:hover": {
      standart: ["cssStyleElementOfMinistryBrandsDateColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && :is(.brz-eventFeatured__item--meta--preview, .brz-eventFeatured__item--meta--preview *)":
      {
        standart: ["cssStyleElementOfMinistryBrandsPreviewTypography"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && :is(.brz-eventFeatured__item--meta--preview, .brz-eventFeatured__item--meta--preview *:not(a)):hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsPreviewColor"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && :is(.brz-eventFeatured__item--meta--link,.brz-eventFeatured__item--meta--preview) a:hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-ministryBrands__item--meta--button": {
      standart: [
        "cssStyleElementMinistryBrandsButtonsTypography",
        "cssStyleElementMinistryBrandsButtonsBorderRadius"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta--button:hover": {
      standart: [
        "cssStyleElementMinistryBrandsButtonsBgColor",
        "cssStyleElementMinistryBrandsButtonsBgGradient",
        "cssStyleElementMinistryBrandsButtonsBoxShadow",
        "cssStyleElementMinistryBrandsButtonsBorder",
        "cssStyleElementMinistryBrandsButtonsColor"
      ],
      interval: ["cssStyleMinistryBrandsButtonsHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--meta--button a": {
      standart: [
        ...(_isStory
          ? ["cssStyleElementButtonSizeForStory"]
          : ["cssStyleElementMinistryBrandsButtonsSize"])
      ]
    },
    ".brz && .brz-ministryBrands__item--meta--register-button": {
      standart: [
        "cssStyleElementMinistryBrandsRegisterButtonTypography",
        "cssStyleElementMinistryBrandsButtonsBorderRadius"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta--register-button:hover": {
      standart: [
        "cssStyleElementMinistryBrandsRegisterButtonBgColor",
        "cssStyleElementMinistryBrandsRegisterButtonBgGradient",
        "cssStyleElementMinistryBrandsRegisterButtonBoxShadow",
        "cssStyleElementMinistryBrandsRegisterButtonBorder",
        "cssStyleElementMinistryBrandsRegisterButtonColor"
      ],
      interval: ["cssStyleMinistryBrandsButtonsHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--meta--register-button a": {
      standart: [
        ...(_isStory
          ? ["cssStyleElementButtonSizeForStory"]
          : ["cssStyleElementMinistryBrandsRegisterButtonSize"])
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
