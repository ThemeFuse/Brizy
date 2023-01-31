import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
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
    ".brz &&:hover .brz-sermonLayout__container": {
      standart: ["cssStyleElementOfMinistryBrandsColumnsNumberWithSpacing"]
    },
    ".brz &&:hover .brz-sermonLayout__item": {
      standart: ["cssStyleElementOfMinistryBrandsHorizontalAlign"]
    },
    ".brz && .brz-sermonLayout__item--meta:hover": {
      standart: ["getAllCssStyleTypography", "cssStyleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-sermonLayout__item iframe, .brz-sermonLayout__item video, .brz-sermonLayout__item img":
      {
        standart: ["cssStyleMinistryElementMediaBorderRadius"]
      },
    ".brz && .brz-sermonLayout__item--meta--title:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsTitleColor",
        "cssStyleElementOfMinistryBrandsTitleTypography"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-sermonLayout__item--meta--title:hover a": {
      standart: [
        "cssStyleElementOfMinistryBrandsTitleColor",
        "cssStyleElementOfMinistryBrandsTitleTypography"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-sermonLayout__item--preview:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsPreviewTypography",
        "cssStyleElementOfMinistryBrandsPreviewColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__pagination a:hover:not(#current)": {
      standart: [
        "cssStyleElementOfMinistryBrandsPaginationColor",
        "cssStyleElementOfMinistryBrandsPaginationTypography"
      ],
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
    ".brz && .brz-sermonLayout__item a:not(.brz-sermonLayout__item--meta--title a):not(.brz-sermonLayout__item--detail-button a):hover":
      {
        standart: [
          "cssStyleElementOfMinistryBrandsMetaLinksTypography",
          "cssStyleElementOfMinistryBrandsMetaLinksColor"
        ],
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
    ".brz && .brz-sermonLayout__filter:hover .brz-sermonLayout__filter--form-selectWrapper":
      {
        standart: [
          "cssStyleMinistryElementFiltersBorder",
          "cssStyleMinistryElementFiltersTypography",
          "cssStyleMinistryElementFiltersInputBgColor",
          "cssStyleMinistryElementFiltersInputGradientColor",
          "cssStyleMinistryElementFiltersInputColor",
          "cssStyleMinistryElementFiltersBorderRadius"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-sermonLayout__filter:hover .brz-sermonLayout__filter--form-selectWrapper select option":
      {
        standart: ["cssStyleMinistryElementFiltersInputBgColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-sermonLayout__filter:hover .brz-sermonLayout__filter--form-selectWrapper::after":
      {
        standart: ["cssStyleMinistryElementFiltersInputColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-sermonLayout__filter input:hover": {
      standart: [
        "cssStyleMinistryElementFiltersTypography",
        "cssStyleMinistryElementFiltersInputColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-sermonLayout__filter fieldset:hover": {
      standart: [
        "cssStyleMinistryElementFiltersInputBgColor",
        "cssStyleMinistryElementFiltersInputGradientColor",
        "cssStyleMinistryElementFiltersBorder",
        "cssStyleMinistryElementFiltersBorderRadius"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-sermonLayout__filter:hover input::placeholder": {
      standart: ["cssStyleMinistryElementFiltersInputColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-sermonLayout__filter:hover button": {
      standart: ["cssStyleMinistryElementFiltersInputColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-sermonLayout__item--detail-button a:hover": {
      standart: [
        "cssStyleElementSermonLayoutButtonsTypography",
        "cssStyleElementSermonLayoutButtonsBgColor",
        "cssStyleElementSermonLayoutButtonsBgGradient",
        "cssStyleElementSermonLayoutButtonsColor",
        "cssStyleElementSermonLayoutButtonsBoxShadow",
        "cssStyleElementSermonLayoutButtonsBorder"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
