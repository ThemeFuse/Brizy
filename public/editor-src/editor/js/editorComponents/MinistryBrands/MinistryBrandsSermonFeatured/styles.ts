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
    ".brz &&:hover .brz-sermonFeatured": {
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
    ".brz && .brz-sermonFeatured__item--meta:hover": {
      standart: ["cssStyleColor"],
      interval: ["cssStyleHoverTransition"]
    },

    ".brz && :is(.brz-sermonFeatured__item--meta, .brz-sermonFeatured__item--meta ~ a):hover":
      {
        standart: ["getAllCssStyleTypography"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-sermonFeatured__item--meta--title:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsTitleColor",
        "cssStyleElementOfMinistryBrandsTitleTypography"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-sermonFeatured__item": {
      standart: ["cssStyleElementOfMinistryBrandsHorizontalAlign"]
    },
    ".brz &&:hover .brz-sermonFeatured__item :is(iframe,video,img)": {
      standart: ["cssStyleMinistryElementMediaBorderRadius"]
    },
    ".brz &&:hover .brz-sermonFeatured__item > *": {
      standart: ["cssStyleElementOfMinistryBrandsSpacing"]
    },
    ".brz && .brz-sermonFeatured__item--meta--preview:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsPreviewTypography",
        "cssStyleElementOfMinistryBrandsPreviewColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-sermonFeatured__item--meta ~ a:hover": {
      standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-sermonFeatured__item--media--links a:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsMediaTypography",
        "cssStyleElementOfMinistryBrandsMetaLinksColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--meta--button:hover": {
      standart: [
        "cssStyleElementMinistryBrandsButtonsTypography",
        "cssStyleElementMinistryBrandsButtonsBgColor",
        "cssStyleElementMinistryBrandsButtonsBgGradient",
        "cssStyleElementMinistryBrandsButtonsColor",
        "cssStyleElementMinistryBrandsButtonsBoxShadow",
        "cssStyleElementMinistryBrandsButtonsBorder"
      ],
      interval: ["cssStyleHoverTransition"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
