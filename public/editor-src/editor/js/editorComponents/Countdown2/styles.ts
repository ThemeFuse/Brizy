import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz && .brz-countdown2-parts": {
      standart: ["cssStylePaddingBG"]
    },
    ".brz && .brz-countdown2__item": {
      standart: [
        "cssStyleBorderRadius",
        "cssStyleSizeHeightPxOnly",
        "cssStyleElementCountDown2SpacingRight",
        "cssStyleElementCountDown2SpacingLeft"
      ]
    },
    ".brz &&:hover .brz-countdown2__item": {
      standart: ["cssStyleBgColor", "cssStyleBorder", "cssStyleBoxShadow"]
    },
    ".brz &&:after": {
      standart: ["cssStyleSizeHeightPercentOnly"]
    },
    ".brz &&:before": {
      standart: ["cssStyleSizeHeightPercentOnly"]
    },
    ".brz && .brz-countdown2__number, .brz && .brz-countdown2-separator": {
      standart: [
        "cssStyleNumberTypography2FontFamily",
        "cssStyleNumberTypography2FontSize",
        "cssStyleNumberTypography2LineHeight",
        "cssStyleNumberTypography2FontWeight",
        "cssStyleNumberTypography2LetterSpacing",
        "cssStyleNumberTypography2FontVariation",
        "cssStyleNumberTypography2TextTransform"
      ]
    },
    ".brz &&:hover .brz-countdown2__number": {
      standart: ["cssStyleElementCountDown2NumberColor"]
    },
    ".brz &&:hover .brz-countdown2-separator": {
      standart: ["cssStyleElementCountDown2NumberColor"]
    },
    ".brz && .brz-countdown2__label": {
      standart: [
        "cssStyleTitleTypography2FontFamily",
        "cssStyleTitleTypography2FontSize",
        "cssStyleTitleTypography2LineHeight",
        "cssStyleTitleTypography2FontWeight",
        "cssStyleTitleTypography2LetterSpacing",
        "cssStyleTitleTypography2FontVariation",
        "cssStyleCountdownTitleTextTransform"
      ]
    },
    ".brz &&:hover .brz-countdown2__label": {
      standart: ["cssStyleElementCountDown2TitleColor"]
    },
    ".brz && .brz-countdown2__item, .brz && .brz-countdown2__number, .brz && .brz-countdown2-separator, .brz && .brz-countdown2__label":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}

export function styleMessage(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: [
        "cssStyleMessageTypography2FontFamily",
        "cssStyleMessageTypography2FontSize",
        "cssStyleMessageTypography2LineHeight",
        "cssStyleMessageTypography2FontWeight",
        "cssStyleMessageTypography2LetterSpacing",
        "cssStyleMessageTypography2FontVariation",
        "cssStyleCountdownMessageTextTransform",
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover": {
      standart: ["cssStyleElementCountDown2MessageColor"]
    }
  };

  return renderStyles({ ...data, styles });
}
