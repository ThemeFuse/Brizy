import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz && > div > .brz-metas": {
      standart: ["cssStyleElementWOOProductMetaType"]
    },
    ".brz &&:hover > div > .brz-metas > .brz-wooproductmeta__container:not(:first-child)":
      {
        standart: ["cssStyleElementWOOProductMetaDividers"]
      },
    ".brz && > div > .brz-metas > .brz-wooproductmeta__container:not(:last-child)":
      {
        standart: ["cssStyleElementWOOProductMetaRightSpacingInline"]
      },
    ".brz && > div > .brz-metas > .brz-wooproductmeta__container > .brz-wooproductmeta__item":
      {
        standart: ["cssStyleElementWOOProductMetaTopSpacing"]
      },
    ".brz && > div > .brz-metas > .brz-wooproductmeta__container > .brz-wooproductmeta__item-category":
      {
        standart: [
          "cssStyleElementWOOProductMetaCategoryFontFamily",
          "cssStyleElementWOOProductMetaCategoryFontSize",
          "cssStyleElementWOOProductMetaCategoryLineHeight",
          "cssStyleElementWOOProductMetaCategoryFontWeight",
          "cssStyleElementWOOProductMetaCategoryLetterSpacing",
          "cssStyleElementWOOProductMetaCategoryFontVariation",
          "cssStyleElementWOOProductMetaCategoryTextTransform"
        ]
      },
    ".brz &&:hover > div > .brz-metas > .brz-wooproductmeta__container > .brz-wooproductmeta__item-category":
      {
        standart: ["cssStyleElementWOOProductMetaCategoryColor"]
      },
    ".brz && > div > .brz-metas > .brz-wooproductmeta__container > .brz-wooproductmeta__item-value":
      {
        standart: [
          "cssStyleElementWOOProductMetaValueFontFamily",
          "cssStyleElementWOOProductMetaValueFontSize",
          "cssStyleElementWOOProductMetaValueLineHeight",
          "cssStyleElementWOOProductMetaValueFontWeight",
          "cssStyleElementWOOProductMetaValueLetterSpacing",
          "cssStyleElementWOOProductMetaValueFontVariation",
          "cssStyleElementWOOProductMetaValueTextTransform",
          "cssStyleElementWOOProductMetaRightSpacing"
        ]
      },
    ".brz &&:hover > div > .brz-metas > .brz-wooproductmeta__container > .brz-wooproductmeta__item-value":
      {
        standart: ["cssStyleElementWOOProductMetaValueColor"]
      }
  };

  return renderStyles({ ...data, styles });
}
