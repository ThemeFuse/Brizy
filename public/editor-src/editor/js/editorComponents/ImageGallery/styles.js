import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageGalleryWidth",
        "cssStyleElementImageGalleryMargin"
      ]
    },
    ".brz &&:hover .brz-image__gallery-item": {
      standart: [
        "cssStyleElementImageGalleryItemWidth",
        "cssStyleElementImageGalleryItemPadding"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleForFilter(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementImageGalleryFilterAfterSpacing",
        "cssStyleElementImageGalleryFilterHorizontalAlign"
      ]
    },
    ".brz && .brz-image__gallery-filter__item": {
      standart: [
        "cssStyleElementImageGalleryFilterSpacing",
        "cssStyleElementImageGallery3FontFamily",
        "cssStyleElementImageGallery3FontSize",
        "cssStyleElementImageGallery3LineHeight",
        "cssStyleElementImageGallery3FontWeight",
        "cssStyleElementImageGallery3LetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementImageGalleryPropertyHoverTransition"
      ]
    },
    ".brz && .brz-image__gallery-filter__item:not(.brz-image__gallery-filter__item--active):hover": {
      standart: ["cssStyleElementImageGalleryFilterColor"]
    },
    ".brz && .brz-image__gallery-filter__item--style-1": {
      standart: [
        "cssStyleElementAccordionFilterPaddingFourFields",
        "cssStyleElementImageGalleryBorderRadius"
      ]
    },
    ".brz && .brz-image__gallery-filter__item--style-1:not(.brz-image__gallery-filter__item--active):hover": {
      standart: [
        "cssStyleElementImageGalleryFilterBgColor",
        "cssStyleElementImageGalleryFilterBorder",
        "cssStyleElementImageGalleryFilterBoxShadow",
        "cssStyleElementImageGalleryBorderRadius"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementImageGalleryPropertyHoverTransition"
      ]
    },
    ".brz && .brz-image__gallery-filter__item--style-1.brz-image__gallery-filter__item--active": {
      standart: [
        "cssStyleElementImageGalleryFilterActiveColor",
        "cssStyleElementImageGalleryFilterActiveBgColor",
        "cssStyleElementImageGalleryFilterActiveBorder",
        "cssStyleElementImageGalleryFilterActiveShadow"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementImageGalleryPropertyHoverTransition"
      ]
    },
    ".brz &&.brz-image__gallery-filter--style-2:hover": {
      standart: [
        "cssStyleElementAccordionFilterPaddingFourFields",
        "cssStyleElementImageGalleryFilterBgColor",
        "cssStyleElementImageGalleryFilterBorder",
        "cssStyleElementImageGalleryFilterBoxShadow",
        "cssStyleDisplayInlineFlex",
        "cssStyleElementImageGalleryBorderRadius"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementImageGalleryPropertyHoverTransition"
      ]
    },
    ".brz && .brz-image__gallery-filter__item--style-2.brz-image__gallery-filter__item--active": {
      standart: ["cssStyleElementImageGalleryFilterActiveColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementImageGalleryPropertyHoverTransition"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
