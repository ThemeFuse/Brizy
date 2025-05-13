import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz && > .brz-switcher__nav": {
      standart: [
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3TextTransform",
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
    ".brz && > .brz-switcher__nav .brz-switcher__nav--item .brz-icon-svg-custom":
      {
        standart: ["cssStyleCustomIconColor"]
      },
    ".brz && > .brz-switcher__nav .brz-switcher__nav--item--active": {
      standart: ["cssStyleElementSwitcherActiveTextColor"]
    },
    ".brz && > .brz-switcher__nav .brz-switcher__nav--item--active .brz-icon-svg-custom":
      {
        standart: ["cssStyleElementSwitcherActiveCustomIconColor"]
      },
    ".brz && .brz-switcher__nav--item": {
      standart: ["cssStyleElementSwitcherBtnIconPosition"]
    },
    ".brz && .brz-switcher__nav--item .brz-icon-svg": {
      standart: [
        "cssStyleSizeFontSizeIcon",
        "cssStyleElementSwitcherBtnSpacing"
      ]
    },

    //style2
    ".brz && > .brz-switcher__nav2": {
      standart: [
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleElementSwitcherNavSpacing"
      ]
    },
    ".brz &&:hover > .brz-switcher__nav2": {
      standart: ["cssStyleColor"]
    },
    ".brz && > .brz-switcher__nav2 .brz-switcher__nav2--control": {
      standart: [
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleBorderRadius",
        "cssStyleElementSwitcherNav2Height",
        "cssStyleElementSwitcherNav2Width"
      ]
    },
    ".brz &&:hover > .brz-switcher__nav2 .brz-switcher__nav2--control": {
      standart: ["cssStyleBgColor", "cssStyleBorder", "cssStyleBoxShadow"]
    },
    ".brz && .brz-switcher__nav2--button": {
      standart: ["cssStyleElementSwitcherBtnIconPosition"]
    },
    ".brz && .brz-switcher__nav2--button .brz-icon-svg": {
      standart: [
        "cssStyleElementSwitcherBtnSpacing",
        "cssStyleSizeFontSizeIcon"
      ]
    },
    ".brz &&:hover .brz-switcher__nav2--button .brz-icon-svg-custom": {
      standart: ["cssStyleCustomIconColor"]
    },
    ".brz && > .brz-switcher__nav2 .brz-switcher__nav2--control:before": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover > .brz-switcher__nav2 .brz-switcher__nav2--control:before": {
      standart: ["cssStyleElementSwitcherNavBeforeBg"]
    },
    ".brz && > .brz-switcher__nav2 .brz-switcher__nav2__item--active .brz-switcher__nav2__item":
      {
        standart: ["cssStyleElementSwitcherActiveTextColor"]
      },
    ".brz && > .brz-switcher__nav2 .brz-switcher__nav2__item--active .brz-icon-svg":
      {
        standart: ["cssStyleElementSwitcherActiveTextColor"]
      },
    ".brz && > .brz-switcher__nav2 .brz-switcher__nav2__item--active .brz-icon-svg-custom":
      {
        standart: ["cssStyleElementSwitcherActiveCustomIconColor"]
      }
  };

  return renderStyles({ ...data, styles });
}

export function styleAnimation(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleAnimationAll"]
    }
  };

  return renderStyles({ ...data, styles });
}
