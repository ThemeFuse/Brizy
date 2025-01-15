import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { v } = data;
  const { maskShape = "none" } = v;
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover .brz-articleFeatured": {
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
    ".brz &&:hover .brz-articleFeatured__item": {
      standart: ["cssStyleElementOfMinistryBrandsHorizontalAlign"]
    },
    ".brz && .brz-articleFeatured__item--meta:hover": {
      standart: ["cssStyleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-ministryBrands__meta--icons": {
      standart: ["cssStyleElementOfMinistryBrandsMetaIconsSpacing"]
    },
    ".brz && :is(.brz-articleFeatured__item--meta, .brz-articleFeatured__item--meta--link):hover":
      {
        standart: ["getAllCssStyleTypography"]
      },
    ".brz && .brz-articleFeatured__item--meta--title:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsTitleColor",
        "cssStyleElementOfMinistryBrandsTitleTypography"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover :is(.brz-articleFeatured__item, .brz-articleFeatured__item--meta--preview) > *":
      {
        standart: ["cssStyleElementOfMinistryBrandsSpacing"]
      },
    ".brz &&:hover .brz-articleFeatured__item :is(iframe,video,img)": {
      standart: ["cssStyleMinistryElementMediaBorderRadius"]
    },
    ".brz && :is(.brz-articleFeatured__item--meta--preview, .brz-articleFeatured__item--meta--preview *):hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsPreviewTypography"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && :is(.brz-articleFeatured__item--meta--preview, .brz-articleFeatured__item--meta--preview *:not(a)):hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsPreviewColor"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && :is(.brz-articleFeatured__item--meta--link,.brz-articleFeatured__item--meta--preview) a:hover":
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
    ".brz && .brz-articleFeatured__item--media--links a:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsMediaTypography",
        "cssStyleElementOfMinistryBrandsMetaLinksColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--meta--links:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsMetaLinksTypography",
        "cssStyleElementOfMinistryBrandsMetaLinksColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--media:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsImageWidth",
        "cssStyleElementOfMinistryBrandsImagePadding",
        "cssStyleElementOfMinistryBrandsImgBorder",
        ...(maskShape === "none"
          ? []
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
        "cssStyleMaskRepeat",
        "cssStyleMinistryElementMediaBorderRadius",
        ...(maskShape === "none"
          ? ["cssStyleElementOfMinistryBrandsImgBoxShadow"]
          : [])
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
    }
  };

  return renderStyles({ ...data, styles });
}
