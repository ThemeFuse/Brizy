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
    ".brz &&:hover .brz-groupFeatured": {
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
    ".brz &&:hover .brz-groupFeatured__container": {
      standart: ["cssStyleElementOfMinistryBrandsColumnsNumber"]
    },
    ".brz && .brz-groupFeatured__item--meta--title:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsTitleColor",
        "cssStyleElementOfMinistryBrandsTitleTypography"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupFeatured__item--meta--date:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsDateColor",
        "cssStyleElementOfMinistryBrandsDateTypography"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-groupFeatured__item img": {
      standart: ["cssStyleMinistryElementMediaBorderRadius"]
    },
    ".brz &&:hover .brz-groupFeatured__item > *": {
      standart: ["cssStyleElementOfMinistryBrandsSpacing"]
    },
    ".brz &&:hover .brz-groupFeatured__item": {
      standart: ["cssStyleElementOfMinistryBrandsHorizontalAlign"]
    },
    ".brz && .brz-groupFeatured__item--meta:hover": {
      standart: ["getAllCssStyleTypography", "cssStyleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--meta--links:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsMetaLinksTypography",
        "cssStyleElementOfMinistryBrandsMetaLinksColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--meta--button:hover": {
      standart: [
        "cssStyleElementMinistryBrandsButtonsTypography",
        "cssStyleElementMinistryBrandsButtonsBgColor",
        "cssStyleElementMinistryBrandsButtonsBgGradient",
        "cssStyleElementMinistryBrandsButtonsBoxShadow",
        "cssStyleElementMinistryBrandsButtonsBorder"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta--button a:hover": {
      standart: ["cssStyleElementMinistryBrandsButtonsColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-groupFeatured__item--meta--preview:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsPreviewTypography",
        "cssStyleElementOfMinistryBrandsPreviewColor"
      ],
      interval: ["cssStyleHoverTransition"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
