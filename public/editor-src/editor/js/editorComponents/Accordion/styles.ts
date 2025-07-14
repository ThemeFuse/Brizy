import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";

export function style<T extends ElementModel>(
  data: DynamicStylesProps<T>
): OutputStyle {
  const styles: Styles = {
    ".brz && > .brz-accordion__item:not(.brz-accordion__item--active):hover": {
      standart: ["cssStyleBoxShadow", "cssStyleBorder", "cssStyleBgColor"]
    },
    ".brz && > .brz-accordion__item:not(.brz-accordion__item--active):hover .brz-accordion__nav":
      {
        standart: ["cssStyleColor"]
      },
    ".brz && > .brz-accordion__item": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz && > .brz-accordion__item.brz-accordion__item--active": {
      standart: [
        "cssStyleElementAccordionActiveBgColor",
        "cssStyleElementAccordionActiveBorder",
        "cssStyleElementAccordionActiveShadow"
      ]
    },
    ".brz && > .brz-accordion__item.brz-accordion__item--active > .brz-accordion__nav":
      {
        standart: ["cssStyleElementAccordionActiveColor"]
      },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item:not(.brz-accordion__filter__item--active):hover":
      {
        standart: ["cssStyleElementAccordionFilterColor"]
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
    ".brz && > .brz-accordion__item > .brz-accordion__content > .brz-accordion__item-content":
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
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item--style-1:not(.brz-accordion__filter__item--active):hover":
      {
        standart: [
          "cssStyleElementAccordionFilterBgColor",
          "cssStyleElementAccordionFilterBorder",
          "cssStyleElementAccordionFilterShadow"
        ]
      },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item--style-1":
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
        ]
      },
    ".brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item--style-2.brz-accordion__filter__item--active":
      { standart: ["cssStyleElementAccordionFilterActiveColor"] },
    ".brz && > .brz-accordion__item:not(.brz-accordion__item--active), .brz && > .brz-accordion__item:not(.brz-accordion__item--active) .brz-accordion__nav, .brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter__item:not(.brz-accordion__filter__item--active), .brz && > .brz-accordion__filter-wrapper > .brz-accordion__filter > .brz-accordion__filter--style-2":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };
  return renderStyles<T>({ ...data, styles });
}

export function styleAnimation<T extends ElementModel>(
  data: DynamicStylesProps<T>
): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleAnimationAll"]
    }
  };

  return renderStyles<T>({ ...data, styles });
}
