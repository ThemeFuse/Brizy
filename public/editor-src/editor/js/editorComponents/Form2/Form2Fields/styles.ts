import { isEditor } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function styleFormFields(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation"
      ]
    },
    ".brz &&:hover": {
      standart: ["cssStyleColor"]
    },
    ".brz && ~ .brz-forms2__alert": {
      standart: ["cssStyleTypography2FontFamily"]
    },
    ".brz && .brz-forms2__field": {
      standart: ["cssStyleTextTransforms"]
    },
    ".brz &&:hover .brz-forms2__field-label": {
      standart: ["cssStyleLabelColor"]
    },
    ".brz && .brz-forms2__field-label": {
      standart: [
        "cssStyleElementForm2FieldsLabelPadding",
        "cssStyleElementForm2FieldsLabelFontFamily",
        "cssStyleElementForm2FieldsLabelFontSize",
        "cssStyleElementForm2FieldsLabelFontWeight",
        "cssStyleElementForm2FieldsLabelLetterSpacing",
        "cssStyleElementForm2FieldsLabelAlign",
        "cssStyleElementForm2FieldsLabelLineHeight",
        "cssStyleElementForm2FieldsLabelFontVariation",
        "cssStyleElementForm2FieldsLabelTextTransform"
      ]
    },
    ".brz && .brz-forms2__field:not(.brz-forms2__radio):not(.brz-forms2__checkbox)":
      {
        standart: [
          "cssStyleBorderRadius",
          "cssStyleElementForm2FieldsLineHeight"
        ]
      },
    ".brz &&:hover .brz-forms2__field:not(.brz-forms2__radio):not(.brz-forms2__checkbox)":
      {
        standart: [
          "cssStyleColor",
          "cssStyleBgColor",
          "cssStyleBorder",
          "cssStyleBoxShadow"
        ]
      },
    ".brz &&.brz-forms2__item--error .brz-forms2__field:not(.brz-forms2__radio):not(.brz-forms2__checkbox)":
      {
        standart: ["cssStyleElementForm2FieldsBorderRequired"]
      },
    ".brz && .brz-forms2__field:not(.brz-forms2__radio):not(.brz-forms2__checkbox):not(.brz-forms2__field-select)":
      {
        standart: ["cssStyleElementFieldsInputSize"]
      },
    ".brz && .brz-forms2__field-paragraph": {
      standart: ["cssStyleTypography2LineHeight"]
    },
    ".brz && .brz-forms2__radio, .brz && .brz-forms2__checkbox": {
      standart: [
        "cssStyleElementForm2FieldsCheckboxFontFamily",
        "cssStyleElementForm2FieldsCheckboxFontSize",
        "cssStyleElementForm2FieldsCheckboxFontWeight",
        "cssStyleElementForm2FieldsCheckboxLetterSpacing",
        "cssStyleElementForm2FieldsCheckboxLineHeight",
        "cssStyleElementForm2FieldsCheckboxFontVariation",
        "cssStyleElementForm2FieldsCheckboxTextTransform"
      ]
    },
    ".brz &&:hover .brz-forms2__radio, .brz && .brz-forms2__checkbox": {
      standart: ["cssStyleElementForm2FieldsCheckboxColor"]
    },
    ".brz && .brz-forms2__checkbox-option-name,.brz-forms2__radio-option-name":
      {
        standart: ["cssStyleElementForm2FieldsCheckboxTextTransform"]
      },
    ".brz &&:hover .brz-forms2__select-item__input": {
      standart: ["cssStyleColor"]
    },
    ".brz && .form-alert": {
      standart: ["cssStyleTypography2FontFamily"]
    },
    ".brz && .brz-forms2__field:not(.brz-forms2__radio):not(.brz-forms2__checkbox), .brz && .brz-forms2__radio, .brz && .brz-forms2__checkbox, .brz && .brz-forms2__select-item__input":
      {
        standart: ["cssStyleHoverTransition"]
      }
  };

  return renderStyles({ ...data, styles });
}

export function styleFormSelect(data: DynamicStylesProps<Value>): OutputStyle {
  const { renderContext } = data.contexts;
  const styleSelectEdit = {
    ".brz && .brz-forms2__select-current": {
      standart: ["cssStylePaddingFourFields", "cssStyleElementFieldsInputSize"]
    },
    ".brz && .brz-forms2__select-list": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms",
        "cssStyleElementForm2FieldsSelectBorderRadius"
      ]
    },
    ".brz &&:hover .brz-forms2__select-list": {
      standart: [
        "cssStyleElementForm2FieldsSelectColor",
        "cssStyleElementForm2FieldsSelectBgColor",
        "cssStyleElementForm2FieldsSelectBoxShadow"
      ]
    },
    ".brz &&:hover .brz-forms2__select-item": {
      standart: ["cssStyleElementForm2FieldsSelectBorder"]
    }
  };
  const styleSelectView = {
    ".brz &&:hover .select2-dropdown": {
      standart: ["cssStyleElementForm2FieldsSelectBoxShadow"]
    },
    ".brz && .select2-results__options": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms",
        "cssStyleElementForm2FieldsSelectBorderRadius"
      ]
    },
    ".brz &&:hover .select2-results__options": {
      standart: [
        "cssStyleElementForm2FieldsSelectColor",
        "cssStyleElementForm2FieldsSelectBgColor"
      ]
    },
    ".brz &&:hover .select2-results__option": {
      standart: ["cssStyleElementForm2FieldsSelectBorder"]
    },
    ".brz && .select2-selection--single": {
      standart: ["cssStylePaddingFourFields", "cssStyleElementFieldsInputSize"]
    },
    ".brz && .select2-selection--multiple": {
      standart: ["cssStylePaddingFourFields", "cssStyleElementFieldsInputSize"]
    },
    ".brz && .select2-selection--multiple .select2-selection__choice": {
      standart: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .select2-selection--multiple .select2-selection__choice": {
      standart: ["cssStyleElementForm2FieldsSelectChoiceBgColor"]
    }
  };

  return renderStyles({
    ...data,
    styles: isEditor(renderContext) ? styleSelectEdit : styleSelectView
  });
}
