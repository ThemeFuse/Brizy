import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz &&:hover .brz-countdown2__item": {
      standart: [
        "cssStyleElementCountDown2SpacingRight",
        "cssStyleElementCountDown2SpacingLeft"
      ]
    },
    ".brz &&:hover .brz-countdown2-separator": {
      standart: [
        "cssStyleElementCountDown2NumberColor",
        "cssStyleNumberTypography2FontFamily",
        "cssStyleNumberTypography2FontSize",
        "cssStyleNumberTypography2FontWeight"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementCountDown2HoverTransitionProperty"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleItems(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleBorderRadius",
        "cssStyleSizeHeightPxOnly"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementCountDown2HoverTransitionProperty"
      ]
    },
    ".brz &&:hover:after": {
      standart: ["cssStyleSizeHeightPercentOnly"]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleSizeHeightPercentOnly"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleNumber(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
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
        "cssStyleElementCountDown2HoverTransitionProperty"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleTitle(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
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
        "cssStyleElementCountDown2HoverTransitionProperty"
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
        "cssStyleElementCountDown2HoverTransitionProperty"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
