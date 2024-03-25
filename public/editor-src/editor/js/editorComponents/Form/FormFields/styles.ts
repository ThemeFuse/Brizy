import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(v: ElementModel, vs: ElementModel, vd: ElementModel) {
  const styles = {
    ".brz &&": {
      standart: [
        "cssStyleColor",
        "cssStyleTypographyFontFamily",
        "cssStyleTypographyFontSize",
        "cssStyleTypographyFontWeight",
        "cssStyleTypographyLetterSpacing",
        "cssStyleElementFormMargin"
      ]
    },
    ".brz && .brz-forms__item": {
      standart: ["cssStyleElementForm2Padding"]
    },
    ".brz && .brz-forms__field, .brz-control__select-current": {
      standart: ["cssStyleBgColor", "cssStyleBorder", "cssStyleBorderRadius"]
    },
    ".brz && .brz-control__select-current::placeholder": {
      standart: ["cssStyleColor"]
    },
    ".brz && .brz-forms__select-item__input": {
      standart: ["cssStyleColor"]
    },
    ".brz && .form-alert": {
      standart: ["cssStyleTypographyFontFamily"]
    },
    ".brz &&.brz-forms__item--error .brz-forms__field": {
      standart: ["cssStyleElementForm2FieldsBorderRequired"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
