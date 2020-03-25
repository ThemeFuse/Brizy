import { renderStyles } from "visual/utils/cssStyle";

export function styleTabs(v, vs, vd) {
  const styles = {
    ".brz &&:hover ": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2LetterSpacing"
      ]
    },
    ".brz && .brz-tabs__nav": {
      standart: ["cssStyleFlexHorizontalAlign"]
    },
    ".brz && .brz-tabs__nav.brz-tabs__nav--horizontal.brz-tabs__nav--style-2": {
      standart: ["cssStyleElementTabsAfterSpacing"]
    },
    ".brz && .brz-tabs__nav.brz-tabs__nav--vertical.brz-tabs__nav--style-2": {
      standart: ["cssStyleElementTabsAfterSpacingVertical"]
    },
    ".brz && .brz-tabs__items:hover": {
      standart: ["cssStyleColor", "cssStyleBgColor", "cssStyleBorder"]
    },
    ".brz && .brz-tabs__nav--button:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleElementTabsBtnIconPosition",
        "cssStyleElementTabsBtnIconJustifyContent"
      ]
    },
    ".brz && .brz-tabs__nav--mobile.brz-tabs__nav--mobile--active .brz-tabs__nav--button": {
      standart: ["cssStyleElementTabsBorderMobileWidth"]
    },
    ".brz && .brz-tabs__nav--button .brz-icon-svg": {
      standart: [
        "cssStyleElementTabsBtnSpacing",
        "cssStyleElementTabsBtnIconSize"
      ]
    },
    ".brz && .brz-tabs__nav--horizontal.brz-tabs__nav--style-1 .brz-tabs__nav--active .brz-tabs__nav--button:hover": {
      standart: ["cssStyleElementTabsBtnActiveBorderBottomColor"]
    },
    ".brz && .brz-tabs__nav--vertical.brz-tabs__nav--style-1.brz-tabs__nav--left .brz-tabs__nav--active .brz-tabs__nav--button:hover": {
      standart: ["cssStyleElementTabsBtnActiveBorderRightColor"]
    },
    ".brz && .brz-tabs__nav--vertical.brz-tabs__nav--style-1.brz-tabs__nav--right .brz-tabs__nav--active .brz-tabs__nav--button:hover": {
      standart: ["cssStyleElementTabsBtnActiveBorderLeftColor"]
    },
    ".brz &&  .brz-tabs__nav--horizontal .brz-tabs__nav--active::after:hover ": {
      standart: [
        "cssStyleElementTabsActiveBeforeAfterColor",
        "cssStyleElementTabsActiveBeforeHeight",
        "cssStyleElementTabsBeforeAfterRightWidth"
      ]
    },
    ".brz && .brz-tabs__nav--horizontal .brz-tabs__nav--active::before:hover": {
      standart: [
        "cssStyleElementTabsActiveBeforeAfterColor",
        "cssStyleElementTabsActiveBeforeHeight",
        "cssStyleElementTabsBeforeAfterLeftWidth"
      ]
    },
    ".brz &&  .brz-tabs__nav--vertical .brz-tabs__nav--active::after:hover ": {
      standart: [
        "cssStyleElementTabsActiveBeforeAfterColor",
        "cssStyleElementTabsActiveBeforeWidth",
        "cssStyleElementTabsBeforeAfterTop"
      ]
    },
    ".brz && .brz-tabs__nav--vertical .brz-tabs__nav--active::before:hover": {
      standart: [
        "cssStyleElementTabsActiveBeforeAfterColor",
        "cssStyleElementTabsActiveBeforeWidth",
        "cssStyleElementTabsBeforeAfterBottom"
      ]
    },
    ".brz && .brz-tabs__item--content": {
      interval: IS_EDITOR ? ["cssStyleElementTabsEmptyContent"] : [],
      standart: ["cssStylePaddingFourFields"]
    },
    ".brz && .brz-tabs__nav--horizontal .brz-tabs__nav--item:not(:last-child)": {
      standart: ["cssStyleElementTabsSpacing"]
    },
    ".brz && .brz-tabs__nav--vertical .brz-tabs__nav--item:not(:last-child)": {
      standart: ["cssStyleElementTabsSpacing"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
