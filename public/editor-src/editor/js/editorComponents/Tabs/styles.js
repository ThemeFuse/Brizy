import { renderStyles } from "visual/utils/cssStyle";

export function styleTabs(v, vs, vd) {
  const styles = {
    ".brz && > .brz-tabs__nav .brz-tabs__nav--item, .brz && > .brz-tabs__content > .brz-tabs__items > .brz-tabs__nav--mobile .brz-tabs__nav--button": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2LetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTabsPropertyHoverTransition"
      ]
    },
    ".brz && > .brz-tabs__nav.brz-tabs__nav--horizontal": {
      standart: ["cssStyleElementTabsNavAlign"]
    },

    ".brz && > .brz-tabs__nav.brz-tabs__nav--horizontal.brz-tabs__nav--style-2": {
      standart: ["cssStyleElementTabsAfterSpacing"]
    },
    ".brz && > .brz-tabs__nav.brz-tabs__nav--vertical.brz-tabs__nav--style-2": {
      standart: ["cssStyleElementTabsAfterSpacingVertical"]
    },
    ".brz && > .brz-tabs__content > .brz-tabs__items:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleElementTabsContentBgColor",
        "cssStyleElementTabsContentBorder",
        "cssStyleElementTabsContentShadow"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTabsPropertyHoverTransition"
      ]
    },
    ".brz && > .brz-tabs__nav .brz-tabs__nav--item:not(.brz-tabs__nav--active) .brz-tabs__nav--button:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleBoxShadow"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTabsPropertyHoverTransition"
      ]
    },
    ".brz && > .brz-tabs__nav .brz-tabs__nav--item.brz-tabs__nav--active .brz-tabs__nav--button": {
      standart: [
        "cssStyleElementTabsActiveColor",
        "cssStyleElementTabsActiveBgColor",
        "cssStyleElementTabsActiveShadow"
      ]
    },
    ".brz && > .brz-tabs__nav .brz-tabs__nav--button:hover": {
      standart: [
        "cssStyleElementTabsBtnIconPosition",
        "cssStyleElementTabsBtnIconJustifyContent"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTabsPropertyHoverTransition"
      ]
    },
    ".brz && > .brz-tabs__content .brz-tabs__nav--button .brz-icon-svg": {
      standart: [
        "cssStyleElementTabsBtnSpacing",
        "cssStyleElementTabsBtnIconSize"
      ]
    },
    ".brz && > .brz-tabs__content .brz-tabs__nav--button": {
      standart: [
        "cssStyleElementTabsBtnIconPosition",
        "cssStyleElementTabsBtnIconJustifyContent"
      ]
    },
    ".brz && > .brz-tabs__nav--style-1 .brz-tabs__nav--active .brz-tabs__nav--button": {
      standart: [
        "cssStyleElementTabsActiveColor",
        "cssStyleElementTabsActiveBgColor",
        "cssStyleElementTabsActiveShadow",
        "cssStyleElementTabsActiveBorder"
      ]
    },
    ".brz && > .brz-tabs__nav--style-2 .brz-tabs__nav--active .brz-tabs__nav--button": {
      standart: [
        "cssStyleElementTabsActiveColor",
        "cssStyleElementTabsActiveBgColor",
        "cssStyleElementTabsActiveShadow",
        "cssStyleElementTabsActiveBorder"
      ]
    },
    ".brz && > .brz-tabs__nav--style-3 .brz-tabs__nav--active .brz-tabs__nav--button": {
      standart: ["cssStyleElementTabsActiveColor"]
    },
    ".brz && > .brz-tabs__content > .brz-tabs__items > .brz-tabs__nav--mobile.brz-tabs__nav--mobile--active .brz-tabs__nav--button": {
      standart: [
        "cssStyleElementTabsBorderMobileWidth",
        "cssStyleElementTabsActiveColor",
        "cssStyleElementTabsActiveBgColor"
      ]
    },
    ".brz && > .brz-tabs__content > .brz-tabs__items > .brz-tabs__nav--mobile .brz-tabs__nav--button": {
      standart: ["cssStyleBgColor"]
    },
    ".brz && > .brz-tabs__nav .brz-tabs__nav--button .brz-icon-svg": {
      standart: [
        "cssStyleElementTabsBtnSpacing",
        "cssStyleElementTabsBtnIconSize"
      ]
    },
    ".brz && > .brz-tabs__nav--horizontal.brz-tabs__nav--style-1 .brz-tabs__nav--active .brz-tabs__nav--button:hover": {
      standart: ["cssStyleElementTabsBtnActiveBorderBottomColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTabsPropertyHoverTransition"
      ]
    },
    ".brz && > .brz-tabs__nav--vertical.brz-tabs__nav--style-1.brz-tabs__nav--left .brz-tabs__nav--active .brz-tabs__nav--button:hover": {
      standart: ["cssStyleElementTabsBtnActiveBorderRightColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTabsPropertyHoverTransition"
      ]
    },
    ".brz && > .brz-tabs__nav--vertical.brz-tabs__nav--style-1.brz-tabs__nav--right .brz-tabs__nav--active .brz-tabs__nav--button:hover": {
      standart: ["cssStyleElementTabsBtnActiveBorderLeftColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTabsPropertyHoverTransition"
      ]
    },
    ".brz && > .brz-tabs__nav--horizontal .brz-tabs__nav--item": {
      standart: ["cssStyleElementTabsNavAlign"]
    },
    ".brz && > .brz-tabs__nav--horizontal .brz-tabs__nav--active::after:hover": {
      standart: [
        "cssStyleElementTabsActiveBeforeAfterColor",
        "cssStyleElementTabsActiveBeforeHeight",
        "cssStyleElementTabsBeforeAfterRightWidth"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTabsPropertyHoverTransition"
      ]
    },
    ".brz && > .brz-tabs__nav--horizontal .brz-tabs__nav--active::before:hover": {
      standart: [
        "cssStyleElementTabsActiveBeforeAfterColor",
        "cssStyleElementTabsActiveBeforeHeight",
        "cssStyleElementTabsBeforeAfterLeftWidth"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTabsPropertyHoverTransition"
      ]
    },
    ".brz && > .brz-tabs__nav--vertical .brz-tabs__nav--active::after:hover": {
      standart: [
        "cssStyleElementTabsActiveBeforeAfterColor",
        "cssStyleElementTabsActiveBeforeWidth",
        "cssStyleElementTabsBeforeAfterTop"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTabsPropertyHoverTransition"
      ]
    },
    ".brz && > .brz-tabs__nav--vertical .brz-tabs__nav--active::before:hover": {
      standart: [
        "cssStyleElementTabsActiveBeforeAfterColor",
        "cssStyleElementTabsActiveBeforeWidth",
        "cssStyleElementTabsBeforeAfterBottom"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTabsPropertyHoverTransition"
      ]
    },
    ".brz && .brz-tabs__item--content": {
      interval: IS_EDITOR ? ["cssStyleElementTabsEmptyContent"] : [],
      standart: ["cssStyleElementTabsPadding"]
    },
    ".brz && > .brz-tabs__nav--horizontal .brz-tabs__nav--item:not(:last-child)": {
      standart: ["cssStyleElementTabsSpacing"]
    },
    ".brz && > .brz-tabs__nav--vertical .brz-tabs__nav--item:not(:last-child)": {
      standart: ["cssStyleElementTabsSpacing"]
    },

    //style-3

    ".brz &&.brz-tabs.brz-tabs--style-3": {
      standart: ["cssStyleElementTabsBgColor", "cssStylePaddingFourFields"]
    },
    ".brz && > .brz-tabs__nav.brz-tabs__nav--style-3 .brz-tabs__nav--item::before:hover": {
      standart: ["cssStyleElementTabsNavBorderBottom"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTabsPropertyHoverTransition"
      ]
    },
    ".brz && > .brz-tabs__nav.brz-tabs__nav--style-3 .brz-tabs__nav--item::after:hover": {
      standart: ["cssStyleElementTabsNavBorderBottom"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTabsPropertyHoverTransition"
      ]
    },
    ".brz && > .brz-tabs__nav.brz-tabs__nav--style-3 .brz-tabs__nav--active .brz-tabs__nav--button:before": {
      standart: ["cssStyleElementTabsNavStyle3Before"]
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
