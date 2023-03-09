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
    ".brz &&:hover .brz-groupDetail": {
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
    ".brz &&:hover .brz-groupDetail__container": {
      standart: ["cssStyleElementOfMinistryBrandsColumnsNumber"]
    },
    ".brz && .brz-groupDetail__item--meta--title:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsTitleColor",
        "cssStyleElementOfMinistryBrandsTitleTypography"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupDetail__item--meta--date:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsDateColor",
        "cssStyleElementOfMinistryBrandsDateTypography"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-groupDetail__item :is(iframe,video,img)": {
      standart: ["cssStyleMinistryElementMediaBorderRadius"]
    },
    ".brz &&:hover .brz-groupDetail__item > *": {
      standart: ["cssStyleElementOfMinistryBrandsSpacing"]
    },
    ".brz &&:hover .brz-groupDetail__item": {
      standart: ["cssStyleElementOfMinistryBrandsHorizontalAlign"]
    },
    ".brz && .brz-groupDetail__item--meta--preview *:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsPreviewTypography",
        "cssStyleElementOfMinistryBrandsPreviewColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupDetail__item--meta:hover": {
      standart: ["getAllCssStyleTypography", "cssStyleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__pagination a:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsPaginationColor",
        "cssStyleElementOfMinistryBrandsPaginationTypography"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && :is(.brz-groupDetail__item a, .brz-ministryBrands__item--meta--links):hover":
      {
        standart: [
          "cssStyleElementOfMinistryBrandsMetaLinksTypography",
          "cssStyleElementOfMinistryBrandsMetaLinksColor"
        ],
        interval: ["cssStyleHoverTransition"]
      }
  };

  return renderStyles({ v, vs, vd, styles });
}
