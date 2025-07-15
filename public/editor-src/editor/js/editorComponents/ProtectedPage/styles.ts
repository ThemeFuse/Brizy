import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function styles(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz && .brz-protected-form": {
      standart: ["cssStyleElementProtectedPageInputSpacing"]
    },
    ".brz && .brz-protected-form__input": {
      standart: [
        "cssStyleBorderRadius",
        "cssStyleElementProtectedPageInputWidth",
        "cssStyleElementProtectedPageInputHeight"
      ]
    },
    ".brz &&:hover .brz-protected-form__input": {
      standart: [
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleBgColor",
        "cssStyleBgGradient"
      ]
    },
    ".brz && .brz-input": {
      standart: [
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3TextTransform"
      ]
    },
    ".brz &&:hover .brz-input": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover .brz-input::placeholder": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover .brz-input:-webkit-autofill": {
      standart: ["cssStyleElementProtectedPageAutocompleteColor"]
    },
    ".brz && .brz-protected-form__input, .brz && .brz-input, .brz && .brz-input::placeholder, .brz && .brz-input:-webkit-autofill":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}
