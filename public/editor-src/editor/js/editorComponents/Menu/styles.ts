import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function styleMenuContainer(
  data: DynamicStylesProps<Value>
): OutputStyle {
  const styles = {
    ".brz && .brz-mm-menu__icon": {
      standart: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ],
      interval: ["cssStyleElementMenuShowIcon", "cssStyleElementMMenuSize"]
    },
    ".brz &&:hover .brz-mm-menu__icon": {
      interval: ["cssStyleElementMMenuIconColor"]
    },
    ".brz && .brz-menu": {
      interval: ["cssStyleElementMenuShow"]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleMenu(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz && .brz-menu__ul": {
      interval: [
        "cssStyleTypography2FontSize",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms"
      ],
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleElementMenuMode",
        "cssStyleElementMenuSize",
        "cssStyleElementMMenuListViewMargin"
      ]
    },
    ".brz &&:hover .brz-menu__ul": {
      standart: ["cssStyleColor"]
    },
    ".brz && .brz-menu__ul > .brz-menu__item > .brz-a": {
      standart: [
        "cssStyleElementMenuIconPosition",
        "cssStyleElementMenuPadding"
      ]
    },
    ".brz && .brz-menu__ul > .brz-menu__item > .brz-a:hover": {
      standart: ["cssStyleColor", "cssStyleElementMenuLinkBgColor"]
    },
    ".brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--opened > .brz-a:hover":
      {
        standart: ["cssStyleElementMenuColor", "cssStyleElementMenuLinkBgColor"]
      },
    ".brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--opened:hover": {
      standart: [
        "cssStyleElementMenuColor",
        "cssStyleElementMenuBgColor",
        "cssStyleElementMenuBorder"
      ]
    },

    // Current
    ".brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--current:not(.brz-menu__item.brz-menu__item--current:active):hover":
      {
        standart: [
          "cssStyleElementMenuCurrentColor",
          "cssStyleElementMenuCurrentBgColor",
          "cssStyleElementMenuCurrentBorder"
        ]
      },
    ".brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--current > .brz-a:not(.brz-a:active):hover":
      {
        standart: [
          "cssStyleElementMenuCurrentColor",
          "cssStyleElementMenuCurrentLinkBgColor"
        ]
      },
    ".brz && > .brz-ed-border": {
      interval: ["cssStyleVisibleEditorDisplayNoneOrBlock|||editor"]
    },
    ".brz && .brz-menu__ul > .brz-menu__item > .brz-a > .brz-icon-svg": {
      interval: ["cssStyleElementMenuIconSize"],
      standart: ["cssStyleElementMenuIconSpacing"]
    },
    ".brz && .brz-menu__ul > .brz-menu__item > .brz-a:hover > .brz-icon-svg.brz-icon-svg-custom":
      {
        standart: ["cssStyleCustomIconColor"]
      },
    ".brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--current > .brz-a:not(.brz-a:active):hover > .brz-icon-svg.brz-icon-svg-custom":
      {
        standart: ["cssStyleMenuCustomIconActiveColor"]
      },
    ".brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--current:not(.brz-menu__item.brz-menu__item--current:active):hover > .brz-icon-svg.brz-icon-svg-custom":
      {
        standart: ["cssStyleMenuCustomIconActiveColor"]
      },
    ".brz && .brz-menu__ul > .brz-menu__item": {
      standart: ["cssStyleElementMenuBorderRadius"],
      interval: ["cssStyleElementMMenuItemPadding"]
    },
    ".brz && .brz-menu__ul > .brz-menu__item:hover": {
      standart: [
        "cssStyleElementMenuColor",
        "cssStyleElementMenuBgColor",
        "cssStyleElementMenuBorder"
      ]
    },
    ".brz && .brz-menu__ul > .brz-menu__item > a": {
      standart: ["cssStyleElementMenuBorderRadius"]
    },

    ".brz && .brz-menu__ul > .brz-menu__item:first-child": {
      interval: ["cssStyleElementMMenuItemPaddingTopZero"]
    },
    ".brz && .brz-menu__ul > .brz-menu__item:last-child": {
      interval: ["cssStyleElementMMenuItemPaddingBottomZero"]
    },

    // SubMenu
    ".brz && .brz-menu__sub-menu": {
      interval: [
        "cssStyleElementMenuSubMenuFontSize",
        "cssStyleElementMenuSubMenuFontWeight",
        "cssStyleElementMenuSubMenuLineHeight",
        "cssStyleElementMenuSubMenuLetterSpacing",
        "cssStyleElementMenuSubMenuFontVariation",
        "cssStyleElementMenuSubMenuTextTransform",
        "cssStyleMenuDropdownPosition"
      ],
      standart: ["cssStyleElementMenuSubMenuFontFamily", "cssStyleBorderRadius"]
    },
    ".brz && .brz-menu__sub-menu:hover": {
      standart: [
        "cssStyleElementMenuSubMenuColor",
        "cssStyleElementMenuSubMenuBgColor",
        "cssStyleBoxShadow"
      ]
    },
    ".brz && .brz-menu__sub-menu .brz-menu__item > .brz-a": {
      standart: ["cssStyleElementMenuSubMenuIconPosition"]
    },
    ".brz &&:hover .brz-menu__sub-menu .brz-a:hover": {
      standart: ["cssStyleElementMenuSubMenuColor"]
    },
    ".brz && .brz-menu__sub-menu .brz-a > .brz-icon-svg": {
      standart: [
        "cssStyleElementMenuSubMenuIconSpacing",
        "cssStyleElementMenuSubMenuIconSize"
      ]
    },

    // Current SubMenu
    ".brz &&:hover .brz-menu__sub-menu > .brz-menu__item.brz-menu__item--current > .brz-a":
      {
        standart: ["cssStyleElementMenuSubMenuCurrentColor"]
      },
    ".brz &&:hover .brz-menu__sub-menu > .brz-menu__item.brz-menu__item--current":
      {
        standart: ["cssStyleElementMenuSubMenuCurrentBgColor"]
      },
    ".brz &&:hover .brz-menu__sub-menu > .brz-menu__item.brz-menu__item--current:hover":
      {
        standart: ["cssStyleElementMenuSubMenuCurrentBgColor"]
      },
    ".brz &&:hover .brz-menu__item--current .brz-menu__sub-menu": {
      standart: ["cssStyleElementMenuSubMenuCurrentBoxShadow"]
    },
    ".brz && .brz-menu__sub-menu > .brz-menu__item > .brz-a:hover > .brz-icon-svg.brz-icon-svg-custom":
      {
        standart: ["cssStyleElementMenuSubMenuCustomIconColor"]
      },
    ".brz && .brz-menu__sub-menu > .brz-menu__item:not(.brz-menu__item.brz-menu__item--current):hover > .brz-a > .brz-icon-svg.brz-icon-svg-custom":
      {
        standart: ["cssStyleElementMenuSubMenuCustomIconColor"]
      },
    ".brz &&:hover .brz-menu__sub-menu > .brz-menu__item.brz-menu__item--current > .brz-a > .brz-icon-svg.brz-icon-svg-custom":
      {
        standart: ["cssStyleMenuSubMenuCustomIconActiveColor"]
      },
    // Background Color for Dropdown
    ".brz && .brz-menu__item-dropdown .brz-menu__item:hover": {
      standart: [
        "cssStyleElementMenuSubMenuBgColor",
        "cssStyleElementMenuSubMenuColor"
      ]
    },
    // Color for dropdown arrow
    ".brz && .brz-menu__sub-menu .brz-menu__item-dropdown:hover .brz-a:hover:after":
      {
        standart: ["cssStyleElementMenuSubMenuBorderColor"]
      },

    // Dropdown Menu Items
    ".brz &&:hover .brz-menu__sub-menu > .brz-menu__item": {
      standart: ["cssStyleElementMenuSubMenuBorderBottom"]
    },

    // Position Dropdown
    ".brz && [data-popper-placement='left-start']": {
      interval: ["cssStyleMenuDropdownPositionLeft"]
    },
    ".brz && [data-popper-placement='right-start']": {
      interval: ["cssStyleMenuDropdownPositionRight"]
    },

    // First Level of Dropdown
    ".brz && > .brz-menu__ul > .brz-menu__item-dropdown > .brz-menu__sub-menu":
      { interval: ["cssStyleMenuFirstDropdownPosition"] },
    ".brz && > .brz-menu__ul > .brz-menu__item-dropdown > [data-popper-placement='left-start']":
      { interval: ["cssStyleMenuFirstDropdownPositionLeft"] },
    ".brz && > .brz-menu__ul > .brz-menu__item-dropdown > [data-popper-placement='right-start']":
      { interval: ["cssStyleMenuFirstDropdownPositionRight"] },

    // Dropdown responsive open / close
    ".brz && .brz-menu__item-dropdown .brz-menu__sub-menu": {
      interval: ["cssStyleElementMenuDropdown"]
    },
    ".brz && .brz-menu__item.brz-menu__item--opened > .brz-menu__sub-menu": {
      interval: ["cssStyleElementMenuDropdownOpened"]
    },
    ".brz &&.brz-menu__preview .brz-menu__item > .brz-menu__sub-menu": {
      interval: ["cssStyleElementMenuDropdownOpened"]
    },
    ".brz && .brz-menu__sub-menu .brz-menu__item-dropdown > .brz-a:after": {
      interval: ["cssStyleElementMenuDropdownArrow"]
    },

    // Inner dropdown responsive open / close
    ".brz && .brz-menu__sub-menu .brz-menu__item-dropdown .brz-menu__sub-menu":
      { interval: ["cssStyleElementMenuInnerDropdown"] },
    ".brz && .brz-menu__sub-menu .brz-menu__item--opened > .brz-menu__sub-menu":
      { interval: ["cssStyleElementMenuDropdownInnerOpened"] },
    ".brz &&.brz-menu__preview .brz-menu__sub-menu .brz-menu__item > .brz-menu__sub-menu":
      { interval: ["cssStyleElementMenuDropdownInnerOpened"] },

    // MegaMenu responsive open / close
    ".brz && .brz-mega-menu__dropdown": {
      interval: ["cssStyleElementMegaMenuOpened"]
    },
    ".brz &&.brz-menu__preview .brz-menu__item > .brz-mega-menu__portal": {
      interval: ["cssStyleElementMenuDropdownOpened"]
    },
    ".brz && .brz-menu__item-mega-menu .brz-mega-menu__portal": {
      interval: ["cssStyleElementMenuDropdown"]
    },
    ".brz && .brz-menu__item-dropdown .brz-menu__item, .brz && .brz-menu__sub-menu .brz-menu__item-dropdown .brz-a:after, .brz && .brz-menu__sub-menu > .brz-menu__item.brz-menu__item--current > .brz-a > .brz-icon-svg.brz-icon-svg-custom, .brz && .brz-menu__sub-menu > .brz-menu__item:not(.brz-menu__item.brz-menu__item--current) > .brz-a > .brz-icon-svg.brz-icon-svg-custom, .brz && .brz-menu__sub-menu > .brz-menu__item > .brz-a > .brz-icon-svg.brz-icon-svg-custom, .brz && .brz-menu__item--current .brz-menu__sub-menu, .brz && .brz-menu__sub-menu > .brz-menu__item.brz-menu__item--current, .brz &&:hover .brz-menu__ul, .brz && .brz-menu__ul > .brz-menu__item > .brz-a, .brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--opened > .brz-a, .brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--opened, .brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--current:not(.brz-menu__item.brz-menu__item--current:active), .brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--current > .brz-a:not(.brz-a:active), .brz && .brz-menu__ul > .brz-menu__item > .brz-a > .brz-icon-svg.brz-icon-svg-custom, .brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--current > .brz-a:not(.brz-a:active) > .brz-icon-svg.brz-icon-svg-custom, .brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--current:not(.brz-menu__item.brz-menu__item--current:active) > .brz-icon-svg.brz-icon-svg-custom, .brz && .brz-menu__ul > .brz-menu__item, .brz && .brz-menu__sub-menu, .brz &&:hover .brz-menu__sub-menu .brz-a, .brz && .brz-menu__sub-menu > .brz-menu__item.brz-menu__item--current > .brz-a, .brz && .brz-menu__sub-menu > .brz-menu__item.brz-menu__item--current":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}

// MMenu
export function styleMMenu(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz && .brz-mm-navbar .brz-mm-close": {
      standart: [
        "cssStyleElementMMenuIconCloseSize",
        "cssStyleElementMMenuCloseMargin",
        "cssStyleElementMMenuClosePadding"
      ]
    },
    ".brz && .brz-mm-navbar .brz-mm-close:hover": {
      standart: [
        "cssStyleElementMenuCloseColor",
        "cssStyleElementMenuBgCloseColor"
      ],
      interval: ["cssStyleElementMMenuCloseTransition"]
    },
    ".brz && .brz-menu__item": {
      interval: [
        "cssStyleElementMMenuFontSize",
        "cssStyleElementMMenuFontWeight",
        "cssStyleElementMMenuLineHeight",
        "cssStyleElementMMenuLetterSpacing",
        "cssStyleElementMMenuFontVariation",
        "cssStyleElementMMenuTextTransform"
      ],
      standart: ["cssStyleElementMMenuFontFamily"]
    },
    ".brz && .brz-menu__item:hover": {
      standart: ["cssStyleElementMMenuColor", "cssStyleElementMMenuBorderColor"]
    },
    ".brz nav.brz-mm-menu&&": {
      standart: ["cssStyleElementMMenuBackgroundColor"]
    },
    ".brz &&.brz-mm-menu .brz-menu__item .brz-mm-listitem__text": {
      standart: [
        "cssStyleElementMMenuPadding",
        "cssStyleElementMMenuIconPosition"
      ]
    },
    ".brz &&:hover .brz-menu__item:hover > .brz-mm-listitem__text": {
      standart: ["cssStyleElementMMenuColor"]
    },
    ".brz && .brz-menu__item .brz-a": {
      interval: [
        "cssStyleElementMMenuItemHorizontalAlign",
        "cssStyleElementMMenuItemTextHorizontalAlign"
      ]
    },
    ".brz && .brz-mm-menu__item__icon": {
      interval: [
        "cssStyleElementMMenuIconSpacing",
        "cssStyleElementMMenuIconSize"
      ]
    },
    ".brz && .brz-menu__item:hover .brz-mm-menu__item__icon.brz-icon-svg-custom":
      {
        standart: ["cssStyleMenuCustomIconColor"]
      },
    ".brz && .brz-mm-navbar": {
      interval: [
        "cssStyleElementMMenuFontFamily",
        "cssStyleElementMMenuFontSize",
        "cssStyleElementMMenuFontWeight",
        "cssStyleElementMMenuLineHeight",
        "cssStyleElementMMenuLetterSpacing",
        "cssStyleElementMMenuFontVariation",
        "cssStyleElementMMenuTextTransform",
        "cssStyleElementMMenuBorderColor"
      ],
      standart: ["cssStyleElementMMenuTitleColor"]
    },
    ".brz &&:hover .brz-menu__item.brz-mm-listitem_opened": {
      standart: ["cssStyleElementMMenuColor"]
    },
    ".brz &&.brz-mm-menu .brz-mm-listitem_vertical .brz-mm-btn_next": {
      interval: ["cssStyleElementMMenuBtnNext"]
    },
    ".brz &&.brz-mm-menu.brz-mm-menu_theme-dark .brz-mm-panels": {
      standart: ["cssStyleElementMenuHamburgerBgImage"]
    },
    ".brz &&.brz-mm-menu.brz-mm-menu_theme-dark .brz-mm-panels, .brz && .brz-mm-panels > .brz-mm-panel:before":
      {
        standart: [
          "cssStyleElementMMenuGradientBgColor",
          "cssStyleElementMMenuBackgroundColor"
        ]
      },
    ".brz &&.brz-mm-menu.brz-mm-menu_theme-dark .brz-mm-panels, .brz &&:hover .brz-mm-panels > .brz-mm-panel":
      {
        standart: [
          "cssStyleElementMMenuBackgroundColor",
          "cssStyleElementMMenuImageFilter",
          "cssStyleBgImagePosition"
        ]
      },
    ".brz && .brz-mm-panels > .brz-mm-panel": {
      standart: [
        "cssStyleElementMMenuGradientBgColor",
        "cssStyleElementMMenuBackgroundColor"
      ]
    },
    ".brz &&.brz-mm-menu.brz-mm-menu_theme-dark .brz-mm-navbar.brz-mm-listitem .brz-mm-listitem_opened > .brz-mm-listitem__text:after":
      {
        standart: ["cssStyleElementMMenuBorderColor"]
      },
    ".brz &&:hover .brz-mm-listitem": {
      standart: ["cssStyleElementMMenuBorderColor"]
    },

    // Current
    ".brz &&  .brz-menu__item.brz-menu__item--current:not(.brz-menu__item.brz-menu__item--current:active):hover":
      { standart: ["cssStyleElementMMenuActiveColor"] },
    ".brz:hover && .brz-menu__item.brz-menu__item--current:not(brz-menu__item.brz-menu__item--current:active):hover > .brz-mm-listitem__text":
      { standart: ["cssStyleElementMMenuActiveColor"] },
    ".brz &&  .brz-menu__item.brz-menu__item--current:not(brz-menu__item.brz-menu__item--current:active):hover > .brz-mm-listitem__text > .brz-icon-svg.brz-icon-svg-custom":
      {
        standart: ["cssStyleElementMMenuIconActiveColor"]
      },
    ".brz && .brz-mm-listitem, .brz &&.brz-mm-menu.brz-mm-menu_theme-dark .brz-mm-navbar.brz-mm-listitem .brz-mm-listitem_opened > .brz-mm-listitem__text:after, .brz && .brz-menu__item:hover, .brz &&.brz-mm-menu.brz-mm-menu_theme-dark .brz-mm-panels, .brz && .brz-mm-panels > .brz-mm-panel, .brz &&.brz-mm-menu.brz-mm-menu_theme-dark .brz-mm-panels, .brz && .brz-mm-panels > .brz-mm-panel:before, .brz && .brz-menu__item.brz-mm-listitem_opened, .brz && .brz-mm-navbar, .brz nav.brz-mm-menu&&, .brz && .brz-menu__item > .brz-mm-listitem__text, .brz && .brz-menu__item .brz-mm-menu__item__icon.brz-icon-svg-custom":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}
