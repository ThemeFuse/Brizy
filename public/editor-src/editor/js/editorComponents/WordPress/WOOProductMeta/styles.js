import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover > div > .brz-metas": {
      standart: ["cssStyleElementWOOProductMetaType"]
    },
    ".brz &&:hover > div > .brz-metas > .brz-wooproductmeta__container:not(:first-child)": {
      standart: ["cssStyleElementWOOProductMetaDviders"]
    },
    ".brz &&:hover > div > .brz-metas > .brz-wooproductmeta__container:not(:last-child)": {
      standart: ["cssStyleElementWOOProductMetaRightSpacingInline"]
    },
    ".brz &&:hover > div > .brz-metas > .brz-wooproductmeta__container > .brz-wooproductmeta__item": {
      standart: ["cssStyleElementWOOProductMetaTopSpacing"]
    },
    ".brz &&:hover > div > .brz-metas > .brz-wooproductmeta__container > .brz-wooproductmeta__item-category": {
      standart: [
        "cssStyleElementWOOProductMetaCategoryFontFamily",
        "cssStyleElementWOOProductMetaCategoryFontSize",
        "cssStyleElementWOOProductMetaCategoryLineHeight",
        "cssStyleElementWOOProductMetaCategoryFontWeight",
        "cssStyleElementWOOProductMetaCategoryLetterSpacing",
        "cssStyleElementWOOProductMetaCategoryColor"
      ]
    },
    ".brz &&:hover > div > .brz-metas > .brz-wooproductmeta__container > .brz-wooproductmeta__item-value": {
      standart: [
        "cssStyleElementWOOProductMetaValueFontFamily",
        "cssStyleElementWOOProductMetaValueFontSize",
        "cssStyleElementWOOProductMetaValueLineHeight",
        "cssStyleElementWOOProductMetaValueFontWeight",
        "cssStyleElementWOOProductMetaValueLetterSpacing",
        "cssStyleElementWOOProductMetaRightSpacing",
        "cssStyleElementWOOProductMetaValueColor"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
