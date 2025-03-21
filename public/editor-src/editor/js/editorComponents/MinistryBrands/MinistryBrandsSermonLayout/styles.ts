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
    ".brz &&": {
      standart: ["cssStylePaddingBG", "cssStyleBorderRadius"]
    },
    ".brz &&:hover": {
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
    ".brz && .brz-sermonLayout__container": {
      standart: ["cssStyleElementOfMinistryBrandsColumnsNumberWithSpacing"]
    },
    ".brz && .brz-ministryBrands__meta--icons": {
      standart: ["cssStyleElementOfMinistryBrandsMetaIconsSpacing"]
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
    ".brz && .brz-ministryBrands__item--meta-series": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemSeriesMargin",
        "cssStyleElementMinistryBrandsMetaItemSeriesPadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-preacher": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemPreacherMargin",
        "cssStyleElementMinistryBrandsMetaItemPreacherPadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-passage": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemPassageMargin",
        "cssStyleElementMinistryBrandsMetaItemPassagePadding"
      ]
    },
    ".brz && .brz-sermonLayout__item": {
      standart: [
        "cssStyleElementOfMinistryBrandsHorizontalAlign",
        "cssStyleElementOfMinistryBrandsMetaItemsSpacing",
        "cssStyleElementOfMinistryBrandsItemPadding"
      ]
    },
    ".brz && .brz-sermonLayout__item :is(.brz-sermonLayout__item--meta, .brz-sermonLayout__item--meta-passages)":
      {
        standart: ["getAllCssStyleTypography"]
      },
    ".brz && :is(.brz-sermonLayout__item--meta, .brz-sermonLayout__item--meta-passages > .brz-ministryBrands__meta--icons):hover":
      {
        standart: ["cssStyleColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-sermonLayout__item .brz-sermonLayout__item--media a": {
      standart: ["cssStyleElementOfMinistryBrandsMediaTypography"]
    },
    ".brz && .brz-sermonLayout__item .brz-sermonLayout__item--media a:hover": {
      standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-sermonLayout__item--meta--title": {
      standart: ["cssStyleElementOfMinistryBrandsTitleTypography"]
    },
    ".brz && .brz-sermonLayout__item--meta--title:hover": {
      standart: ["cssStyleElementOfMinistryBrandsTitleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-sermonLayout__item--preview": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewTypography"]
    },
    ".brz && .brz-sermonLayout__item--preview:hover": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__pagination a:not(#current)": {
      standart: ["cssStyleElementOfMinistryBrandsPaginationTypography"]
    },
    ".brz && .brz-ministryBrands__pagination a:hover:not(#current)": {
      standart: ["cssStyleElementOfMinistryBrandsPaginationColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__pagination span.pagination_ellipsis": {
      standart: ["cssStyleElementOfMinistryBrandsPaginationTypography"]
    },
    ".brz && .brz-ministryBrands__pagination span:hover.pagination_ellipsis": {
      standart: ["cssStyleElementOfMinistryBrandsPaginationColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__pagination a#current": {
      standart: [
        "cssStyleElementOfMinistryBrandsPaginationColorActive",
        "cssStyleElementOfMinistryBrandsPaginationTypography"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-sermonLayout__item > :not(.brz-sermonLayout__item--meta--title, .brz-sermonLayout__item--meta-passages, .brz-sermonLayout__item--detail-button, .brz-sermonLayout__item--media) a":
      {
        standart: ["cssStyleElementOfMinistryBrandsMetaLinksTypography"]
      },
    ".brz && .brz-sermonLayout__item > :not(.brz-sermonLayout__item--meta--title, .brz-sermonLayout__item--meta-passages, .brz-sermonLayout__item--detail-button, .brz-sermonLayout__item--media) a:hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && :is(.brz-sermonLayout__item--meta-passages a, .brz-ministryBrands__item--meta-passage-content):hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-sermonLayout__filter:hover": {
      standart: [
        "cssStyleMinistryElementFiltersBgColor",
        "cssStyleMinistryElementFiltersBgGradient"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-sermonLayout__filter :is(.brz-sermonLayout__filter--form-selectWrapper, fieldset)":
      {
        standart: [
          "cssStyleMinistryElementFiltersTypography",
          "cssStyleMinistryElementFiltersBorderRadius"
        ]
      },
    ".brz && .brz-sermonLayout__filter :is(.brz-sermonLayout__filter--form-selectWrapper, fieldset):hover":
      {
        standart: [
          "cssStyleMinistryElementFiltersBorder",
          "cssStyleMinistryElementFiltersInputBgColor",
          "cssStyleMinistryElementFiltersInputGradientColor",
          "cssStyleMinistryElementFiltersInputColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-sermonLayout__filter .brz-sermonLayout__filter--form-selectWrapper:hover select option":
      {
        standart: ["cssStyleMinistryElementFiltersInputBgColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-sermonLayout__filter .brz-sermonLayout__filter--form-selectWrapper:hover::after":
      {
        standart: ["cssStyleMinistryElementFiltersInputColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-sermonLayout__filter input": {
      standart: ["cssStyleMinistryElementFiltersTypography"]
    },
    ".brz && .brz-sermonLayout__filter input:hover": {
      standart: ["cssStyleMinistryElementFiltersInputColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-sermonLayout__filter fieldset": {
      standart: ["cssStyleMinistryElementFiltersBorderRadius"]
    },
    ".brz && .brz-sermonLayout__filter fieldset:hover": {
      standart: [
        "cssStyleMinistryElementFiltersInputBgColor",
        "cssStyleMinistryElementFiltersInputGradientColor",
        "cssStyleMinistryElementFiltersBorder"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-sermonLayout__filter fieldset:hover input::placeholder": {
      standart: ["cssStyleMinistryElementFiltersInputColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-sermonLayout__filter fieldset:hover button": {
      standart: ["cssStyleMinistryElementFiltersInputColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-sermonLayout__item--detail-button": {
      standart: [
        "cssStyleElementMinistryBrandsButtonsTypography",
        "cssStyleElementMinistryBrandsButtonsBorderRadius"
      ]
    },
    ".brz && .brz-sermonLayout__item--detail-button:hover": {
      standart: [
        "cssStyleElementMinistryBrandsButtonsBgColor",
        "cssStyleElementMinistryBrandsButtonsBgGradient",
        "cssStyleElementMinistryBrandsButtonsColor",
        "cssStyleElementMinistryBrandsButtonsBoxShadow",
        "cssStyleElementMinistryBrandsButtonsBorder"
      ],
      interval: ["cssStyleMinistryBrandsButtonsHoverTransition"]
    },
    ".brz && .brz-sermonLayout__item--detail-button a": {
      standart: [
        ...(_isStory
          ? ["cssStyleElementButtonSizeForStory"]
          : ["cssStyleElementMinistryBrandsButtonsSize"])
      ]
    },
    ".brz && .brz-sermonLayout-results-heading": {
      standart: [
        "cssStyleElementMinistryResultsHeadingTypography",
        "cssStyleElementMinistryResultsHeadingColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-sermonLayout-no-results": {
      standart: [
        "cssStyleElementMinistryNoResultsParagraphTypography",
        "cssStyleElementMinistryNoResultsParagraphColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-sermonLayout__item:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsItemColor",
        "cssStyleElementOfMinistryBrandsItemBgGradient"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
