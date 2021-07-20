import { renderStyles } from "visual/utils/cssStyle";
import { ElementModel } from "visual/component/Elements/Types";

export function styles(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): [string, string, string] {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz && .brz-protected-form": {
      standart: ["cssStyleElementProtectedPageInputSpacing"]
    },
    ".brz &&:hover .brz-protected-form__input": {
      standart: [
        "cssStyleBorderRadius",
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleElementProtectedPageInputWidth",
        "cssStyleElementProtectedPageInputHeight",
        "cssStyleBgColor",
        "cssStyleBgGradient"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementProtectedPagePropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-input": {
      standart: [
        "cssStyleColor",
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementProtectedPagePropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-input::placeholder": {
      standart: ["cssStyleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementProtectedPagePropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-input:-webkit-autofill": {
      standart: ["cssStyleElementProtectedPageAutocompleteColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementProtectedPagePropertyHoverTransition"
      ]
    }
  };
  // @ts-expect-error: RenderStyles will be in the next css generator
  return renderStyles({ v, vs, vd, styles });
}
