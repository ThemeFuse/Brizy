import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz && .brz-filters__wrapper": {
      standart: ["cssStyleElementFiltersOptionWidth"]
    },
    ".brz && .brz-filters__title:hover": {
      standart: [
        "cssStyleElementFiltersTitleTypography2FontFamily",
        "cssStyleElementFiltersTitleTypography2FontSize",
        "cssStyleElementFiltersTitleTypography2FontWeight",
        "cssStyleElementFiltersTitleTypography2LetterSpacing",
        "cssStyleElementFiltersTitleTypography2LineHeight",
        "cssStyleElementFiltersTitleColor",
        "cssStyleElementFiltersTitleSpacing",
        "cssStyleFlexHorizontalAlign"
      ]
    },
    ".brz && .brz-filters__option": {
      standart: [
        "cssStyleElementFiltersCheckboxColumns",
        "cssStyleElementFiltersCheckboxColumnsCustomStyles",
        "cssStyleElementFiltersActiveColumns"
      ]
    },
    ".brz && .brz-filters__checkbox-option:hover": {
      standart: IS_EDITOR
        ? [
            "cssStyleElementFiltersCheckboxTextColor",
            "cssStyleElementFiltersCheckboxBgColor",
            "cssStyleElementFiltersCheckboxBorder",
            "cssStyleElementFiltersCheckboxShadow",
            "cssStyleElementFiltersCheckTypography2FontFamily",
            "cssStyleElementFiltersCheckTypography2FontSize",
            "cssStyleElementFiltersCheckTypography2FontWeight",
            "cssStyleElementFiltersCheckTypography2LetterSpacing",
            "cssStyleElementFiltersCheckTypography2LineHeight",
            "cssStyleElementFiltersPaddingCheckbox",
            "cssStyleElementFiltersCheckboxBorderRadius",
            "cssStyleElementFiltersCheckboxOrientationFull",
            "cssStyleElementFiltersCheckboxFullAlign"
          ]
        : [
            "cssStyleElementFiltersCheckTypography2FontFamily",
            "cssStyleElementFiltersCheckTypography2FontSize",
            "cssStyleElementFiltersCheckTypography2FontWeight",
            "cssStyleElementFiltersCheckTypography2LetterSpacing",
            "cssStyleElementFiltersCheckTypography2LineHeight",
            "cssStyleElementFiltersCheckboxOrientationFull",
            "cssStyleElementFiltersCheckboxFullAlign"
          ]
    },
    ".brz && .brz-filters__checkbox-option:hover .brz-label": {
      standart: IS_PREVIEW
        ? [
            "cssStyleElementFiltersCheckboxTextColor",
            "cssStyleElementFiltersCheckboxBgColor",
            "cssStyleElementFiltersCheckboxBorder",
            "cssStyleElementFiltersCheckboxShadow",
            "cssStyleElementFiltersPaddingCheckbox",
            "cssStyleElementFiltersCheckboxBorderRadius"
          ]
        : []
    },
    ".brz && .brz-filters__radio-option:hover": {
      standart: IS_EDITOR
        ? [
            "cssStyleElementFiltersCheckboxTextColor",
            "cssStyleElementFiltersCheckboxBgColor",
            "cssStyleElementFiltersCheckboxBorder",
            "cssStyleElementFiltersCheckboxShadow",
            "cssStyleElementFiltersCheckTypography2FontFamily",
            "cssStyleElementFiltersCheckTypography2FontSize",
            "cssStyleElementFiltersCheckTypography2FontWeight",
            "cssStyleElementFiltersCheckTypography2LetterSpacing",
            "cssStyleElementFiltersCheckTypography2LineHeight",
            "cssStyleElementFiltersPaddingCheckbox",
            "cssStyleElementFiltersCheckboxBorderRadius",
            "cssStyleElementFiltersCheckboxOrientationFull",
            "cssStyleElementFiltersCheckboxFullAlign"
          ]
        : [
            "cssStyleElementFiltersCheckTypography2FontFamily",
            "cssStyleElementFiltersCheckTypography2FontSize",
            "cssStyleElementFiltersCheckTypography2FontWeight",
            "cssStyleElementFiltersCheckTypography2LetterSpacing",
            "cssStyleElementFiltersCheckTypography2LineHeight",
            "cssStyleElementFiltersCheckboxOrientationFull",
            "cssStyleElementFiltersCheckboxFullAlign"
          ]
    },
    ".brz && .brz-filters__radio-option:hover .brz-label": {
      standart: IS_PREVIEW
        ? [
            "cssStyleElementFiltersCheckboxTextColor",
            "cssStyleElementFiltersCheckboxBgColor",
            "cssStyleElementFiltersCheckboxBorder",
            "cssStyleElementFiltersCheckboxShadow",
            "cssStyleElementFiltersPaddingCheckbox",
            "cssStyleElementFiltersCheckboxBorderRadius"
          ]
        : []
    },
    ".brz && .brz-filters__radio-option.brz-filters__radio-option--active:hover .brz-label": {
      standart: [
        "cssStyleElementFiltersCheckboxActiveTextColor",
        "cssStyleElementFiltersCheckboxActiveBgColor",
        "cssStyleElementFiltersCheckboxActiveBorder",
        "cssStyleElementFiltersCheckboxActiveShadow"
      ]
    },
    ".brz && .brz-filters__checkbox-option.brz-filters__checkbox-option--active:hover .brz-label": {
      standart: [
        "cssStyleElementFiltersCheckboxActiveTextColor",
        "cssStyleElementFiltersCheckboxActiveBgColor",
        "cssStyleElementFiltersCheckboxActiveBorder",
        "cssStyleElementFiltersCheckboxActiveShadow"
      ]
    },
    ".brz &&.brz-filters__select .brz-filters__option": {
      standart: ["cssStyleElementFiltersOptionSpacing"]
    },
    ".brz &&.brz-filters__select .brz-filters__wrapper": {
      standart: ["cssStyleElementFiltersOptionSpacingMinus"]
    },
    ".brz && .brz-filters__select-option:hover": {
      standart: [
        "cssStyleElementFiltersOptionsColor",
        "cssStyleElementFiltersOptionsBgColor",
        "cssStyleBoxShadow",
        "cssStyleElementFiltersOptionsBorder",
        "cssStyleElementFiltersOptionTypography2FontFamily",
        "cssStyleElementFiltersOptionTypography2FontSize",
        "cssStyleElementFiltersOptionTypography2FontWeight",
        "cssStyleElementFiltersOptionTypography2LetterSpacing",
        "cssStyleElementFiltersOptionTypography2LineHeight",
        "cssStyleElementFiltersPaddingOptions",
        "cssStyleElementFiltersOptionsBorderRadius"
      ]
    },
    ".brz && .brz-filters__select__dropdown:hover": {
      standart: [
        "cssStyleElementFiltersSelectOptionShadow",
        "cssStyleElementFiltersOptionsBorder",
        "cssStyleElementFiltersOptionWidth"
      ]
    },
    ".brz && .brz-filters__select__item:hover": {
      standart: [
        "cssStyleElementFiltersSelectOptionTypography2FontFamily",
        "cssStyleElementFiltersSelectOptionTypography2FontSize",
        "cssStyleElementFiltersSelectOptionTypography2FontWeight",
        "cssStyleElementFiltersSelectOptionTypography2LetterSpacing",
        "cssStyleElementFiltersSelectOptionTypography2LineHeight",
        "cssStyleElementFiltersSelectOptionColor",
        "cssStyleElementFiltersSelectOptionBgColor",
        "cssStyleElementFiltersPaddingSelectItems"
      ]
    },
    ".brz && .brz-filters__select__item:not(:last-child):hover": {
      standart: ["cssStyleElementFiltersSelectOptionBorder"]
    },
    ".brz && .brz-filters__search-option:hover": {
      standart: [
        "cssStyleElementFiltersOptionsColor",
        "cssStyleElementFiltersOptionsBgColor",
        "cssStyleBoxShadow",
        "cssStyleElementFiltersOptionsBorder",
        "cssStyleElementFiltersOptionTypography2FontFamily",
        "cssStyleElementFiltersOptionTypography2FontSize",
        "cssStyleElementFiltersOptionTypography2FontWeight",
        "cssStyleElementFiltersOptionTypography2LetterSpacing",
        "cssStyleElementFiltersOptionTypography2LineHeight",
        "cssStyleElementFiltersPaddingOptions",
        "cssStyleElementFiltersOptionsBorderRadius"
      ]
    },
    ".brz &&.brz-filters__date .brz-filters__date--wrapper": {
      standart: ["cssStyleElementFiltersOptionSpacing"]
    },
    ".brz &&.brz-filters__date .brz-filters__wrapper": {
      standart: ["cssStyleElementFiltersOptionSpacingMinus"]
    },
    ".brz && .brz-filters__date-option:hover": {
      standart: [
        "cssStyleElementFiltersOptionsColor",
        "cssStyleElementFiltersOptionsBgColor",
        "cssStyleBoxShadow",
        "cssStyleElementFiltersOptionsBorder",
        "cssStyleElementFiltersOptionTypography2FontFamily",
        "cssStyleElementFiltersOptionTypography2FontSize",
        "cssStyleElementFiltersOptionTypography2FontWeight",
        "cssStyleElementFiltersOptionTypography2LetterSpacing",
        "cssStyleElementFiltersOptionTypography2LineHeight",
        "cssStyleElementFiltersPaddingOptions",
        "cssStyleElementFiltersOptionsBorderRadius"
      ]
    },
    ".brz && .brz-filters__option.brz-filters__date-option": {
      standart: ["cssStyleElementFiltersDateOptionWidthFix"]
    },
    ".brz && .brz-filters__checkbox-option, .brz && .brz-filters__radio-option": {
      standart: [
        "cssStyleElementFiltersCheckRadioWidth",
        "cssStyleFlexHorizontalAlignOption",

        "cssStyleElementFiltersCheckboxBorderRadiusCustomStyles",
        "cssStyleElementFiltersPaddingCheckboxCustomStyles",
        "cssStyleElementFiltersCheckColor3",

        "cssStyleElementFiltersCheckImgHeight",
        "cssStyleElementFiltersCheckImgWidth"
      ]
    },
    ".brz && .brz-filters__checkbox-option:hover .brz-control__check-group-icon .brz-icon-svg": {
      standart: [
        "cssStyleElementFiltersCheckboxTextColor",
        "cssStyleElementFiltersCheckIconColor",
        "cssStyleElementFiltersCheckSize",
        "cssStyleElementFiltersCheckIconBorder",
        "cssStyleElementFiltersCheckIconBorderRadius",
        "cssStyleElementFiltersCheckIconShadow"
      ]
    },
    ".brz && .brz-filters__checkbox-option--active .brz-control__check-group-icon .brz-icon-svg": {
      standart: [
        "cssStyleElementFiltersActiveCheckIconColor",
        "cssStyleElementFiltersActiveCheckIconBorder",
        "cssStyleElementFiltersActiveCheckIconShadow"
      ]
    },
    ".brz && .brz-filters__radio-option:hover .brz-control__radio-check": {
      standart: [
        "cssStyleElementFiltersCheckboxTextColor",
        "cssStyleElementFiltersCheckIconColor",
        "cssStyleElementFiltersCheckSize",
        "cssStyleElementFiltersCheckIconBorder",
        "cssStyleElementFiltersCheckIconBorderRadius",
        "cssStyleElementFiltersCheckIconShadow"
      ]
    },
    ".brz && .brz-filters__radio-option:hover .brz-control__radio-icon": {
      standart: [
        "cssStyleElementFiltersCheckboxTextColor",
        "cssStyleElementFiltersCheckIconColor",
        "cssStyleElementFiltersCheckSize",
        "cssStyleElementFiltersCheckIconBorder",
        "cssStyleElementFiltersCheckIconBorderRadius",
        "cssStyleElementFiltersCheckIconShadow"
      ]
    },
    ".brz && .brz-filters__radio-option--active .brz-control__radio--check": {
      standart: [
        "cssStyleElementFiltersActiveCheckIconColor",
        "cssStyleElementFiltersActiveCheckIconBorder",
        "cssStyleElementFiltersActiveCheckIconShadow"
      ]
    },
    ".brz && .brz-filters__container": {
      standart: ["cssStyleFlexHorizontalAlignOption"]
    },
    ".brz && .brz-filters__checkbox--style-1 .brz-filters__option, .brz && .brz-filters__radio--style-1 .brz-filters__option": {
      standart: ["cssStyleElementFiltersGapStyle1"]
    },
    ".brz && .brz-filters__checkbox--style-4 .brz-filters__option, .brz && .brz-filters__radio--style-4 .brz-filters__option, .brz && .brz-filters__checkbox--style-3 .brz-filters__option, .brz && .brz-filters__radio--style-3 .brz-filters__option": {
      standart: ["cssStyleElementFiltersGapStyle1"]
    },
    ".brz && .brz-filters__checkbox--style-2 .brz-filters__option, .brz && .brz-filters__radio--style-2 .brz-filters__option": {
      standart: ["cssStyleElementFiltersGapStyle1"]
    },
    ".brz && .brz-filters__checkbox, .brz && .brz-filters__radio": {
      standart: [
        "cssStyleElementFiltersCheckboxOrientation",
        "cssStyleElementFiltersCheckboxOrientationCustomStyles",
        "cssStyleFlexHorizontalAlignForInline",
        "cssStyleElementFiltersGapStyle1Revert"
      ]
    },
    ".brz && .brz-filters__checkbox-option-name, .brz && .brz-filters__radio-option-name": {
      standart: ["cssStyleElementFiltersSpacing"]
    },
    ".brz && .brz-filters__checkrange--text": {
      standart: ["cssStyleElementFiltersSpacing"]
    },
    ".brz && .brz-filters__tag:hover .brz-filters__tag__close-icon": {
      standart: [
        "cssStyleElementFiltersSpacing",
        "cssStyleElementFiltersCheckIconBorder",
        "cssStyleElementFiltersCheckIconShadow",
        "cssStyleElementFiltersCheckIconColor",
        "cssStyleElementFiltersCheckSize"
      ]
    },
    ".brz && .brz-filters__checkbox .brz-filters__option, .brz && .brz-filters__radio .brz-filters__option": {
      standart: ["cssStyleFlexHorizontalAlignOption"]
    },
    ".brz && .brz-filters__checkbox--style-3, .brz && .brz-filters__radio--style-3": {
      standart: ["cssStyleFlexHorizontalAlignOption"]
    },
    ".brz && .brz-filters__rating:hover": {
      standart: [
        "cssStyleFlexHorizontalAlignOption",
        "cssStyleElementFiltersRatingActiveColor"
      ]
    },
    ".brz && .brz-filters__option.brz-starrating-icon-wrap.brz-filters__rating-hover": {
      standart: ["cssStyleElementFiltersRatingHoverColor"]
    },
    ".brz && .brz-filters__rating--color-empty:hover": {
      standart: ["cssStyleElementFiltersRatingColor"]
    },
    ".brz && .brz-filters__rating--color-empty": {
      standart: ["cssStyleFlexHorizontalAlignOption"]
    },
    ".brz && .brz-filters__rating .brz-filters__option:not(:last-child)": {
      standart: ["cssStyleIconSpacing"]
    },
    ".brz && .brz-filters__rating--color, .brz && .brz-filters__rating--color-empty": {
      standart: ["cssStyleSizeFontSizeIcon"]
    },
    ".brz && .brz-filters__btn-wrapper": {
      standart: ["cssStyleFlexHorizontalAlignBtn"]
    },
    ".brz && .brz-filters__apply:hover": {
      standart: [
        "cssStyleElementFiltersBtnTypography2FontFamily",
        "cssStyleElementFiltersBtnTypography2FontSize",
        "cssStyleElementFiltersBtnTypography2FontWeight",
        "cssStyleElementFiltersBtnTypography2LetterSpacing",
        "cssStyleElementFiltersBtnTypography2LineHeight",
        "cssStyleElementFiltersBtnWidth",
        "cssStyleFlexHorizontalAlignBtn",
        "cssStyleBorderRadius",
        "cssStyleColor",
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleBoxShadow",
        "cssStylePaddingFourFields",
        "cssStyleElementFiltersBtnHeight",
        "cssStyleBorder",
        "cssStyleElementFiltersBtnSpacing"
      ]
    },
    ".brz && .brz-filters__tags": {
      standart: ["cssStyleFlexHorizontalAlignOption"]
    },
    ".brz && .brz-filters__tag:hover": {
      standart: [
        "cssStyleElementFiltersCheckboxTextColor",
        "cssStyleElementFiltersCheckboxBgColor",
        "cssStyleElementFiltersCheckboxBorder",
        "cssStyleElementFiltersCheckboxShadow",
        "cssStyleElementFiltersPaddingCheckbox",
        "cssStyleElementFiltersCheckboxBorderRadius",
        "cssStyleElementFiltersActiveWidth",
        "cssStyleElementFiltersCheckTypography2FontFamily",
        "cssStyleElementFiltersCheckTypography2FontSize",
        "cssStyleElementFiltersCheckTypography2FontWeight",
        "cssStyleElementFiltersCheckTypography2LetterSpacing",
        "cssStyleElementFiltersCheckTypography2LineHeight"
      ]
    },
    ".brz && .brz-filters__active-filters": {
      standart: [
        "cssStyleElementFiltersActiveOrientation",
        "cssStyleElementFiltersGapStyle1Revert",
        "cssStyleFlexHorizontalAlignForActiveInline"
      ]
    },
    ".brz && .brz-filters__active-filters .brz-filters__option": {
      standart: [
        "cssStyleElementFiltersGapStyle1",
        "cssStyleFlexHorizontalAlignOption"
      ]
    },
    ".brz && .brz-filters__date": {
      standart: ["cssStyleElementFiltersDateOptionWidth"]
    },
    ".brz && .brz-filters__date:first-child": {
      standart: ["cssStyleElementFiltersDateSpacing"]
    },
    ".brz && .brz-filters__date--label:hover": {
      standart: [
        "cssStyleElementFiltersLabelTypography2FontFamily",
        "cssStyleElementFiltersLabelTypography2FontSize",
        "cssStyleElementFiltersLabelTypography2FontWeight",
        "cssStyleElementFiltersLabelTypography2LetterSpacing",
        "cssStyleElementFiltersLabelTypography2LineHeight",
        "cssStyleElementFiltersLabelColor",
        "cssStyleElementFiltersLabelSpacing",
        "cssStyleFlexHorizontalAlignLabel"
      ]
    },
    ".brz && .brz-filters__counter": {
      standart: ["cssStyleElementFiltersCheckboxCounterFullPosition"]
    },
    ".brz && .brz-filters__range__text:hover": {
      standart: [
        "cssStyleElementFiltersLabelTypography2FontFamily",
        "cssStyleElementFiltersLabelTypography2FontSize",
        "cssStyleElementFiltersLabelTypography2FontWeight",
        "cssStyleElementFiltersLabelTypography2LetterSpacing",
        "cssStyleElementFiltersLabelTypography2LineHeight",
        "cssStyleElementFiltersLabelColor",
        "cssStyleElementFiltersLabelSpacing",
        "cssStyleFlexHorizontalAlignLabel"
      ]
    },
    ".brz && .brz-filters__range--wrapper": {
      standart: ["cssStyleElementFiltersRangeWrapperHeight"]
    },
    ".brz && .brz-filters__range__slider": {
      standart: [
        "cssStyleElementFiltersRangeStrokeBorderHeight",
        "cssStyleElementFiltersRangeStrokeBorder",
        "cssStyleElementFiltersOptionsBorderRadius",
        "cssStyleElementFiltersRangeBorder"
      ]
    },
    ".brz && .brz-filters__range--slider": {
      standart: [
        "cssStyleElementFiltersRangeStrokeBorderHeight",
        "cssStyleElementFiltersRangeStrokeBorder",
        "cssStyleElementFiltersOptionsBorderRadius",
        "cssStyleElementFiltersRangeBorder",
        "cssStyleElementFiltersRangeStrokeMargin"
      ]
    },
    ".brz && .brz-filters__range__slider--active": {
      standart: [
        "cssStyleElementFiltersRangeStrokeBorderActive",
        "cssStyleElementFiltersRangeStrokeBorderHeight"
      ]
    },
    ".brz && .brz-filters__range--slider .brz-filters__range--range": {
      standart: ["cssStyleElementFiltersRangeStrokeBorderActive"]
    },
    ".brz && .brz-filters__range--inputs": {
      standart: [
        "cssStyleElementFiltersOptionWidth",
        "cssStyleElementFiltersRangeInputsHeight"
      ]
    },
    ".brz && input[type=range].brz-filters__range--inputs::-webkit-slider-thumb": {
      standart: ["cssStyleElementFiltersRangeInputsPointsHeight"]
    },
    ".brz && .brz-filters__range__slider-handle": {
      standart: [
        "cssStyleElementFiltersRangePointsBorder",
        "cssStyleElementFiltersRangePointsBorderHeight",
        "cssStyleElementFiltersRangeBorder"
      ]
    },
    ".brz && .brz-filters__range--slider .brz-filters__range--thumb": {
      standart: [
        "cssStyleElementFiltersRangePointsBorder",
        "cssStyleElementFiltersRangePointsBorderHeight",
        "cssStyleElementFiltersRangeBorder"
      ]
    },
    ".brz && .brz-filters__range--slider .brz-filters__range--thumb.brz-filters__range--thumb--left": {
      standart: ["cssStyleElementFiltersRangePointsTransition"]
    },
    ".brz && .brz-filters__range--slider .brz-filters__range--thumb.brz-filters__range--thumb--right": {
      standart: ["cssStyleElementFiltersRangePointsTransitionRight"]
    },
    ".brz &&.brz-filters.brz-filters__hierarchical .brz-filters__option:nth-last-of-type(2)": {
      standart: ["cssStyleElementFiltersHierarchicalSpacing"]
    },
    ".brz &&.brz-filters.brz-filters__hierarchical .brz-filters__option:last-of-type": {
      standart: ["cssStyleElementFiltersHierarchicalSpacing2X"]
    },
    ".brz && .brz-filters__select .select2-selection:hover": {
      standart: IS_PREVIEW
        ? [
            "cssStyleElementFiltersOptionsBgColor",
            "cssStyleElementFiltersOptionsColor",
            "cssStyleElementFiltersOptionsBorder",
            "cssStyleElementFiltersSelect2BorderRadius",
            "cssStyleBoxShadow",
            "cssStyleElementFiltersPaddingOptions"
          ]
        : []
    },
    ".brz && .brz-filters__select .select2-results__options:hover": {
      standart: [
        "cssStyleElementFiltersSelectOptionColor",
        "cssStyleElementFiltersSelectOptionBgColor",
        "cssStyleElementFiltersPaddingOptions"
      ]
    },
    ".brz && .brz-filters__select .select2-results__options .select2-results__option:hover": {
      standart: [
        "cssStyleElementFiltersPaddingSelectItems",
        "cssStyleElementFiltersSelectOptionColor",
        "cssStyleElementFiltersSelectOptionBgColor",
        "cssStyleElementFiltersSelectOptionTypography2FontFamily",
        "cssStyleElementFiltersSelectOptionTypography2FontSize",
        "cssStyleElementFiltersSelectOptionTypography2FontWeight",
        "cssStyleElementFiltersSelectOptionTypography2LetterSpacing",
        "cssStyleElementFiltersSelectOptionTypography2LineHeight"
      ]
    },
    ".brz && .brz-filters__select .select2-selection__rendered": {
      standart: [
        "cssStyleElementFiltersOptionTypography2FontFamily",
        "cssStyleElementFiltersOptionTypography2FontSize",
        "cssStyleElementFiltersOptionTypography2FontWeight",
        "cssStyleElementFiltersOptionTypography2LetterSpacing",
        "cssStyleElementFiltersOptionTypography2LineHeight"
      ]
    },
    ".brz && .brz-filters__select": {
      standart: [
        "cssStyleElementFiltersOptionTypography2FontFamily",
        "cssStyleElementFiltersOptionTypography2FontSize",
        "cssStyleElementFiltersOptionTypography2FontWeight",
        "cssStyleElementFiltersOptionTypography2LetterSpacing",
        "cssStyleElementFiltersOptionTypography2LineHeight"
      ]
    },
    ".brz && .brz-filters__select .select2-results__options .select2-results__option:not(:last-child):hover": {
      standart: ["cssStyleElementFiltersSelectOptionBorder"]
    },
    ".brz && .brz-filters__select .select2-results__option--highlighted": {
      standart: ["cssStyleElementFiltersSelectOptionsColors"]
    },
    ".brz && .brz-filters__select .select2-selection .select2-selection__arrow": {
      standart: ["cssStyleElementFiltersSelectArrow"]
    },
    ".brz && .brz-filters__select:not(:last-child)": {
      standart: IS_PREVIEW ? ["cssStyleElementFiltersOptionSpacing"] : []
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
