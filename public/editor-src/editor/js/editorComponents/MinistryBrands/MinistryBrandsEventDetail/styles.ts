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
    ".brz &&:hover .brz-eventDetail__item": {
      standart: ["cssStyleElementOfMinistryBrandsHorizontalAlign"]
    },
    ".brz && :is(.brz-eventDetail__item--meta,.brz-eventDetail__item--meta--container):hover":
      {
        standart: ["getAllCssStyleTypography"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && :is(.brz-eventDetail__item--meta, .brz-eventDetail__item--meta > *:not(a)):hover":
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
    ".brz &&:hover :is(.brz-eventDetail__item, .brz-eventDetail__item--meta--preview) > *:not(:last-child)":
      {
        standart: ["cssStyleElementOfMinistryBrandsSpacing"]
      },
    ".brz &&:hover .brz-eventDetail__item :is(iframe,video,img)": {
      standart: ["cssStyleMinistryElementMediaBorderRadius"]
    },
    ".brz && .brz-eventDetail__item--meta--preview *:not(a):hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsPreviewTypography",
        "cssStyleElementOfMinistryBrandsPreviewColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-eventDetail__item :not(.brz-eventDetail__item--meta--preview, .brz-ministryBrands__item--meta--button) a:hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
        interval: ["cssStyleHoverTransition"]
      }
  };

  return renderStyles({ v, vs, vd, styles });
}
