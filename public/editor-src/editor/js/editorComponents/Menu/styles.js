import { renderStyles } from "visual/utils/cssStyle";

export function styleMenuContainer(v, vs, vd) {
  const styles = {
    ".brz &&:hover .brz-mm-menu__icon": {
      interval: [
        "cssStyleElementMenuShowIcon",
        "cssStyleElementMMenuSize",
        "cssStyleElementMMenuIconColor"
      ]
    },
    ".brz &&:hover .brz-menu": {
      interval: ["cssStyleElementMenuShow"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleMenu(v, vs, vd) {
  const styles = {
    ".brz &&:hover .brz-menu__ul": {
      interval: [
        "cssStyleTypography2FontSize",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2LetterSpacing"
      ],
      standart: ["cssStyleTypography2FontFamily", "cssStyleColor"]
    },
    ".brz && .brz-menu__ul:not(.brz-mm-listview)": {
      standart: [
        "cssStyleElementMenuMode",
        "cssStyleElementMenuSize",
        "cssStyleElementMMenuListViewMargin"
      ]
    },
    ".brz && .brz-menu__ul > .brz-menu__item > .brz-a": {
      standart: ["cssStyleElementMenuIconPosition"]
    },
    ".brz && .brz-menu__ul > .brz-menu__item > .brz-a:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleElementMenuLinkBgColor",
        "cssStyleElementMenuPadding"
      ]
    },
    ".brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--opened > .brz-a:hover": {
      standart: [
        "cssStyleElementMenuActiveColor",
        "cssStyleElementMenuActiveLinkBgColor"
      ]
    },
    ".brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--opened:hover": {
      standart: [
        "cssStyleElementMenuActiveColor",
        "cssStyleElementMenuActiveBgColor",
        "cssStyleElementMenuActiveBorder"
      ]
    },

    // Current
    ".brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--current:not(.brz-menu__item.brz-menu__item--current:active):hover": {
      standart: [
        "cssStyleElementMenuCurrentColor",
        "cssStyleElementMenuCurrentBgColor",
        "cssStyleElementMenuCurrentBorder"
      ]
    },
    ".brz && .brz-menu__ul > .brz-menu__item.brz-menu__item--current > .brz-a:not(.brz-a:active):hover": {
      standart: [
        "cssStyleElementMenuCurrentColor",
        "cssStyleElementMenuCurrentLinkBgColor"
      ]
    },

    ".brz &&:hover > .brz-ed-border": {
      interval: ["cssStyleVisibleEditorDisplayNoneOrBlock|||editor"]
    },
    ".brz &&:hover .brz-menu__item__icon": {
      interval: ["cssStyleElementMenuIconSize"],
      standart: ["cssStyleElementMenuIconSpacing"]
    },

    ".brz && .brz-menu__ul > .brz-menu__item:hover": {
      standart: ["cssStyleElementMenuBgColor", "cssStyleElementMenuBorder"],
      interval: ["cssStyleElementMMenuItemPadding"]
    },
    ".brz && .brz-menu__ul > .brz-menu__item:first-child": {
      interval: ["cssStyleElementMMenuItemPaddingTopZero"]
    },
    ".brz && .brz-menu__ul > .brz-menu__item:last-child": {
      interval: ["cssStyleElementMMenuItemPaddingBottomZero"]
    },

    // MMenu
    ".brz && .brz-mm-menu__item": {
      interval: [
        "cssStyleElementMMenuFontSize",
        "cssStyleElementMMenuFontWeight",
        "cssStyleElementMMenuLineHeight",
        "cssStyleElementMMenuLetterSpacing"
      ],
      standart: [
        "cssStyleElementMMenuFontFamily",
        "cssStyleElementMMenuColor",
        "cssStyleElementMMenuBorderColor"
      ]
    },
    ".brz nav.brz-mm-menu&&": {
      standart: ["cssStyleElementMMenuBackgroundColor"]
    },
    ".brz &&.brz-mm-menu .brz-mm-menu__item .brz-mm-listitem__text": {
      standart: [
        "cssStyleElementMMenuPadding",
        "cssStyleElementMMenuIconPosition"
      ]
    },
    ".brz &&:hover .brz-mm-menu__item:hover > .brz-mm-listitem__text": {
      standart: ["cssStyleElementMMenuHoverColor"]
    },
    ".brz &&:hover .brz-mm-menu__item .brz-a": {
      interval: ["cssStyleElementMMenuItemHorizontalAlign"]
    },
    ".brz &&:hover .brz-mm-menu__item__icon": {
      interval: [
        "cssStyleElementMMenuIconSpacing",
        "cssStyleElementMMenuIconSize"
      ]
    },
    ".brz && .brz-mm-navbar": {
      interval: [
        "cssStyleElementMMenuFontFamily",
        "cssStyleElementMMenuFontSize",
        "cssStyleElementMMenuFontWeight",
        "cssStyleElementMMenuLineHeight",
        "cssStyleElementMMenuLetterSpacing",
        "cssStyleElementMMenuBorderColor"
      ],
      standart: ["cssStyleElementMMenuColor"]
    },
    ".brz &&:hover .brz-mm-menu__item.brz-mm-listitem_opened": {
      standart: ["cssStyleElementMMenuColor"]
    },
    ".brz &&:hover.brz-mm-menu .brz-mm-listitem_vertical .brz-mm-btn_next": {
      interval: ["cssStyleElementMMenuBtnNext"]
    },
    ".brz &&.brz-mm-menu.brz-mm-menu_theme-dark .brz-mm-panels, .brz &&:hover .brz-mm-panels > .brz-mm-panel": {
      standart: ["cssStyleElementMMenuBackgroundColor"]
    },
    ".brz &&.brz-mm-menu.brz-mm-menu_theme-dark .brz-mm-navbar.brz-mm-listitem .brz-mm-listitem_opened > .brz-mm-listitem__text:after": {
      standart: ["cssStyleElementMMenuBorderColor"]
    },
    ".brz &&:hover .brz-mm-listitem": {
      standart: ["cssStyleElementMMenuBorderColor"]
    },

    // Current
    ".brz && .brz-mm-menu__item.brz-mm-menu__item--current": {
      standart: ["cssStyleElementMMenuActiveColor"]
    },
    ".brz:hover && .brz-mm-menu__item.brz-mm-menu__item--current:hover > .brz-mm-listitem__text": {
      standart: ["cssStyleElementMMenuActiveColor"]
    },

    // SubMenu
    ".brz &&:hover .brz-menu__sub-menu": {
      interval: [
        "cssStyleElementMenuSubMenuFontSize",
        "cssStyleElementMenuSubMenuFontWeight",
        "cssStyleElementMenuSubMenuLineHeight",
        "cssStyleElementMenuSubMenuLetterSpacing"
      ],
      standart: [
        "cssStyleElementMenuSubMenuFontFamily",
        "cssStyleElementMenuSubMenuColor",
        "cssStyleBoxShadow",
        "cssStyleBorderRadius"
      ]
    },
    ".brz &&:hover .brz-menu__sub-menu .brz-a": {
      standart: ["cssStyleElementMenuSubMenuIconPosition"]
    },
    ".brz &&:hover .brz-menu__sub-item__icon": {
      standart: [
        "cssStyleElementMenuSubMenuIconSpacing",
        "cssStyleElementMenuSubMenuIconSize"
      ]
    },

    // Current SubMenu
    ".brz &&:hover .brz-menu__dropdown > .brz-menu__item.brz-menu__item--current > .brz-a": {
      standart: ["cssStyleElementMenuSubMenuCurrentColor"]
    },
    ".brz &&:hover .brz-menu__dropdown > .brz-menu__item.brz-menu__item--current": {
      standart: ["cssStyleElementMenuSubMenuCurrentBgColor"]
    },
    ".brz &&:hover .brz-menu__dropdown > .brz-menu__item.brz-menu__item--current:hover": {
      standart: ["cssStyleElementMenuSubMenuCurrentBgColor"]
    },
    ".brz &&:hover .brz-menu__dropdown > .brz-menu__item.brz-menu__item--current:hover > .brz-a": {
      standart: ["cssStyleElementMenuSubMenuCurrentColor"]
    },
    ".brz &&:hover .brz-menu__item--current .brz-menu__sub-menu": {
      standart: ["cssStyleElementMenuSubMenuCurrentBoxShadow"]
    },

    // Background Color for Dropdown
    ".brz &&:hover .brz-menu__item-dropdown .brz-menu__item": {
      standart: ["cssStyleElementMenuSubMenuBgColor"]
    },
    ".brz &&:hover .brz-menu__item-dropdown .brz-menu__item:hover > .brz-a": {
      standart: ["cssStyleElementMenuSubMenuHoverColor"]
    },
    ".brz &&:hover .brz-menu__item-dropdown .brz-menu__item:hover": {
      standart: ["cssStyleElementMenuSubMenuHoverBgColor"]
    },

    // Color for dropdown arrow
    ".brz &&:hover .brz-menu__dropdown .brz-menu__item-dropdown .brz-a:after": {
      standart: ["cssStyleElementMenuSubMenuBorderColor"]
    },

    // Dropdown Menu Items
    ".brz &&:hover .brz-menu__dropdown > .brz-menu__item": {
      standart: ["cssStyleElementMenuSubMenuBorderBottom"]
    },

    // Position Dropdown
    ".brz && .brz-menu__dropdown": {
      interval: ["cssStyleMenuDropdownPosition"]
    },
    ".brz && [data-popper-placement='left-start']": {
      interval: ["cssStyleMenuDropdownPositionLeft"]
    },
    ".brz && [data-popper-placement='right-start']": {
      interval: ["cssStyleMenuDropdownPositionRight"]
    },

    // First Level of Dropdown
    ".brz &&:hover > .brz-menu__ul > .brz-menu__item-dropdown > .brz-menu__dropdown": {
      interval: ["cssStyleMenuFirstDropdownPosition"]
    },
    ".brz &&:hover > .brz-menu__ul > .brz-menu__item-dropdown > [data-popper-placement='left-start']": {
      interval: ["cssStyleMenuFirstDropdownPositionLeft"]
    },
    ".brz &&:hover > .brz-menu__ul > .brz-menu__item-dropdown > [data-popper-placement='right-start']": {
      interval: ["cssStyleMenuFirstDropdownPositionRight"]
    },

    // Dropdown responsive open / close
    ".brz &&:hover .brz-menu__item-dropdown .brz-menu__dropdown": {
      interval: ["cssStyleElementMenuDropdown"]
    },
    ".brz &&:hover .brz-menu__item.brz-menu__item--opened > .brz-menu__dropdown": {
      interval: ["cssStyleElementMenuDropdownOpened"]
    },
    ".brz &&.brz-menu__preview:hover .brz-menu__item:hover > .brz-menu__sub-menu": {
      interval: ["cssStyleElementMenuDropdownOpened"]
    },
    ".brz &&:hover .brz-menu__dropdown .brz-menu__item-dropdown > .brz-a:after": {
      interval: ["cssStyleElementMenuDropdownArrow"]
    },

    // Inner dropdown responsive open / close
    ".brz &&:hover .brz-menu__dropdown .brz-menu__item-dropdown .brz-menu__dropdown": {
      interval: ["cssStyleElementMenuInnerDropdown"]
    },
    ".brz &&:hover .brz-menu__dropdown .brz-menu__item--opened > .brz-menu__dropdown": {
      interval: ["cssStyleElementMenuDropdownInnerOpened"]
    },
    ".brz &&.brz-menu__preview:hover .brz-menu__dropdown .brz-menu__item:hover > .brz-menu__sub-menu": {
      interval: ["cssStyleElementMenuDropdownInnerOpened"]
    },

    // MegaMenu responsive open / close
    ".brz && .brz-mega-menu__dropdown": {
      interval: ["cssStyleElementMegaMenuOpened"]
    },
    ".brz &&.brz-menu__preview:hover .brz-menu__item:hover > .brz-mega-menu__portal": {
      interval: ["cssStyleElementMenuDropdownOpened"]
    },
    ".brz &&:hover .brz-menu__item-mega-menu .brz-mega-menu__portal": {
      interval: ["cssStyleElementMenuDropdown"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
