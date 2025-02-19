import { isStory } from "visual/providers/EditorModeProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { v } = data;
  const { maskShape = "none" } = v;
  const editorMode = data.contexts.mode;
  const _isStory = isStory(editorMode);

  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz && .brz-eventDetail:hover": {
      standart: [
        "cssStylePaddingBG",
        "cssStylementOfMinistryBrandsParentBgColor",
        "cssStylementOfMinistryBrandsParentBgGradient",
        "cssStylementOfMinistryBrandsParentBorder",
        "cssStylementOfMinistryBrandsParentBoxShadow",
        "cssStyleBorderRadius"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__item--media:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsImageWidth",
        "cssStyleElementOfMinistryBrandsImagePadding",
        "cssStyleElementOfMinistryBrandsImgBorder",
        "cssStyleMinistryElementMediaBorderRadius",
        ...(maskShape === "none"
          ? ["cssStyleElementOfMinistryBrandsImgBoxShadow"]
          : ["cssStyleElementOfMinistryBrandsImgMaskShadow"])
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__item--media:hover::after": {
      standart: [
        "cssStyleElementOfMinistryBrandsImgBgColor",
        "cssStyleElementOfMinistryBrandsImgBgGradient",
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__item--media:hover :is(img, video, iframe)": {
      standart: [
        "cssStyleElementOfMinistryBrandsImgFilters",
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-eventDetail__item": {
      standart: [
        "cssStyleElementOfMinistryBrandsHorizontalAlign",
        "cssStyleElementOfMinistryBrandsSpacing"
      ]
    },
    ".brz &&:hover .brz-ministryBrands__meta--icons": {
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
    ".brz && .brz-eventDetail__item--meta--title:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsTitleColor",
        "cssStyleElementOfMinistryBrandsTitleTypography"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventDetail__item--meta--date:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsDateTypography",
        "cssStyleElementOfMinistryBrandsDateColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta--button:hover": {
      standart: [
        "cssStyleElementMinistryBrandsButtonsTypography",
        "cssStyleElementMinistryBrandsButtonsBgColor",
        "cssStyleElementMinistryBrandsButtonsBgGradient",
        "cssStyleElementMinistryBrandsButtonsColor",
        "cssStyleElementMinistryBrandsButtonsBoxShadow",
        "cssStyleElementMinistryBrandsButtonsBorder",
        "cssStyleElementMinistryBrandsButtonsBorderRadius"
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
    ".brz && .brz-eventDetail__item--subscribe-event:hover": {
      standart: [
        "cssStyleElementMinistryEventDetailSubscribeEventButtonColor",
        "cssStyleElementMinistryEventDetailSubscribeEventButtonTypography",
        "cssStyleElementMinistryEventDetailSubscribeEventButtonBgColor",
        "cssStyleElementMinistryEventDetailSubscribeEventButtonBgGradient",
        "cssStyleElementMinistryEventDetailSubscribeEventButtonBoxShadow",
        "cssStyleElementMinistryEventDetailSubscribeEventButtonBorder",
        "cssStyleElementMinistryBrandsButtonsBorderRadius"
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
    ".brz && .brz-ministryBrands__item--meta--links--previous:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsMetaLinksTypography",
        "cssStyleElementOfMinistryBrandsMetaLinksColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventDetail__item--meta--preview *:not(a):hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsPreviewTypography",
        "cssStyleElementOfMinistryBrandsPreviewColor"
      ],
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
