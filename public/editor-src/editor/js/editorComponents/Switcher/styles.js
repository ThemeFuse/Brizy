import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz && > .brz-switcher__nav": {
      standart: [
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleBorderRadius",
        "cssStyleBoxShadow",
        "cssStyleElementSwitcherNavSpacing",
        "cssStyleElementSwitcherWidth"
      ]
    },
    ".brz && > .brz-switcher__nav:before": {
      standart: ["cssStyleBorderRadius", "cssStyleElementSwitcherNavBeforeBg"]
    },
    ".brz && > .brz-switcher__nav .brz-switcher__nav--item": {
      standart: ["cssStyleColor", "cssStylePaddingFourFields"]
    },
    ".brz && > .brz-switcher__nav .brz-switcher__nav--item--active": {
      standart: ["cssStyleElementSwitcherActiveTextColor"]
    },
    ".brz && .brz-switcher__nav--button": {
      standart: ["cssStyleElementSwitcherBtnIconPosition"]
    },
    ".brz && .brz-switcher__nav--button .brz-icon-svg": {
      standart: [
        "cssStyleElementSwitcherIcon",
        "cssStyleElementSwitcherBtnSpacing"
      ]
    },

    //style2
    ".brz &&:hover > .brz-switcher__nav2": {
      standart: [
        "cssStyleColor",
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleElementSwitcherNavSpacing"
      ]
    },
    ".brz &&:hover > .brz-switcher__nav2 .brz-switcher__nav2--control": {
      standart: [
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleBorderRadius",
        "cssStyleBoxShadow",
        "cssStyleElementSwitcherNav2Height",
        "cssStyleElementSwitcherNav2Width"
      ]
    },
    ".brz &&:hover .brz-switcher__nav2--button": {
      standart: ["cssStyleElementSwitcherBtnIconPosition"]
    },
    ".brz &&:hover .brz-switcher__nav2--button .brz-icon-svg": {
      standart: [
        "cssStyleElementSwitcherBtnSpacing",
        "cssStyleElementSwitcherIcon"
      ]
    },
    ".brz &&:hover > .brz-switcher__nav2 .brz-switcher__nav2--control:before": {
      standart: ["cssStyleBorderRadius", "cssStyleElementSwitcherNavBeforeBg"]
    },
    ".brz &&:hover > .brz-switcher__nav2 .brz-switcher__nav2__item--active": {
      standart: ["cssStyleElementSwitcherActiveTextColor"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleAnimation(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleAnimation",
        "cssStyleAnimationDuration",
        "cssStyleAnimationDelay"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
