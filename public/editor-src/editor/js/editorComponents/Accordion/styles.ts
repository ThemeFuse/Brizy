import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./toolbarExtend";

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
    ".brz && > .brz-accordion__item:not(.brz-accordion__item--active):hover": {
      standart: [
        "cssStyleBoxShadow",
        "cssStyleBorder",
        "cssStyleColor",
        "cssStyleBgColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && > .brz-accordion__item > .brz-accordion__nav": {
      standart: [
        "cssStyleElementAccordionNavAlign",
        "cssStyleElementAccordionTitlePadding"
      ]
    },
    ".brz && > .brz-accordion__item > .brz-accordion__nav .brz-accordion__nav-title":
      {
        standart: [
          "cssStyleTextAlign",
          "cssStyleTypography2FontFamily",
          "cssStyleTypography2FontSize",
          "cssStyleTypography2LineHeight",
          "cssStyleTypography2FontWeight",
          "cssStyleTypography2LetterSpacing",
          "cssStyleTypography2FontVariation",
          "cssStyleTextTransforms"
        ]
      },
    ".brz && > .brz-accordion__item .brz-accordion-icon": {
      standart: ["cssStyleElementAccordionNavIconSpacing"]
    },
    ".brz && > .brz-accordion__item > .brz-accordion__nav .brz-accordion-icon":
      { standart: ["cssStyleElementAccordionNavIconSize"] },
    ".brz && > .brz-accordion__item:not(:last-child)": {
      standart: ["cssStyleElementAccordionSpacing"]
    },
    ".brz &&:hover > .brz-accordion__item > .brz-accordion__content > .brz-accordion__item-content":
      {
        standart: [
          "cssStylePaddingFourFields",
          "cssStyleElementAccordionAnimDuration",
          "cssStyleElementAccordionMarginTop"
        ]
      },

    // Styles for filter
    ".brz && > .brz-accordion__filter-wrapper": {
      standart: ["cssStyleElementAccordionFilterHorizontalAlign"]
    },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter": {
      standart: [
        "cssStyleElementAccordionFilterAfterSpacing",
        "cssStyleElementAccordion3FontFamily",
        "cssStyleElementAccordion3FontSize",
        "cssStyleElementAccordion3LineHeight",
        "cssStyleElementAccordion3FontWeight",
        "cssStyleElementAccordion3LetterSpacing",
        "cssStyleElementAccordion3FontVariation",
        "cssStyleElementAccordionFilterTextTransform"
      ]
    },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item":
      { standart: ["cssStyleElementAccordionFilterSpacing"] },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item:not(.brz-accordion__filter__item--active):hover":
      {
        standart: ["cssStyleElementAccordionFilterColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item--style-1:not(.brz-accordion__filter__item--active):hover":
      {
        standart: [
          "cssStyleElementAccordionFilterBgColor",
          "cssStyleElementAccordionFilterBorder",
          "cssStyleElementAccordionFilterShadow"
        ]
      },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item--style-1:hover":
      {
        standart: [
          "cssStyleElementAccordionFilterPaddingFourFields",
          "cssStyleElementAccordionFilterBorderRadius"
        ]
      },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item--style-1.brz-accordion__filter__item--active":
      {
        standart: [
          "cssStyleElementAccordionFilterActiveColor",
          "cssStyleElementAccordionFilterActiveBgColor",
          "cssStyleElementAccordionFilterActiveBorder",
          "cssStyleElementAccordionFilterActiveShadow"
        ]
      },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter--style-2:hover":
      {
        standart: [
          "cssStyleElementAccordionFilterPaddingFourFields",
          "cssStyleElementAccordionFilterBgColor",
          "cssStyleElementAccordionFilterBorder",
          "cssStyleElementAccordionFilterShadow",
          "cssStyleElementAccordionFilterBorderRadius",
          "cssStyleDisplayInlineFlex"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item--style-2.brz-accordion__filter__item--active":
      { standart: ["cssStyleElementAccordionFilterActiveColor"] }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleAnimation(
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
    ".brz &&:hover": {
      standart: ["cssStyleAnimationAll"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
