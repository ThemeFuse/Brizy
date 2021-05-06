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
    ".brz && .brz-form-login .brz-input:hover": {
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
    ".brz && .brz-form-login .brz-form-login__field-lost-password:hover": {
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
    },
    ".brz && .brz-form-login .brz-login__register-info:hover": {
      standart: [
        "cssStyleElementLoginRegisterInfoTypography2FontFamily",
        "cssStyleElementLoginRegisterInfoTypography2FontSize",
        "cssStyleElementLoginRegisterInfoTypography2LineHeight",
        "cssStyleElementLoginRegisterInfoTypography2FontWeight",
        "cssStyleElementLoginRegisterInfoTypography2LetterSpacing",
        "cssStyleElementRegisterInfoColor",
        "cssStyleElementRegisterInfoAlign"
      ]
    },
    ".brz && .brz-form-login .brz-form-login__field-register-link:hover": {
      standart: [
        "cssStyleElementLoginRegisterLinkTypography2FontFamily",
        "cssStyleElementLoginRegisterLinkTypography2FontSize",
        "cssStyleElementLoginRegisterLinkTypography2LineHeight",
        "cssStyleElementLoginRegisterLinkTypography2FontWeight",
        "cssStyleElementLoginRegisterLinkTypography2LetterSpacing",
        "cssStyleElementLoginRegisterLinkColor",
        "cssStyleElementLoginRegisterLinkAlign"
      ]
    },
    ".brz && .brz-form-login .brz-form-login__field-login-link:hover": {
      standart: [
        "cssStyleElementLoginLoginLinkTypography2FontFamily",
        "cssStyleElementLoginLoginLinkTypography2FontSize",
        "cssStyleElementLoginLoginLinkTypography2LineHeight",
        "cssStyleElementLoginLoginLinkTypography2FontWeight",
        "cssStyleElementLoginLoginLinkTypography2LetterSpacing",
        "cssStyleElementLoginLoginLinkColor",
        "cssStyleElementLoginLoginLinkAlign"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
