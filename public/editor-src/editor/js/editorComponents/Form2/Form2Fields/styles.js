import { renderStyles } from "visual/utils/cssStyle";

export function styleFormFields(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing"
      ]
    },
    ".brz &&:hover .brz-forms2__field-label": {
      standart: [
        "cssStyleLabelColor",
        "cssStyleElementForm2FieldsLabelFontFamily",
        "cssStyleElementForm2FieldsLabelFontSize",
        "cssStyleElementForm2FieldsLabelFontWeight",
        "cssStyleElementForm2FieldsLabelLetterSpacing",
        "cssStyleElementForm2FieldsLabelAlign",
        "cssStyleElementForm2FieldsLabelLineHeight"
      ]
    },
    ".brz && .brz-forms2__field-label": {
      standart: ["cssStyleElementForm2FieldsLabelPadding"]
    },
    ".brz &&:hover .brz-forms2__field:not(.brz-forms2__radio):not(.brz-forms2__checkbox)": {
      standart: [
        "cssStyleColor",
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleBorderRadius",
        "cssStyleBoxShadow",
        "cssStyleElementForm2FieldsLineHeight"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&.brz-forms2__item--error .brz-forms2__field:not(.brz-forms2__radio):not(.brz-forms2__checkbox)": {
      standart: ["cssStyleElementForm2FieldsBorderRequired"]
    },
    ".brz && .brz-forms2__field:not(.brz-forms2__radio):not(.brz-forms2__checkbox):not(.brz-forms2__field-select)": {
      standart: ["cssStylePaddingFourFields"]
    },
    ".brz && .brz-forms2__field-paragraph": {
      standart: ["cssStyleTypography2LineHeight"]
    },
    ".brz &&:hover .brz-forms2__radio": {
      standart: [
        "cssStyleElementForm2FieldsCheckboxColor",
        "cssStyleElementForm2FieldsCheckboxFontFamily",
        "cssStyleElementForm2FieldsCheckboxFontSize",
        "cssStyleElementForm2FieldsCheckboxFontWeight",
        "cssStyleElementForm2FieldsCheckboxLetterSpacing",
        "cssStyleElementForm2FieldsCheckboxLineHeight"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-forms2__checkbox": {
      standart: [
        "cssStyleElementForm2FieldsCheckboxColor",
        "cssStyleElementForm2FieldsCheckboxFontFamily",
        "cssStyleElementForm2FieldsCheckboxFontSize",
        "cssStyleElementForm2FieldsCheckboxFontWeight",
        "cssStyleElementForm2FieldsCheckboxLetterSpacing",
        "cssStyleElementForm2FieldsCheckboxLineHeight"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-forms2__select-item__input": {
      standart: ["cssStyleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .form-alert": {
      standart: ["cssStyleTypographyFontFamily"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleFormSelect(v, vs, vd) {
  const styleSelectEdit = {
    ".brz && .brz-forms2__select-current": {
      standart: ["cssStylePaddingFourFields"]
    },
    ".brz &&:hover .brz-forms2__select-list": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleElementForm2FieldsSelectColor",
        "cssStyleElementForm2FieldsSelectBgColor",
        "cssStyleElementForm2FieldsSelectBorderRadius",
        "cssStyleElementForm2FieldsSelectBoxShadow"
      ]
    },
    ".brz &&:hover .brz-forms2__select-item:not(:last-child)": {
      standart: ["cssStyleElementForm2FieldsSelectBorder"]
    }
  };
  const styleSelectView = {
    ".brz &&:hover .select2-dropdown": {
      standart: ["cssStyleElementForm2FieldsSelectBoxShadow"]
    },
    ".brz &&:hover .select2-results__options": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleElementForm2FieldsSelectColor",
        "cssStyleElementForm2FieldsSelectBgColor",
        "cssStyleElementForm2FieldsSelectBorderRadius"
      ]
    },
    ".brz &&:hover .select2-results__option": {
      standart: ["cssStyleElementForm2FieldsSelectBorder"]
    },
    ".brz && .select2-selection--single": {
      standart: ["cssStylePaddingFourFields"]
    },
    ".brz && .select2-selection--multiple": {
      standart: ["cssStylePaddingFourFields"]
    },
    ".brz &&:hover .select2-selection--multiple .select2-selection__choice": {
      standart: ["cssStyleElementForm2FieldsSelectChoiceBgColor"],
      interval: ["cssStyleHoverTransition"]
    }
  };

  return renderStyles({
    v,
    vs,
    vd,
    styles: IS_EDITOR ? styleSelectEdit : styleSelectView
  });
}
