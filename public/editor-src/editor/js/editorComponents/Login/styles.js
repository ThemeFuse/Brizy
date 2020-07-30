import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover .brz-form-login": {
      standart: ["cssStyleDisplayFlex", "cssStyleElementLoginFormMargin"]
    },
    ".brz &&:hover .brz-login__item-button": {
      standart: [
        "cssStyleDisplayFlex",
        "cssStyleMarginAlign",
        "cssStyleElementForm2SubmitWidth"
      ]
    },
    ".brz && .brz-login__autorized": {
      standart: ["cssStyleElementLoginAutorizedAlign"]
    },
    ".brz && .brz-login__autorized p,.brz && .brz-login__autorized a": {
      standart: [
        "cssStyleElementLoginTextTypography2FontFamily",
        "cssStyleElementLoginTextTypography2FontSize",
        "cssStyleElementLoginTextTypography2LineHeight",
        "cssStyleElementLoginTextTypography2FontWeight",
        "cssStyleElementLoginTextTypography2LetterSpacing"
      ]
    },
    ".brz && .brz-login__autorized p:hover": {
      standart: ["cssStyleElementLoginTextColor"]
    },
    ".brz && .brz-login__autorized a:hover": {
      standart: ["cssStyleElementLoginLinkColor"]
    },
    ".brz &&:hover .brz-form-login .brz-input": {
      standart: [
        "cssStyleColor",
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleBorderRadius",
        "cssStylePaddingFourFields",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing"
      ]
    },
    ".brz && .brz-form-login .brz-form-login__field": {
      standart: ["cssStyleElementLoginFieldPadding"]
    },
    ".brz && .brz-form-login .brz-login__field-label": {
      standart: ["cssStyleElementForm2FieldsLabelPadding"]
    },
    ".brz &&:hover .brz-form-login .brz-login__field-label": {
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
    ".brz &&:hover .brz-form-login .brz-form-login__field-lost-password a": {
      standart: [
        "cssStyleElementLoginLostPasswordColor",
        "cssStyleElementLoginLostPasswordTypography2FontFamily",
        "cssStyleElementLoginLostPasswordTypography2FontSize",
        "cssStyleElementLoginLostPasswordTypography2FontWeight",
        "cssStyleElementLoginLostPasswordTypography2LetterSpacing",
        "cssStyleElementLoginLostPasswordTypography2LineHeight",
        "cssStyleElementLoginLostPasswordAlign"
      ]
    },
    ".brz &&:hover .brz-form-login .brz-control__check-group-option": {
      standart: [
        "cssStyleElementForm2FieldsCheckboxColor",
        "cssStyleElementForm2FieldsCheckboxFontFamily",
        "cssStyleElementForm2FieldsCheckboxFontSize",
        "cssStyleElementForm2FieldsCheckboxFontWeight",
        "cssStyleElementForm2FieldsCheckboxLetterSpacing",
        "cssStyleElementForm2FieldsCheckboxLineHeight"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
