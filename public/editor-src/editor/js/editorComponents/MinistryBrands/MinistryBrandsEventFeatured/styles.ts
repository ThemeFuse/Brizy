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
    ".brz &&:hover .brz-eventFeatured": {
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
    ".brz &&:hover .brz-eventFeatured__item": {
      standart: ["cssStyleElementOfMinistryBrandsHorizontalAlign"]
    },
    ".brz && .brz-eventFeatured__item--meta:hover": {
      standart: ["cssStyleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && :is(.brz-eventFeatured__item--meta, .brz-eventFeatured__item--meta--link):hover":
      {
        standart: ["getAllCssStyleTypography"]
      },
    ".brz && .brz-eventFeatured__item--meta--title:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsTitleColor",
        "cssStyleElementOfMinistryBrandsTitleTypography"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-eventFeatured__item--meta--date:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsDateTypography",
        "cssStyleElementOfMinistryBrandsDateColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover :is(.brz-eventFeatured__item, .brz-eventFeatured__item--meta--preview) > *":
      {
        standart: ["cssStyleElementOfMinistryBrandsSpacing"]
      },
    ".brz &&:hover .brz-eventFeatured__item :is(iframe,video,img)": {
      standart: ["cssStyleMinistryElementMediaBorderRadius"]
    },
    ".brz && :is(.brz-eventFeatured__item--meta--preview, .brz-eventFeatured__item--meta--preview *):hover":
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

    ".brz && .brz-ministryBrands__item--meta--button:hover": {
      standart: [
        "cssStyleElementMinistryBrandsButtonsBgColor",
        "cssStyleElementMinistryBrandsButtonsBgGradient",
        "cssStyleElementMinistryBrandsButtonsBoxShadow",
        "cssStyleElementMinistryBrandsButtonsBorder",
        "cssStyleElementMinistryBrandsButtonsColor",
        "cssStyleElementMinistryBrandsButtonsTypography"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta--register-button:hover": {
      standart: [
        "cssStyleElementMinistryBrandsRegisterButtonBgColor",
        "cssStyleElementMinistryBrandsRegisterButtonBgGradient",
        "cssStyleElementMinistryBrandsRegisterButtonBoxShadow",
        "cssStyleElementMinistryBrandsRegisterButtonBorder",
        "cssStyleElementMinistryBrandsRegisterButtonColor",
        "cssStyleElementMinistryBrandsRegisterButtonTypography"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
