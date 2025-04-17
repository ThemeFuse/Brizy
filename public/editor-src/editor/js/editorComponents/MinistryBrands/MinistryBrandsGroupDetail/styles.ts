import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { v } = data;

  const { maskShape = "none" } = v;

  const styles: Styles = {
    ".brz && .brz-groupDetail": {
      standart: ["cssStylePaddingBG", "cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-groupDetail": {
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
    ".brz && .brz-ministryBrands__item--meta-title": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemTitleMargin",
        "cssStyleElementMinistryBrandsMetaItemTitlePadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-day": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemDayMargin",
        "cssStyleElementMinistryBrandsMetaItemDayPadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-times": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemTimesMargin",
        "cssStyleElementMinistryBrandsMetaItemTimesPadding"
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
    ".brz && .brz-ministryBrands__item--meta-status": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemStatusMargin",
        "cssStyleElementMinistryBrandsMetaItemStatusPadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-childcare": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemChildcareMargin",
        "cssStyleElementMinistryBrandsMetaItemChildcarePadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-resourceLink": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemResourceLinkMargin",
        "cssStyleElementMinistryBrandsMetaItemResourceLinkPadding"
      ]
    },
    ".brz && .brz-groupDetail__container": {
      standart: ["cssStyleElementOfMinistryBrandsColumnsNumber"]
    },
    ".brz && .brz-ministryBrands__meta--icons": {
      standart: ["cssStyleElementOfMinistryBrandsMetaIconsSpacing"]
    },
    ".brz && .brz-groupDetail__item--meta--title": {
      standart: ["cssStyleElementOfMinistryBrandsTitleTypography"]
    },
    ".brz && .brz-groupDetail__item--meta--title:hover": {
      standart: ["cssStyleElementOfMinistryBrandsTitleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupDetail__item--meta--date": {
      standart: ["cssStyleElementOfMinistryBrandsDateTypography"]
    },
    ".brz && .brz-groupDetail__item--meta--date:hover": {
      standart: ["cssStyleElementOfMinistryBrandsDateColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupDetail__item": {
      standart: [
        "cssStyleElementOfMinistryBrandsHorizontalAlign",
        "cssStyleElementOfMinistryBrandsSpacing"
      ]
    },
    ".brz && .brz-groupDetail__item--meta": {
      standart: ["getAllCssStyleTypography"]
    },
    ".brz && .brz-groupDetail__item--meta:hover": {
      standart: ["cssStyleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__pagination a": {
      standart: ["cssStyleElementOfMinistryBrandsPaginationTypography"]
    },
    ".brz && .brz-ministryBrands__pagination a:hover": {
      standart: ["cssStyleElementOfMinistryBrandsPaginationColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--meta--links": {
      standart: ["cssStyleElementOfMinistryBrandsMetaLinksTypography"]
    },
    ".brz && .brz-ministryBrands__item--meta--links:hover": {
      standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-groupDetail__item a:hover": {
      standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-groupDetail__item--meta--preview p": {
      standart: ["cssStyleElementOfMinistryBrandsParagraphTypography"]
    },
    ".brz && .brz-groupDetail__item--meta--preview p:hover": {
      standart: ["cssStyleElementOfMinistryBrandsParagraphColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupDetail__item--meta--preview h4": {
      standart: ["cssStyleElementOfMinistryBrandsH4Typography"]
    },
    ".brz && .brz-groupDetail__item--meta--preview h4:hover": {
      standart: ["cssStyleElementOfMinistryBrandsH4Color"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupDetail__item--meta--preview ul": {
      standart: [
        "cssStyleElementOfMinistryBrandsListPaddingLeft",
        "cssStyleElementOfMinistryBrandsListTypes"
      ]
    },
    ".brz && .brz-groupDetail__item--meta--preview ul li": {
      standart: ["cssStyleElementOfMinistryBrandsListTypography"]
    },
    ".brz && .brz-groupDetail__item--meta--preview ul:hover li": {
      standart: ["cssStyleElementOfMinistryBrandsListColor"],
      interval: ["cssStyleHoverTransition"]
    }
  };

  return renderStyles({ ...data, styles });
}
