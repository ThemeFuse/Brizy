import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover .brz-switcher__nav": {
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
    ".brz &&:hover .brz-switcher__nav:before": {
      standart: ["cssStyleBorderRadius", "cssStyleElementSwitcherNavBeforeBg"]
    },
    ".brz &&:hover .brz-switcher__nav--item": {
      standart: ["cssStyleColor", "cssStylePaddingFourFields"]
    },
    ".brz &&:hover .brz-switcher__nav--item--active": {
      standart: ["cssStyleElementSwitcherActiveTextColor"]
    },

    //style2
    ".brz &&:hover .brz-switcher__nav2": {
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
    ".brz &&:hover .brz-switcher__nav2--control": {
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
    ".brz &&:hover .brz-switcher__nav2--control:before": {
      standart: ["cssStyleBorderRadius", "cssStyleElementSwitcherNavBeforeBg"]
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
