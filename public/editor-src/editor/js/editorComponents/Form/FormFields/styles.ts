import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&": {
      standart: [
        "cssStyleColor",
        "cssStyleTypographyFontFamily",
        "cssStyleTypographyFontSize",
        "cssStyleTypographyFontWeight",
        "cssStyleTypographyLetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms",
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

  return renderStyles({ ...data, styles });
}
