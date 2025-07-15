import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz && .brz-posts__wrapper > .brz-posts__item": {
      standart: [
        "cssStyleElementPostsItemWidth",
        "cssStyleElementPostsItemSpacing"
      ]
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
        "cssStyleElementPostsFilterLetterSpacing",
        "cssStyleElementPostsFilterFontVariation",
        "cssStyleElementPostsFilterTextTransform"
      ]
    },
    ".brz && .brz-posts__filter__item--style-1": {
      standart: ["cssStyleElementPostsFilterPaddingFourFields"]
    },
    ".brz && .brz-posts__filter__item--style-1.brz-posts-filter__item--active":
      {
        standart: [
          "cssStyleElementPostsFilterActiveColor",
          "cssStyleElementPostsFilterActiveBgColor",
          "cssStyleElementPostsFilterActiveBorder",
          "cssStyleElementPostsFilterActiveShadow"
        ]
      },
    ".brz && .brz-posts__filter__item--style-1:not(.brz-posts-filter__item--active)":
      {
        standart: ["cssStyleElementPostsFilterBorderRadius"]
      },
    ".brz && .brz-posts__filter__item--style-1:not(.brz-posts-filter__item--active):hover":
      {
        standart: [
          "cssStyleElementPostsFilterBgColor",
          "cssStyleElementPostsFilterBorder",
          "cssStyleElementPostsFilterShadow",
          "cssStyleElementPostsFilterColor"
        ]
      },
    ".brz && .brz-posts__filter--style-2": {
      standart: ["cssStyleElementPostsFilterPaddingFourFields"]
    },
    ".brz && .brz-posts__filter__item--style-2.brz-posts-filter__item--active":
      {
        standart: ["cssStyleElementPostsFilterActiveColor"]
      },
    ".brz && .brz-posts__filter__item--style-2:not(.brz-posts-filter__item--active):hover":
      {
        standart: ["cssStyleElementPostsFilterColor"]
      },
    ".brz && .brz-posts__filter--style-2:not(.brz-posts-filter__item--active)":
      {
        standart: [
          "cssStyleElementPostsFilterBorderRadius",
          "cssStyleDisplayInlineFlex"
        ]
      },
    ".brz && .brz-posts__filter--style-2:not(.brz-posts-filter__item--active):hover":
      {
        standart: [
          "cssStyleElementPostsFilterBgColor",
          "cssStyleElementPostsFilterBorder",
          "cssStyleElementPostsFilterShadow"
        ]
      },

    // pagination
    ".brz && .brz-posts__pagination ul.page-numbers": {
      standart: ["cssStyleElementPostsPaginationSpacing"]
    },
    ".brz && .brz-posts__pagination ul.page-numbers .page-numbers": {
      standart: [
        "cssStyleElementPostsPaginationFontFamily",
        "cssStyleElementPostsPaginationFontSize",
        "cssStyleElementPostsPaginationLineHeight",
        "cssStyleElementPostsPaginationFontWeight",
        "cssStyleElementPostsPaginationLetterSpacing",
        "cssStyleElementPostsPaginationFontVariation",
        "cssStyleElementPostsPaginationTextTransform",
        "cssStyleElementPostsPaginationBorderRadius"
      ]
    },
    ".brz && .brz-posts__pagination ul.page-numbers li:hover .page-numbers:not(.current)":
      {
        standart: [
          "cssStyleElementPostsPaginationBgColor",
          "cssStyleElementPostsPaginationBorder",
          "cssStyleElementPostsPaginationColor"
        ]
      },
    ".brz && .brz-posts__pagination ul.page-numbers .page-numbers.current:hover":
      {
        standart: [
          "cssStyleElementPostsPaginationActiveColor",
          "cssStyleElementPostsPaginationActiveBgColor",
          "cssStyleElementPostsPaginationActiveBorder"
        ]
      },
    ".brz && .brz-posts__filter__item--style-1, .brz && .brz-posts__filter--style-2":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}
