import { ElementModel } from "visual/component/Elements/Types";
import { isEditor } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function styleTabs(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const { renderContext } = data.contexts;

  const styles = {
    ".brz && > .brz-tabs__nav .brz-tabs__nav--item, .brz && > .brz-tabs__content > .brz-tabs__items > .brz-tabs__nav--mobile .brz-tabs__nav--button":
      {
        standart: [
          "cssStyleTypography2FontFamily",
          "cssStyleTypography2FontSize",
          "cssStyleTypography2FontWeight",
          "cssStyleTypography2LineHeight",
          "cssStyleTypography2LetterSpacing",
          "cssStyleTextTransforms"
        ]
      },
    ".brz && > .brz-tabs__nav.brz-tabs__nav--horizontal": {
      standart: ["cssStyleElementTabsNavAlign"]
    },

    ".brz && > .brz-tabs__nav.brz-tabs__nav--horizontal.brz-tabs__nav--style-2":
      {
        standart: ["cssStyleElementTabsAfterSpacing"]
      },
    ".brz && > .brz-tabs__nav.brz-tabs__nav--vertical.brz-tabs__nav--style-2": {
      standart: ["cssStyleElementTabsAfterSpacingVertical"]
    },
    ".brz && > .brz-tabs__content > .brz-tabs__items:hover": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleElementTabsContentBgColor",
        "cssStyleElementTabsContentBorder",
        "cssStyleElementTabsContentShadow"
      ]
    },
    ".brz && > brz-tabs__nav--item:hover": {
      standart: ["cssStyleColor"]
    },
    ".brz && > .brz-tabs__nav .brz-tabs__nav--item:not(.brz-tabs__nav--active) .brz-tabs__nav--button:hover":
      {
        standart: [
          "cssStyleColor",
          "cssStyleBgColor",
          "cssStyleBorder",
          "cssStyleBoxShadow"
        ]
      },
    ".brz && > .brz-tabs__nav .brz-tabs__nav--item.brz-tabs__nav--active .brz-tabs__nav--button":
      {
        standart: [
          "cssStyleElementTabsActiveColor",
          "cssStyleElementTabsActiveBgColor",
          "cssStyleElementTabsActiveShadow"
        ]
      },
    ".brz && > .brz-tabs__nav .brz-tabs__nav--item:not(.brz-tabs__nav--active) .brz-tabs__nav--button .brz-icon-svg-custom:hover":
      {
        standart: ["cssStyleCustomIconColor"]
      },
    ".brz && > .brz-tabs__nav .brz-tabs__nav--item.brz-tabs__nav--active .brz-tabs__nav--button .brz-icon-svg-custom":
      {
        standart: ["cssStyleElementTabsActiveCustomIconColor"]
      },
    ".brz && > .brz-tabs__nav .brz-tabs__nav--item .brz-tabs__nav--button": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz && > .brz-tabs__nav .brz-tabs__nav--button": {
      standart: [
        "cssStyleElementTabsBtnIconPosition",
        "cssStyleElementTabsBtnIconJustifyContent"
      ]
    },
    ".brz && > .brz-tabs__content .brz-tabs__nav--button .brz-icon-svg": {
      standart: [
        "cssStyleElementTabsBtnSpacing",
        "cssStyleSizeFontSizeIcon",
        "cssStyleSizeMinWidthIcon"
      ]
    },

    ".brz && > .brz-tabs__content .brz-tabs__nav--button": {
      standart: [
        "cssStyleElementTabsBtnIconPosition",
        "cssStyleElementTabsBtnIconJustifyContent"
      ]
    },
    ".brz && > .brz-tabs__nav--style-1 .brz-tabs__nav--active .brz-tabs__nav--button":
      {
        standart: [
          "cssStyleElementTabsActiveColor",
          "cssStyleElementTabsActiveBgColor",
          "cssStyleElementTabsActiveShadow",
          "cssStyleElementTabsActiveBorder"
        ]
      },
    ".brz && > .brz-tabs__nav--style-2 .brz-tabs__nav--active .brz-tabs__nav--button":
      {
        standart: [
          "cssStyleElementTabsActiveColor",
          "cssStyleElementTabsActiveBgColor",
          "cssStyleElementTabsActiveShadow",
          "cssStyleElementTabsActiveBorder"
        ]
      },
    ".brz && > .brz-tabs__nav--style-3 .brz-tabs__nav--active .brz-tabs__nav--button":
      {
        standart: ["cssStyleElementTabsActiveColor"]
      },
    ".brz && > .brz-tabs__content > .brz-tabs__items > .brz-tabs__nav--mobile.brz-tabs__nav--mobile--active .brz-tabs__nav--button":
      {
        standart: [
          "cssStyleElementTabsBorderMobileWidth",
          "cssStyleElementTabsActiveColor",
          "cssStyleElementTabsActiveBgColor"
        ]
      },
    ".brz && > .brz-tabs__content > .brz-tabs__items > .brz-tabs__nav--mobile .brz-tabs__nav--button":
      {
        standart: ["cssStyleBgColor", "cssStyleColor"]
      },
    ".brz && > .brz-tabs__nav .brz-tabs__nav--button .brz-icon-svg": {
      standart: [
        "cssStyleElementTabsBtnSpacing",
        "cssStyleSizeFontSizeIcon",
        "cssStyleSizeMinWidthIcon"
      ]
    },
    ".brz && > .brz-tabs__nav--horizontal.brz-tabs__nav--style-1 .brz-tabs__nav--active .brz-tabs__nav--button":
      {
        standart: ["cssStyleElementTabsBtnActiveBorderBottomColor"]
      },
    ".brz && > .brz-tabs__nav--vertical.brz-tabs__nav--style-1.brz-tabs__nav--left .brz-tabs__nav--active .brz-tabs__nav--button":
      {
        standart: ["cssStyleElementTabsBtnActiveBorderRightColor"]
      },
    ".brz && > .brz-tabs__nav--vertical.brz-tabs__nav--style-1.brz-tabs__nav--right .brz-tabs__nav--active .brz-tabs__nav--button":
      {
        standart: ["cssStyleElementTabsBtnActiveBorderLeftColor"]
      },
    ".brz && > .brz-tabs__nav--horizontal .brz-tabs__nav--item": {
      standart: ["cssStyleElementTabsNavAlign"]
    },
    ".brz && > .brz-tabs__nav--horizontal .brz-tabs__nav--active::after": {
      standart: [
        "cssStyleElementTabsActiveBeforeAfterColor",
        "cssStyleElementTabsActiveBeforeHeight",
        "cssStyleElementTabsBeforeAfterRightWidth"
      ]
    },
    ".brz && > .brz-tabs__nav--horizontal .brz-tabs__nav--active::before": {
      standart: [
        "cssStyleElementTabsActiveBeforeAfterColor",
        "cssStyleElementTabsActiveBeforeHeight",
        "cssStyleElementTabsBeforeAfterLeftWidth"
      ]
    },
    ".brz && > .brz-tabs__nav--vertical .brz-tabs__nav--active::after": {
      standart: [
        "cssStyleElementTabsActiveBeforeAfterColor",
        "cssStyleElementTabsActiveBeforeWidth",
        "cssStyleElementTabsBeforeAfterTop"
      ]
    },
    ".brz && > .brz-tabs__nav--vertical .brz-tabs__nav--active::before": {
      standart: [
        "cssStyleElementTabsActiveBeforeAfterColor",
        "cssStyleElementTabsActiveBeforeWidth",
        "cssStyleElementTabsBeforeAfterBottom"
      ]
    },
    ".brz && .brz-tabs__item--content": {
      interval: isEditor(renderContext)
        ? ["cssStyleElementTabsEmptyContent"]
        : [],
      standart: ["cssStyleElementTabsPadding"]
    },
    ".brz && > .brz-tabs__nav--horizontal .brz-tabs__nav--item:not(:last-child)":
      {
        standart: ["cssStyleElementTabsSpacing"]
      },
    ".brz && > .brz-tabs__nav--vertical .brz-tabs__nav--item:not(:last-child)":
      {
        standart: ["cssStyleElementTabsSpacing"]
      },

    //style-3

    ".brz &&.brz-tabs.brz-tabs--style-3": {
      standart: ["cssStyleElementTabsBgColor", "cssStylePaddingFourFields"]
    },
    ".brz && > .brz-tabs__nav.brz-tabs__nav--style-3 .brz-tabs__nav--item::before:hover":
      {
        standart: ["cssStyleElementTabsNavBorderBottom"]
      },
    ".brz && > .brz-tabs__nav.brz-tabs__nav--style-3 .brz-tabs__nav--item::after:hover":
      {
        standart: ["cssStyleElementTabsNavBorderBottom"]
      },
    ".brz && > .brz-tabs__nav.brz-tabs__nav--style-3 .brz-tabs__nav--active .brz-tabs__nav--button:before":
      {
        standart: ["cssStyleElementTabsNavStyle3Before"]
      },
    ".brz && > .brz-tabs__nav.brz-tabs__nav--style-3 .brz-tabs__nav--item::after, .brz && > .brz-tabs__nav.brz-tabs__nav--style-3 .brz-tabs__nav--item::before, .brz && > .brz-tabs__nav--vertical .brz-tabs__nav--active::before, .brz && > .brz-tabs__nav--vertical .brz-tabs__nav--active::after, .brz && > .brz-tabs__nav--horizontal .brz-tabs__nav--active::before, .brz && > .brz-tabs__nav--horizontal .brz-tabs__nav--active::after, .brz && > .brz-tabs__nav .brz-tabs__nav--button, .brz && > .brz-tabs__nav .brz-tabs__nav--item.brz-tabs__nav--active .brz-tabs__nav--button .brz-icon-svg-custom, .brz && > .brz-tabs__nav .brz-tabs__nav--item:not(.brz-tabs__nav--active) .brz-tabs__nav--button .brz-icon-svg-custom, .brz && > .brz-tabs__nav .brz-tabs__nav--item:not(.brz-tabs__nav--active) .brz-tabs__nav--button, .brz && > brz-tabs__nav--item, .brz && > .brz-tabs__content > .brz-tabs__items, .brz && > .brz-tabs__nav .brz-tabs__nav--item, .brz && > .brz-tabs__content > .brz-tabs__items > .brz-tabs__nav--mobile .brz-tabs__nav--button":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}

export function styleAnimation(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleAnimationAll"]
    }
  };

  return renderStyles({ ...data, styles });
}
