import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover .brz-reset-psw-form": {
      standart: ["cssStyleDisplayFlex", "cssStyleElementLoginFormMargin"]
    },
    ".brz &&:hover .brz-reset-psw__item-button": {
      standart: [
        "cssStyleDisplayFlex",
        "cssStyleMarginAlign",
        "cssStyleElementForm2SubmitWidth"
      ]
    },
    ".brz && .brz-reset-psw-form .brz-input:hover": {
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
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms"
      ]
    },
    ".brz && .brz-reset-psw-form .brz-reset-psw-form__field": {
      standart: ["cssStyleElementLoginFieldPadding"]
    },
    ".brz && .brz-reset-psw-form .brz-reset-psw__field-label": {
      standart: ["cssStyleElementForm2FieldsLabelPadding"]
    },
    ".brz &&:hover .brz-reset-psw-form .brz-reset-psw__field-label": {
      standart: ["cssStyleLabelColor", "cssStyleElementForm2FieldsLabelAlign"]
    },
    ".brz &&:hover .brz-reset-psw-form .brz-reset-psw__field-label .brz-label":
      {
        standart: [
          "cssStyleElementForm2FieldsLabelFontFamily",
          "cssStyleElementForm2FieldsLabelFontSize",
          "cssStyleElementForm2FieldsLabelFontWeight",
          "cssStyleElementForm2FieldsLabelLetterSpacing",
          "cssStyleElementForm2FieldsLabelLineHeight",
          "cssStyleElementForm2FieldsLabelFontVariation",
          "cssStyleElementForm2FieldsLabelTextTransform"
        ]
      }
  };

  return renderStyles({ v, vs, vd, styles });
}
