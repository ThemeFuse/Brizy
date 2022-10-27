import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidth"]
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
        "cssStyleNumberTypography2LetterSpacing"
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
        "cssStyleNumberTypography2LetterSpacing"
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
        "cssStyleTitleTypography2LetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleMessage(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementCountDown2MessageColor",
        "cssStyleMessageTypography2FontFamily",
        "cssStyleMessageTypography2FontSize",
        "cssStyleMessageTypography2LineHeight",
        "cssStyleMessageTypography2FontWeight",
        "cssStyleMessageTypography2LetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
