import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz && > .brz-accordion__item:not(.brz-accordion__item--active):hover": {
      standart: [
        "cssStyleBoxShadow",
        "cssStyleBorder",
        "cssStyleColor",
        "cssStyleBgColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementAccordionPropertyHoverTransition"
      ]
    },
    ".brz && > .brz-accordion__item:hover": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz && > .brz-accordion__item.brz-accordion__item--active": {
      standart: [
        "cssStyleElementAccordionActiveColor",
        "cssStyleElementAccordionActiveBgColor",
        "cssStyleElementAccordionActiveBorder",
        "cssStyleElementAccordionActiveShadow"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementAccordionPropertyHoverTransition"
      ]
    },
    ".brz && > .brz-accordion__item > .brz-accordion__nav": {
      standart: ["cssStyleElementAccordionNavAlign"]
    },
    ".brz && > .brz-accordion__item > .brz-accordion__nav .brz-accordion__nav-title": {
      standart: [
        "cssStyleElementAccordionNavTextAlign",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing"
      ]
    },
    ".brz && > .brz-accordion__item > .brz-accordion__nav .brz-span": {
      standart: ["cssStyleElementAccordionNavTextAlign"]
    },
    ".brz && > .brz-accordion__item > .brz-accordion__nav .brz-accordion--icon-wrapper": {
      standart: [
        "cssStyleElementAccordionNavIconSpacing",
        "cssStyleElementAccordionNavIconSize"
      ]
    },
    ".brz && > .brz-accordion__item:not(:last-child)": {
      standart: ["cssStyleElementAccordionSpacing"]
    },
    ".brz &&:hover > .brz-accordion__item > .brz-accordion__content > .brz-accordion__item-content": {
      standart: [
        "cssStylePaddingFourFields",
        "cssStyleElementAccordionAnimDuration",
        "cssStyleElementAccordionMarginTop"
      ]
    },

    // Styles for filter
    ".brz && > .brz-accordion__filter-wrapper": {
      standart: [
        "cssStyleElementAccordionFilterHorizontalAlign",
        "cssStyleElementAccordion3FontFamily",
        "cssStyleElementAccordion3FontSize",
        "cssStyleElementAccordion3LineHeight",
        "cssStyleElementAccordion3FontWeight",
        "cssStyleElementAccordion3LetterSpacing"
      ]
    },

    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter": {
      standart: ["cssStyleElementAccordionFilterAfterSpacing"]
    },

    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item ": {
      standart: ["cssStyleElementAccordionFilterSpacing"]
    },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item:not(.brz-accordion__filter__item--active):hover": {
      standart: ["cssStyleElementAccordionFilterColor"]
    },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item--style-1:not(.brz-accordion__filter__item--active):hover": {
      standart: [
        "cssStyleElementAccordionFilterBgColor",
        "cssStyleElementAccordionFilterBorder",
        "cssStyleElementAccordionFilterBorderRadius",
        "cssStyleElementAccordionFilterShadow"
      ]
    },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item--style-1:hover": {
      standart: ["cssStyleElementAccordionFilterPaddingFourFields"]
    },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item--style-1.brz-accordion__filter__item--active": {
      standart: [
        "cssStyleElementAccordionFilterActiveColor",
        "cssStyleElementAccordionFilterActiveBgColor",
        "cssStyleElementAccordionFilterActiveBorder",
        "cssStyleElementAccordionFilterActiveShadow"
      ]
    },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter--style-2:hover": {
      standart: [
        "cssStyleElementAccordionFilterPaddingFourFields",
        "cssStyleElementAccordionFilterBgColor",
        "cssStyleElementAccordionFilterBorder",
        "cssStyleElementAccordionFilterShadow",
        "cssStyleElementAccordionFilterBorderRadius",
        "cssStyleDisplayInlineFlex"
      ]
    },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item--style-2.brz-accordion__filter__item--active": {
      standart: ["cssStyleElementAccordionFilterActiveColor"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleAnimation(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleAnimation",
        "cssStyleAnimationDuration",
        "cssStyleAnimationDelay"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
