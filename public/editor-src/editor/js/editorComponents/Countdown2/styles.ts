import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz && .brz-countdown2-parts": {
      standart: ["cssStylePaddingBG"]
    },
    ".brz &&:hover .brz-countdown2__item": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleBorderRadius",
        "cssStyleSizeHeightPxOnly",
        "cssStyleElementCountDown2SpacingRight",
        "cssStyleElementCountDown2SpacingLeft"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover:after": {
      standart: ["cssStyleSizeHeightPercentOnly"]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleSizeHeightPercentOnly"]
    },
    ".brz &&:hover .brz-countdown2__number": {
      standart: [
        "cssStyleElementCountDown2NumberColor",
        "cssStyleNumberTypography2FontFamily",
        "cssStyleNumberTypography2FontSize",
        "cssStyleNumberTypography2LineHeight",
        "cssStyleNumberTypography2FontWeight",
        "cssStyleNumberTypography2LetterSpacing",
        "cssStyleNumberTypography2FontVariation",
        "cssStyleNumberTypography2TextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-countdown2-separator": {
      standart: [
        "cssStyleElementCountDown2NumberColor",
        "cssStyleNumberTypography2FontFamily",
        "cssStyleNumberTypography2FontSize",
        "cssStyleNumberTypography2LineHeight",
        "cssStyleNumberTypography2FontWeight",
        "cssStyleNumberTypography2LetterSpacing",
        "cssStyleNumberTypography2FontVariation",
        "cssStyleNumberTypography2TextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-countdown2__label": {
      standart: [
        "cssStyleElementCountDown2TitleColor",
        "cssStyleTitleTypography2FontFamily",
        "cssStyleTitleTypography2FontSize",
        "cssStyleTitleTypography2LineHeight",
        "cssStyleTitleTypography2FontWeight",
        "cssStyleTitleTypography2LetterSpacing",
        "cssStyleTitleTypography2FontVariation",
        "cssStyleCountdownTitleTextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleMessage(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementCountDown2MessageColor",
        "cssStyleMessageTypography2FontFamily",
        "cssStyleMessageTypography2FontSize",
        "cssStyleMessageTypography2LineHeight",
        "cssStyleMessageTypography2FontWeight",
        "cssStyleMessageTypography2LetterSpacing",
        "cssStyleMessageTypography2FontVariation",
        "cssStyleCountdownMessageTextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
