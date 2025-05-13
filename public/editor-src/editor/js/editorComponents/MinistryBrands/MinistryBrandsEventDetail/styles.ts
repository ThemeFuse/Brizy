import { isStory } from "visual/providers/EditorModeProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { v } = data;

  const { maskShape = "none" } = v;

  const _isStory = isStory(data.contexts.mode);

  const styles: Styles = {
    ".brz && .brz-eventDetail": {
      standart: ["cssStylePaddingBG", "cssStyleBorderRadius"]
    },
    ".brz && .brz-eventDetail:hover": {
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
    ".brz && .brz-eventDetail__item": {
      standart: [
        "cssStyleElementOfMinistryBrandsHorizontalAlign",
        "cssStyleElementOfMinistryBrandsSpacing"
      ]
    },
    ".brz && .brz-ministryBrands__meta--icons": {
      standart: ["cssStyleElementOfMinistryBrandsMetaIconsSpacing"]
    },
    ".brz && :is(.brz-eventDetail__item--meta,.brz-eventDetail__item--meta--container)":
      {
        standart: ["getAllCssStyleTypography"]
      },
    ".brz && :is(.brz-eventDetail__item--meta:hover, .brz-eventDetail__item--meta:hover > *:not(a))":
      {
        standart: ["cssStyleColor"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventDetail__item--meta--title": {
      standart: ["cssStyleElementOfMinistryBrandsTitleTypography"]
    },
    ".brz && .brz-eventDetail__item--meta--title:hover": {
      standart: ["cssStyleElementOfMinistryBrandsTitleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventDetail__item--meta--date": {
      standart: ["cssStyleElementOfMinistryBrandsDateTypography"]
    },
    ".brz && .brz-eventDetail__item--meta--date:hover": {
      standart: ["cssStyleElementOfMinistryBrandsDateColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
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
        "cssStyleElementMinistryBrandsButtonsColor",
        "cssStyleElementMinistryBrandsButtonsBoxShadow",
        "cssStyleElementMinistryBrandsButtonsBorder"
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
    ".brz && .brz-ministryBrands__item--meta--button a:hover": {
      standart: ["cssStyleElementMinistryBrandsButtonsColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventDetail__item--subscribe-event": {
      standart: [
        "cssStyleElementMinistryEventDetailSubscribeEventButtonTypography",
        "cssStyleElementMinistryBrandsButtonsBorderRadius"
      ]
    },
    ".brz && .brz-eventDetail__item--subscribe-event:hover": {
      standart: [
        "cssStyleElementMinistryEventDetailSubscribeEventButtonColor",
        "cssStyleElementMinistryEventDetailSubscribeEventButtonBgColor",
        "cssStyleElementMinistryEventDetailSubscribeEventButtonBgGradient",
        "cssStyleElementMinistryEventDetailSubscribeEventButtonBoxShadow",
        "cssStyleElementMinistryEventDetailSubscribeEventButtonBorder"
      ],
      interval: ["cssStyleMinistryBrandsButtonsHoverTransition"]
    },
    ".brz && .brz-eventDetail__item--subscribe-event a": {
      standart: [
        ...(_isStory
          ? ["cssStyleElementButtonSizeForStory"]
          : ["cssStyleElementMinistryBrandsSubscribeEventSize"])
      ]
    },
    ".brz && .brz-ministryBrands__item--meta--links--previous": {
      standart: ["cssStyleElementOfMinistryBrandsMetaLinksTypography"]
    },
    ".brz && .brz-ministryBrands__item--meta--links--previous:hover": {
      standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventDetail__item--meta--preview *:not(a)": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewTypography"]
    },
    ".brz && .brz-eventDetail__item--meta--preview *:not(a):hover": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-eventDetail__item :not(.brz-eventDetail__item--subscribe-event, .brz-ministryBrands__item--meta--button) a:hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventDetail__item--meta--container > .brz-ministryBrands__meta--icons:hover":
      {
        standart: ["cssStyleColor"],
        interval: ["cssStyleHoverTransition"]
      }
  };

  return renderStyles({ ...data, styles });
}
