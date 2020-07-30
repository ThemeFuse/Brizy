import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz && .brz-posts__wrapper > .brz-posts__item": {
      standart: ["cssStyleElementPostsItemWidth"]
    },

    // filter
    ".brz && .brz-posts__filter-wrapper": {
      standart: [
        "cssStyleElementPostsFilterDisplay",
        "cssStyleElementPostsFilterHorizontalAlign",
        "cssStyleElementPostsFilterAfterSpacing"
      ]
    },
    ".brz && .brz-posts__filter__item": {
      standart: [
        "cssStyleElementPostsFilterSpacing",
        "cssStyleElementPostsFilterFontFamily",
        "cssStyleElementPostsFilterFontSize",
        "cssStyleElementPostsFilterLineHeight",
        "cssStyleElementPostsFilterFontWeight",
        "cssStyleElementPostsFilterLetterSpacing"
      ]
    },
    ".brz && .brz-posts__filter__item:hover": {
      standart: ["cssStyleElementPostsFilterColor"]
    },
    ".brz && .brz-posts__filter__item--style-1:hover": {
      standart: [
        "cssStyleElementPostsFilterPaddingFourFields",
        "cssStyleElementPostsFilterBgColor",
        "cssStyleElementPostsFilterBorder",
        "cssStyleElementPostsFilterBorderRadius",
        "cssStyleElementPostsFilterShadow"
      ]
    },
    ".brz && .brz-posts__filter__item--style-1.brz-posts-filter__item--active": {
      standart: [
        "cssStyleElementPostsFilterActiveColor",
        "cssStyleElementPostsFilterActiveBgColor",
        "cssStyleElementPostsFilterActiveBorder",
        "cssStyleElementPostsFilterActiveShadow"
      ]
    },
    ".brz && .brz-posts__filter__item--style-1:first-child": {
      standart: [
        ...(IS_EDITOR
          ? [
              "cssStyleElementPostsFilterActiveColor",
              "cssStyleElementPostsFilterActiveBgColor",
              "cssStyleElementPostsFilterActiveBorder",
              "cssStyleElementPostsFilterActiveShadow"
            ]
          : [])
      ]
    },
    ".brz && .brz-posts__filter--style-2:hover": {
      standart: [
        "cssStyleElementPostsFilterPaddingFourFields",
        "cssStyleElementPostsFilterBgColor",
        "cssStyleElementPostsFilterBorder",
        "cssStyleElementPostsFilterBorderRadius",
        "cssStyleElementPostsFilterShadow",
        "cssStyleDisplayInlineFlex"
      ]
    },
    ".brz && .brz-posts__filter__item--style-2.brz-posts-filter__item--active": {
      standart: ["cssStyleElementPostsFilterActiveColor"]
    },
    ".brz && .brz-posts__filter__item--style-2:first-child": {
      standart: [
        ...(IS_EDITOR ? ["cssStyleElementPostsFilterActiveColor"] : [])
      ]
    },

    // pagination
    ".brz && ul.page-numbers": {
      standart: ["cssStyleElementPostsPaginationSpacing"]
    },
    ".brz && ul.page-numbers a.page-numbers:hover": {
      standart: ["cssStyleElementPostsPaginationColor"]
    },
    ".brz && ul.page-numbers span.page-numbers:hover": {
      standart: ["cssStyleElementPostsPaginationColor"]
    },
    ".brz && ul.page-numbers .page-numbers": {
      standart: [
        ...(IS_EDITOR ? ["cssStyleElementPostsPaginationLinksOff"] : []),
        "cssStyleElementPostsPaginationFontFamily",
        "cssStyleElementPostsPaginationFontSize",
        "cssStyleElementPostsPaginationLineHeight",
        "cssStyleElementPostsPaginationFontWeight",
        "cssStyleElementPostsPaginationLetterSpacing"
      ]
    },
    ".brz && ul.page-numbers .page-numbers.current:hover::before": {
      standart: [
        "cssStyleElementPostsPaginationBgColor",
        "cssStyleElementPostsPaginationBorder",
        "cssStyleElementPostsPaginationBorderRadius"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
