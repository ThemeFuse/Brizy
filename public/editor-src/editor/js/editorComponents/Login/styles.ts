import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&:hover .brz-login-form": {
      standart: ["cssStyleDisplayFlex", "cssStyleElementLoginFormMargin"]
    },
    ".brz &&:hover .brz-login__item-button": {
      standart: [
        "cssStyleDisplayFlex",
        "cssStyleMarginAlign",
        "cssStyleElementForm2SubmitWidth"
      ]
    },
    ".brz && .brz-login__authorized": {
      standart: ["cssStyleElementLoginAutorizedAlign"]
    },
    ".brz && .brz-login__authorized p,.brz && .brz-login__authorized a,.brz && .brz-login__authorized span":
      {
        standart: [
          "cssStyleElementLoginTextTypography2FontFamily",
          "cssStyleElementLoginTextTypography2FontSize",
          "cssStyleElementLoginTextTypography2LineHeight",
          "cssStyleElementLoginTextTypography2FontWeight",
          "cssStyleElementLoginTextTypography2LetterSpacing",
          "cssStyleElementLoginTextTypography2FontVariation",
          "cssStyleElementLoginTextTransform"
        ]
      },
    ".brz && .brz-login__authorized p:hover": {
      standart: ["cssStyleElementLoginTextColor"]
    },
    ".brz && .brz-login__authorized a:hover": {
      standart: ["cssStyleElementLoginLinkColor"]
    },
    ".brz && .brz-login__authorized span:hover": {
      standart: ["cssStyleElementLoginLinkColor"]
    },
    ".brz && .brz-login-form .brz-input:hover": {
      standart: [
        "cssStyleElementFieldsInputSize",
        "cssStyleColor",
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleBorderRadius",
        "cssStylePaddingFourFields",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms"
      ]
    },
    ".brz && .brz-login-form .brz-login-form__field": {
      standart: ["cssStyleElementLoginFieldPadding"]
    },
    ".brz && .brz-login-form .brz-login__field-label": {
      standart: ["cssStyleElementForm2FieldsLabelPadding"]
    },
    ".brz &&:hover .brz-login-form .brz-login__field-label": {
      standart: ["cssStyleLabelColor", "cssStyleElementForm2FieldsLabelAlign"]
    },
    ".brz &&:hover .brz-login-form .brz-login__field-label .brz-label": {
      standart: [
        "cssStyleElementForm2FieldsLabelFontFamily",
        "cssStyleElementForm2FieldsLabelFontSize",
        "cssStyleElementForm2FieldsLabelFontWeight",
        "cssStyleElementForm2FieldsLabelLetterSpacing",
        "cssStyleElementForm2FieldsLabelLineHeight",
        "cssStyleElementForm2FieldsLabelFontVariation",
        "cssStyleElementForm2FieldsLabelTextTransform"
      ]
    },
    ".brz && .brz-login-form .brz-login-form__field-lost-password:hover": {
      standart: [
        "cssStyleElementLoginLostPasswordColor",
        "cssStyleElementLoginLostPasswordTypography2FontFamily",
        "cssStyleElementLoginLostPasswordTypography2FontSize",
        "cssStyleElementLoginLostPasswordTypography2FontWeight",
        "cssStyleElementLoginLostPasswordTypography2LetterSpacing",
        "cssStyleElementLoginLostPasswordTypography2LineHeight",
        "cssStyleElementLoginLostPasswordTypography2FontVariation",
        "cssStyleElementLoginLostPasswordTextTransform",
        "cssStyleElementLoginLostPasswordAlign"
      ]
    },
    ".brz && .brz-login-form .brz-control__check-group-option:hover": {
      standart: [
        "cssStyleElementForm2FieldsCheckboxColor",
        "cssStyleElementForm2FieldsCheckboxFontFamily",
        "cssStyleElementForm2FieldsCheckboxFontSize",
        "cssStyleElementForm2FieldsCheckboxFontWeight",
        "cssStyleElementForm2FieldsCheckboxLetterSpacing",
        "cssStyleElementForm2FieldsCheckboxLineHeight",
        "cssStyleElementForm2FieldsCheckboxFontVariation",
        "cssStyleElementForm2FieldsCheckboxTextTransform",
        "cssStyleElementLoginRememberMeAlign"
      ]
    },
    ".brz && .brz-login-form .brz-login__register-info:hover": {
      standart: [
        "cssStyleElementLoginRegisterInfoTypography2FontFamily",
        "cssStyleElementLoginRegisterInfoTypography2FontSize",
        "cssStyleElementLoginRegisterInfoTypography2LineHeight",
        "cssStyleElementLoginRegisterInfoTypography2FontWeight",
        "cssStyleElementLoginRegisterInfoTypography2LetterSpacing",
        "cssStyleElementLoginRegisterInfoTypography2FontVariation",
        "cssStyleElementLoginRegisterInfoTextTransform",
        "cssStyleElementRegisterInfoColor",
        "cssStyleElementRegisterInfoAlign"
      ]
    },
    ".brz && .brz-login-form .brz-login-form__field-register-link:hover": {
      standart: [
        "cssStyleElementLoginRegisterLinkTypography2FontFamily",
        "cssStyleElementLoginRegisterLinkTypography2FontSize",
        "cssStyleElementLoginRegisterLinkTypography2LineHeight",
        "cssStyleElementLoginRegisterLinkTypography2FontWeight",
        "cssStyleElementLoginRegisterLinkTypography2LetterSpacing",
        "cssStyleElementLoginRegisterLinkTypography2FontVariation",
        "cssStyleElementLoginRegisterLinkTextTransform",
        "cssStyleElementLoginRegisterLinkColor",
        "cssStyleElementLoginRegisterLinkAlign"
      ]
    },
    ".brz && .brz-login-form .brz-login-form__field-login-link:hover": {
      standart: [
        "cssStyleElementLoginLoginLinkTypography2FontFamily",
        "cssStyleElementLoginLoginLinkTypography2FontSize",
        "cssStyleElementLoginLoginLinkTypography2LineHeight",
        "cssStyleElementLoginLoginLinkTypography2FontWeight",
        "cssStyleElementLoginLoginLinkTypography2LetterSpacing",
        "cssStyleElementLoginLoginLinkTypography2FontVariation",
        "cssStyleElementLoginLoginLinkTextTransform",
        "cssStyleElementLoginLoginLinkColor",
        "cssStyleElementLoginLoginLinkAlign"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
