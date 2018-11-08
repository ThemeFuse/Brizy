import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";
import { getFontById } from "visual/utils/fonts";
import { mobileSyncOnChange, tabletSyncOnChange } from "visual/utils/onChange";

const aligns = {
  left: "flex-start",
  center: "center",
  right: "flex-end"
};

export function styleClassName(v) {
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        justifyContent: "var(--horizontalAlign)",

        "& .brz-mm-menu__icon": {
          display: "var(--showIcon)",
          fontSize: "var(--mMenuSize)",
          color: "var(--color)"
        },
        "& .brz-menu": {
          display: "var(--showMenu)"
        }
      },
      ".brz-ed--tablet &": {
        justifyContent: "var(--tabletHorizontalAlign)",

        "& .brz-mm-menu__icon": {
          display: "var(--showTabletIcon)",
          fontSize: "var(--tabletMMenuSize)",
          color: "var(--tabletColor)"
        },
        "& .brz-menu": {
          display: "var(--showTabletMenu)"
        }
      },
      ".brz-ed--mobile &": {
        justifyContent: "var(--mobileHorizontalAlign)",

        "& .brz-mm-menu__icon": {
          display: "var(--showMobileIcon)",
          fontSize: "var(--mobileMMenuSize)",
          color: "var(--mobileColor)"
        },
        "& .brz-menu": {
          display: "var(--showMobileMenu)"
        }
      }
    };
  } else {
    const {
      mMenuIconColorHex,
      mMenuIconColorOpacity,
      horizontalAlign,
      mMenu,
      mMenuSize,
      tabletMMenu,
      mobileMMenu
    } = v;

    glamorObj = {
      ".brz &": {
        justifyContent: aligns[horizontalAlign],

        "& .brz-menu": {
          display: mMenu === "on" ? "none" : "block"
        },
        "& .brz-mm-menu__icon": {
          color: hexToRgba(mMenuIconColorHex, mMenuIconColorOpacity),
          display: mMenu === "on" ? "flex" : "none",
          fontSize: `${mMenuSize}px`
        }
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          justifyContent: aligns[tabletSyncOnChange(v, "horizontalAlign")],
          "& .brz-mm-menu__icon": {
            color: hexToRgba(
              tabletSyncOnChange(v, "mMenuIconColorHex"),
              tabletSyncOnChange(v, "mMenuIconColorOpacity")
            ),
            fontSize: `${tabletSyncOnChange(v, "mMenuSize")}px`
          }
        }
      },
      "@media (max-width: 991px) and (min-width: 768px)": {
        ".brz & .brz-menu": {
          display: tabletMMenu === "on" ? "none" : "block"
        },
        ".brz & .brz-mm-menu__icon": {
          display: tabletMMenu === "on" ? "flex" : "none"
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          justifyContent: aligns[mobileSyncOnChange(v, "horizontalAlign")],

          "& .brz-menu": {
            display: mobileMMenu === "on" ? "none" : "block"
          },
          "& .brz-mm-menu__icon": {
            color: hexToRgba(
              mobileSyncOnChange(v, "mMenuIconColorHex"),
              mobileSyncOnChange(v, "mMenuIconColorOpacity")
            ),
            display: mobileMMenu === "on" ? "flex" : "none",
            fontSize: `${mobileSyncOnChange(v, "mMenuSize")}px`
          }
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-menu__container", glamorClassName);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) {
    return;
  }

  const {
    mMenuIconColorHex,
    mMenuIconColorOpacity,
    horizontalAlign,
    mMenu,
    mMenuSize,
    tabletMMenu,
    mobileMMenu
  } = v;

  return {
    "--color": hexToRgba(mMenuIconColorHex, mMenuIconColorOpacity),
    "--tabletColor": hexToRgba(
      tabletSyncOnChange(v, "mMenuIconColorHex"),
      tabletSyncOnChange(v, "mMenuIconColorOpacity")
    ),
    "--mobileColor": hexToRgba(
      mobileSyncOnChange(v, "mMenuIconColorHex"),
      mobileSyncOnChange(v, "mMenuIconColorOpacity")
    ),
    "--mMenuSize": `${mMenuSize}px`,
    "--tabletMMenuSize": `${tabletSyncOnChange(v, "mMenuSize")}px`,
    "--mobileMMenuSize": `${mobileSyncOnChange(v, "mMenuSize")}px`,
    "--horizontalAlign": aligns[horizontalAlign],
    "--tabletHorizontalAlign": aligns[tabletSyncOnChange(v, "horizontalAlign")],
    "--mobileHorizontalAlign": aligns[mobileSyncOnChange(v, "horizontalAlign")],
    "--showIcon": mMenu === "on" ? "flex" : "none",
    "--showTabletIcon": tabletMMenu === "on" ? "flex" : "none",
    "--showMobileIcon": mobileMMenu === "on" ? "flex" : "none",
    "--showMenu": mMenu === "on" ? "none" : "block",
    "--showTabletMenu": tabletMMenu === "on" ? "none" : "block",
    "--showMobileMenu": mobileMMenu === "on" ? "none" : "block"
  };
}

export function styleMenuClassName(v, hasMMenu) {
  const { className, items } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz &": {
        fontFamily: "var(--fontFamily)",
        color: "var(--color)",

        "& .brz-mm-menu__item": {
          fontFamily: "var(--mMenuFontFamily)",
          color: "var(--mMenuColor)",

          "& .brz-a:hover": {
            color: "var(--mMenuHoverColor)"
          }
        },
        "& .brz-menu__sub-menu": {
          fontFamily: "var(--subMenuFontFamily)",
          color: "var(--subMenuColor)",

          "& .brz-a:hover": {
            color: "var(--subMenuHoverColor)"
          }
        },
        "& .mm-navbar": {
          color: "var(--mMenuColor)"
        },

        // Spacing for 0 level menu item
        "& .brz-menu__ul:not(.mm-listview)": {
          marginTop: "var(--itemMarginTop)",
          marginRight: "var(--itemMarginRight)",
          marginBottom: "var(--itemMarginBottom)",
          marginLeft: "var(--itemMarginLeft)"
        },
        "& .brz-menu__ul > .brz-menu__item": {
          paddingTop: "var(--itemPaddingTop)",
          marginRight: "var(--itemPaddingRight)",
          paddingBottom: "var(--itemPaddingBottom)",
          marginLeft: "var(--itemPaddingLeft)",

          "& > .brz-a:hover": {
            color: "var(--hoverColor)"
          }
        },
        "& .brz-menu__item__icon": {
          marginRight: "var(--iconSpacing)"
        },
        "& .brz-menu__sub-item__icon": {
          marginRight: "var(--subMenuIconSpacing)",
          fontSize: "var(--subMenuIconSize)"
        },

        // Background Color for Dropdown
        "&:not(.mm-menu) .brz-menu__item-dropdown .brz-menu__item": {
          backgroundColor: "var(--subMenuBgColor)",

          "&:hover": {
            backgroundColor: "var(--subMenuHoverBgColor)"
          }
        },

        // Color for dropdown arrow
        "&:not(.mm-menu) .brz-menu__ul > .brz-menu__item-dropdown > .brz-menu__dropdown:after": {
          borderBottomColor: "var(--subMenuBgColor)"
        },
        "& .brz-menu__dropdown-left:after": {
          borderLeftColor: "var(--subMenuBgColor)"
        },
        "& .brz-menu__dropdown-right:after": {
          borderRightColor: "var(--subMenuBgColor)"
        },

        // Dropdown Menu Items
        "& .brz-menu__dropdown > .brz-menu__item:not(:last-child)": {
          borderBottomWidth: "var(--subMenuBorderWidth)",
          borderBottomStyle: "var(--subMenuBorderStyle)",
          borderBottomColor: "var(--subMenuBorderColor)",

          "&:hover": {
            borderBottomColor: "var(--subMenuHoverBorderColor)"
          }
        },

        // MMenu Style
        "&.mm-menu.mm-menu_theme-dark": {
          backgroundColor: "var(--mMenuBgColor)",
          borderColor: "var(--mMenuBorderColor)",

          "& .mm-btn_next:after, & .mm-btn_prev:after, & .mm-btn_prev:before": {
            borderColor: "var(--mMenuColor)"
          },
          "& .mm-btn_next:before, & .mm-listitem_opened > .brz-a:after": {
            borderColor: "var(--mMenuBorderColor)"
          }
        }
      },
      ".brz-ed--desktop &": {
        fontSize: "var(--fontSize)",
        fontWeight: "var(--fontWeight)",
        lineHeight: "var(--lineHeight)",
        letterSpacing: "var(--letterSpacing)",

        "& .brz-menu__sub-menu": {
          fontSize: "var(--subMenuFontSize)",
          fontWeight: "var(--subMenuFontWeight)",
          lineHeight: "var(--subMenuLineHeight)",
          letterSpacing: "var(--subMenuLetterSpacing)"
        },
        "& .brz-mm-menu__item": {
          fontSize: "var(--mMenuFontSize)",
          fontWeight: "var(--mMenuFontWeight)",
          lineHeight: "var(--mMenuLineHeight)",
          letterSpacing: "var(--mMenuLetterSpacing)",

          "& .brz-a": {
            justifyContent: "var(--mMenuItemHorizontalAlign)"
          }
        },
        "& .mm-navbar": {
          fontFamily: "var(--mMenuFontFamily)",
          fontSize: "var(--mMenuFontSize)",
          fontWeight: "var(--mMenuFontWeight)",
          lineHeight: "var(--mMenuLineHeight)",
          letterSpacing: "var(--mMenuLetterSpacing)"
        },
        "& .brz-menu__item__icon": {
          fontSize: "var(--iconSize)"
        },
        "& .brz-mm-menu__item__icon": {
          marginRight: "var(--mMenuIconSpacing)",
          fontSize: "var(--mMenuIconSize)"
        },
        "&.mm-menu .mm-listitem_vertical .mm-btn_next": {
          height: `calc(var(--mMenuLineHeight) * var(--mMenuFontSize) + 18px)`
        }
      },
      ".brz-ed--tablet &": {
        fontSize: "var(--tabletFontSize)",
        fontWeight: "var(--tabletFontWeight)",
        lineHeight: "var(--tabletLineHeight)",
        letterSpacing: "var(--tabletLetterSpacing)",

        "& .brz-menu__sub-menu": {
          fontSize: "var(--tabletSubMenuFontSize)",
          fontWeight: "var(--tabletSubMenuFontWeight)",
          lineHeight: "var(--tabletSubMenuLineHeight)",
          letterSpacing: "var(--tabletSubMenuLetterSpacing)"
        },
        "& .brz-mm-menu__item": {
          fontSize: "var(--tabletMMenuFontSize)",
          fontWeight: "var(--tabletMMenuFontWeight)",
          lineHeight: "var(--tabletMMenuLineHeight)",
          letterSpacing: "var(--tabletMMenuLetterSpacing)",

          "& .brz-a": {
            justifyContent: "var(--tabletMMenuItemHorizontalAlign)"
          }
        },
        "& .mm-navbar": {
          fontFamily: "var(--mMenuFontFamily)",
          fontSize: "var(--tabletMMenuFontSize)",
          fontWeight: "var(--tabletMMenuFontWeight)",
          lineHeight: "var(--tabletMMenuLineHeight)",
          letterSpacing: "var(--tabletMMenuLetterSpacing)"
        },
        "& .brz-menu__item__icon": {
          fontSize: "var(--tabletIconSize)"
        },
        "& .brz-mm-menu__item__icon": {
          marginRight: "var(--tabletMMenuIconSpacing)",
          fontSize: "var(--tabletMMenuIconSize)"
        },
        "&.mm-menu .mm-listitem_vertical .mm-btn_next": {
          height: `calc(var(--tabletMMenuLineHeight) * var(--tabletMMenuFontSize) + 18px)`
        }
      },
      ".brz-ed--mobile &": {
        fontSize: "var(--mobileFontSize)",
        fontWeight: "var(--mobileFontWeight)",
        lineHeight: "var(--mobileLineHeight)",
        letterSpacing: "var(--mobileLetterSpacing)",

        "& .brz-menu__sub-menu": {
          fontSize: "var(--mobileSubMenuFontSize)",
          fontWeight: "var(--mobileSubMenuFontWeight)",
          lineHeight: "var(--mobileSubMenuLineHeight)",
          letterSpacing: "var(--mobileSubMenuLetterSpacing)"
        },
        "& .brz-mm-menu__item": {
          fontSize: "var(--mobileMMenuFontSize)",
          fontWeight: "var(--mobileMMenuFontWeight)",
          lineHeight: "var(--mobileMMenuLineHeight)",
          letterSpacing: "var(--mobileMMenuLetterSpacing)",

          "& .brz-a": {
            justifyContent: "var(--mobileMMenuItemHorizontalAlign)"
          }
        },
        "& .mm-navbar": {
          fontFamily: "var(--mMenuFontFamily)",
          fontSize: "var(--mobileMMenuFontSize)",
          fontWeight: "var(--mobileMMenuFontWeight)",
          lineHeight: "var(--mobileMMenuLineHeight)",
          letterSpacing: "var(--mobileMMenuLetterSpacing)"
        },
        "& .brz-menu__item__icon": {
          fontSize: "var(--mobileIconSize)"
        },
        "& .brz-mm-menu__item__icon": {
          marginRight: "var(--mobileMMenuIconSpacing)",
          fontSize: "var(--mobileMMenuIconSize)"
        },
        "&.mm-menu .mm-listitem_vertical .mm-btn_next": {
          height: `calc(var(--mobileMMenuLineHeight) * var(--mobileMMenuFontSize) + 18px)`
        }
      }
    };
  } else {
    const {
      colorHex,
      colorOpacity,
      hoverColorHex,
      hoverColorOpacity,
      fontFamily,
      fontWeight,
      fontSize,
      lineHeight,
      letterSpacing,
      tabletFontSize,
      tabletFontWeight,
      tabletLineHeight,
      tabletLetterSpacing,
      mobileFontSize,
      mobileFontWeight,
      mobileLineHeight,
      mobileLetterSpacing,
      iconSize,
      iconSpacing,
      itemPaddingTop,
      itemPaddingRight,
      itemPaddingBottom,
      itemPaddingLeft,
      tabletIconSize,
      mobileIconSize,
      subMenuIconSize,
      subMenuIconSpacing,
      subMenuColorHex,
      subMenuColorOpacity,
      subMenuHoverColorHex,
      subMenuHoverColorOpacity,
      subMenuBgColorHex,
      subMenuBgColorOpacity,
      subMenuHoverBgColorHex,
      subMenuHoverBgColorOpacity,
      subMenuBorderColorHex,
      subMenuBorderColorOpacity,
      subMenuHoverBorderColorHex,
      subMenuHoverBorderColorOpacity,
      subMenuBorderWidth,
      subMenuBorderStyle,
      subMenuFontFamily,
      subMenuFontWeight,
      subMenuFontSize,
      subMenuLineHeight,
      subMenuLetterSpacing,
      tabletSubMenuFontSize,
      tabletSubMenuFontWeight,
      tabletSubMenuLineHeight,
      tabletSubMenuLetterSpacing,
      mobileSubMenuFontSize,
      mobileSubMenuFontWeight,
      mobileSubMenuLineHeight,
      mobileSubMenuLetterSpacing,
      mMenuIconSize,
      mMenuIconSpacing,
      mMenuColorHex,
      mMenuColorOpacity,
      mMenuHoverColorHex,
      mMenuHoverColorOpacity,
      mMenuBgColorHex,
      mMenuBgColorOpacity,
      mMenuBorderColorHex,
      mMenuBorderColorOpacity,
      mMenuFontFamily,
      mMenuFontWeight,
      mMenuFontSize,
      mMenuLineHeight,
      mMenuLetterSpacing,
      mMenuItemHorizontalAlign,
      tabletMMenuFontSize,
      tabletMMenuFontWeight,
      tabletMMenuLineHeight,
      tabletMMenuLetterSpacing,
      tabletMMenuIconSize,
      tabletMMenuIconSpacing,
      mobileMMenuFontSize,
      mobileMMenuFontWeight,
      mobileMMenuLineHeight,
      mobileMMenuLetterSpacing,
      mobileMMenuIconSize,
      mobileMMenuIconSpacing
    } = v;

    glamorObj = {
      ".brz &": {
        color: hexToRgba(colorHex, colorOpacity),
        fontFamily: getFontById(fontFamily).family,
        fontWeight: fontWeight,
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
        letterSpacing: `${letterSpacing}px`,

        "& .brz-menu__sub-menu": {
          color: hexToRgba(subMenuColorHex, subMenuColorOpacity),
          fontFamily: getFontById(subMenuFontFamily).family,
          fontWeight: subMenuFontWeight,
          fontSize: `${subMenuFontSize}px`,
          lineHeight: subMenuLineHeight,
          letterSpacing: `${subMenuLetterSpacing}px`,

          "& .brz-a:hover": {
            color: hexToRgba(subMenuHoverColorHex, subMenuHoverColorOpacity)
          }
        },
        "& .brz-mm-menu__item": {
          color: hexToRgba(mMenuColorHex, mMenuColorOpacity),
          fontFamily: getFontById(mMenuFontFamily).family,
          fontSize: `${mMenuFontSize}`,
          fontWeight: mMenuFontWeight,
          lineHeight: mMenuLineHeight,
          letterSpacing: `${mMenuLetterSpacing}`,

          "& .brz-a:hover": {
            color: hexToRgba(mMenuHoverColorHex, mMenuHoverColorOpacity)
          },
          "& .brz-a": {
            justifyContent: aligns[mMenuItemHorizontalAlign]
          }
        },
        "& .mm-navbar": {
          color: hexToRgba(mMenuColorHex, mMenuColorOpacity),
          fontFamily: getFontById(mMenuFontFamily).family,
          fontSize: `${mMenuFontSize}`,
          fontWeight: mMenuFontWeight,
          lineHeight: mMenuLineHeight,
          letterSpacing: `${mMenuLetterSpacing}`
        },
        // Spacing for 0 level menu item
        "& .brz-menu__ul:not(.mm-listview)": {
          marginTop: `${itemPaddingTop}px`,
          marginRight: `${parseFloat(-itemPaddingRight / 2)}px`,
          marginBottom: `${itemPaddingBottom}px`,
          marginLeft: `${parseFloat(-itemPaddingLeft / 2)}px`
        },
        "& .brz-menu__ul > .brz-menu__item": {
          paddingTop: `${itemPaddingTop}px`,
          marginRight: `${parseFloat(itemPaddingRight / 2)}px`,
          paddingBottom: `${itemPaddingBottom}px`,
          marginLeft: `${parseFloat(itemPaddingLeft / 2)}px`,

          "& > .brz-a:hover": {
            color: hexToRgba(hoverColorHex, hoverColorOpacity)
          }
        },
        "& .brz-menu__item__icon": {
          marginRight: `${iconSpacing}px`,
          fontSize: `${iconSize}px`
        },
        "& .brz-menu__sub-item__icon": {
          marginRight: `${subMenuIconSpacing}px`,
          fontSize: `${subMenuIconSize}px`
        },
        "& .brz-mm-menu__item__icon": {
          marginRight: `${mMenuIconSpacing}px`,
          fontSize: `${mMenuIconSize}px`
        },

        // Background Color for Dropdown
        "&:not(.mm-menu) .brz-menu__item-dropdown .brz-menu__item": {
          backgroundColor: hexToRgba(subMenuBgColorHex, subMenuBgColorOpacity),

          "&:hover": {
            backgroundColor: hexToRgba(
              subMenuHoverBgColorHex,
              subMenuHoverBgColorOpacity
            )
          }
        },

        // Color for dropdown arrow
        "&:not(.mm-menu) .brz-menu__ul > .brz-menu__item-dropdown > .brz-menu__dropdown:after": {
          borderBottomColor: hexToRgba(subMenuBgColorHex, subMenuBgColorOpacity)
        },
        "& .brz-menu__dropdown-left::after": {
          borderLeftColor: hexToRgba(subMenuBgColorHex, subMenuBgColorOpacity)
        },
        "& .brz-menu__dropdown-right::after": {
          borderRightColor: hexToRgba(subMenuBgColorHex, subMenuBgColorOpacity)
        },

        // Dropdown Menu Items
        "& .brz-menu__dropdown > .brz-menu__item:not(:last-child)": {
          borderBottomWidth: `${subMenuBorderWidth}px`,
          borderBottomStyle: subMenuBorderStyle,
          borderBottomColor: hexToRgba(
            subMenuBorderColorHex,
            subMenuBorderColorOpacity
          ),

          "&:hover": {
            borderBottomColor: hexToRgba(
              subMenuHoverBorderColorHex,
              subMenuHoverBorderColorOpacity
            )
          }
        },

        // MMenu Style
        "&.mm-menu.mm-menu_theme-dark": {
          backgroundColor: hexToRgba(mMenuBgColorHex, mMenuBgColorOpacity),
          borderColor: hexToRgba(mMenuBorderColorHex, mMenuBorderColorOpacity),

          "& .mm-btn_next:after, & .mm-btn_prev:after, & .mm-btn_prev:before": {
            borderColor: hexToRgba(mMenuColorHex, mMenuColorOpacity)
          },
          "& .mm-btn_next:before, & .mm-listitem_opened > .brz-a:after": {
            borderColor: hexToRgba(mMenuBorderColorHex, mMenuBorderColorOpacity)
          }
        },
        "&.mm-menu .mm-listitem_vertical .mm-btn_next": {
          height: `${mMenuLineHeight * mMenuFontSize + 18}px`
        }
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          fontSize: `${tabletFontSize}px`,
          fontWeight: tabletFontWeight,
          lineHeight: tabletLineHeight,
          letterSpacing: `${tabletLetterSpacing}px`,

          "& .brz-menu__sub-menu": {
            fontSize: `${tabletSubMenuFontSize}px`,
            fontWeight: tabletSubMenuFontWeight,
            lineHeight: tabletSubMenuLineHeight,
            letterSpacing: `${tabletSubMenuLetterSpacing}px`
          },
          "& .brz-mm-menu__item": {
            fontSize: `${tabletMMenuFontSize}`,
            fontWeight: tabletMMenuFontWeight,
            lineHeight: tabletMMenuLineHeight,
            letterSpacing: `${tabletMMenuLetterSpacing}`,

            "& .brz-a": {
              justifyContent:
                aligns[tabletSyncOnChange(v, "mMenuItemHorizontalAlign")]
            }
          },
          "& .mm-navbar": {
            fontSize: `${tabletMMenuFontSize}`,
            fontWeight: tabletMMenuFontWeight,
            lineHeight: tabletMMenuLineHeight,
            letterSpacing: `${tabletMMenuLetterSpacing}`
          },
          "& .brz-menu__item__icon": {
            fontSize: `${tabletIconSize}px`
          },
          "& .brz-mm-menu__item__icon": {
            marginRight: `${tabletMMenuIconSpacing}px`,
            fontSize: `${tabletMMenuIconSize}px`
          },
          "&.mm-menu .mm-listitem_vertical .mm-btn_next": {
            height: `${tabletMMenuLineHeight * tabletMMenuFontSize + 18}px`
          }
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          fontSize: `${mobileFontSize}px`,
          fontWeight: mobileFontWeight,
          lineHeight: mobileLineHeight,
          letterSpacing: `${mobileLetterSpacing}px`,

          "& .brz-menu__sub-menu": {
            fontSize: `${mobileSubMenuFontSize}px`,
            fontWeight: mobileSubMenuFontWeight,
            lineHeight: mobileSubMenuLineHeight,
            letterSpacing: `${mobileSubMenuLetterSpacing}px`
          },
          "& .brz-mm-menu__item": {
            fontSize: `${mobileMMenuFontSize}`,
            fontWeight: mobileMMenuFontWeight,
            lineHeight: mobileMMenuLineHeight,
            letterSpacing: `${mobileMMenuLetterSpacing}`,

            "& .brz-a": {
              justifyContent:
                aligns[mobileSyncOnChange(v, "mMenuItemHorizontalAlign")]
            }
          },
          "& .mm-navbar": {
            fontSize: `${mobileMMenuFontSize}`,
            fontWeight: mobileMMenuFontWeight,
            lineHeight: mobileMMenuLineHeight,
            letterSpacing: `${mobileMMenuLetterSpacing}`
          },
          "& .brz-menu__item__icon": {
            fontSize: `${mobileIconSize}px`
          },
          "& .brz-mm-menu__item__icon": {
            marginRight: `${mobileMMenuIconSpacing}px`,
            fontSize: `${mobileMMenuIconSize}px`
          },
          "&.mm-menu .mm-listitem_vertical .mm-btn_next": {
            height: `${mobileMMenuLineHeight * mobileMMenuFontSize + 18}px`
          }
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames(
    "brz-menu",
    {
      "brz-menu--has-dropdown":
        hasMMenu && items.some(({ value: { items } }) => items.length)
    },
    IS_PREVIEW ? "brz-menu__preview" : "brz-menu__editor",
    glamorClassName,
    className
  );
}

export function styleMenuCSSVars(v) {
  if (IS_PREVIEW) {
    return;
  }

  const {
    colorHex,
    colorOpacity,
    hoverColorHex,
    hoverColorOpacity,
    fontFamily,
    fontWeight,
    fontSize,
    lineHeight,
    letterSpacing,
    tabletFontSize,
    tabletFontWeight,
    tabletLineHeight,
    tabletLetterSpacing,
    mobileFontSize,
    mobileFontWeight,
    mobileLineHeight,
    mobileLetterSpacing,
    iconSize,
    iconSpacing,
    itemPaddingTop,
    itemPaddingRight,
    itemPaddingBottom,
    itemPaddingLeft,
    tabletIconSize,
    mobileIconSize,
    subMenuIconSize,
    subMenuIconSpacing,
    subMenuColorHex,
    subMenuColorOpacity,
    subMenuHoverColorHex,
    subMenuHoverColorOpacity,
    subMenuBgColorHex,
    subMenuBgColorOpacity,
    subMenuHoverBgColorHex,
    subMenuHoverBgColorOpacity,
    subMenuBorderColorHex,
    subMenuBorderColorOpacity,
    subMenuHoverBorderColorHex,
    subMenuHoverBorderColorOpacity,
    subMenuBorderWidth,
    subMenuBorderStyle,
    subMenuFontFamily,
    subMenuFontWeight,
    subMenuFontSize,
    subMenuLineHeight,
    subMenuLetterSpacing,
    tabletSubMenuFontSize,
    tabletSubMenuFontWeight,
    tabletSubMenuLineHeight,
    tabletSubMenuLetterSpacing,
    mobileSubMenuFontSize,
    mobileSubMenuFontWeight,
    mobileSubMenuLineHeight,
    mobileSubMenuLetterSpacing,
    mMenuIconSize,
    mMenuIconSpacing,
    mMenuColorHex,
    mMenuColorOpacity,
    mMenuHoverColorHex,
    mMenuHoverColorOpacity,
    mMenuBgColorHex,
    mMenuBgColorOpacity,
    mMenuBorderColorHex,
    mMenuBorderColorOpacity,
    mMenuFontFamily,
    mMenuFontWeight,
    mMenuFontSize,
    mMenuLineHeight,
    mMenuLetterSpacing,
    mMenuItemHorizontalAlign,
    tabletMMenuFontSize,
    tabletMMenuFontWeight,
    tabletMMenuLineHeight,
    tabletMMenuLetterSpacing,
    tabletMMenuIconSize,
    tabletMMenuIconSpacing,
    mobileMMenuFontSize,
    mobileMMenuFontWeight,
    mobileMMenuLineHeight,
    mobileMMenuLetterSpacing,
    mobileMMenuIconSize,
    mobileMMenuIconSpacing
  } = v;

  return {
    "--color": hexToRgba(colorHex, colorOpacity),
    "--hoverColor": hexToRgba(hoverColorHex, hoverColorOpacity),
    "--fontFamily": getFontById(fontFamily).family,
    "--fontWeight": fontWeight,
    "--fontSize": `${fontSize}px`,
    "--lineHeight": lineHeight,
    "--letterSpacing": `${letterSpacing}px`,

    // Tablet
    "--tabletFontSize": `${tabletFontSize}px`,
    "--tabletFontWeight": tabletFontWeight,
    "--tabletLineHeight": tabletLineHeight,
    "--tabletLetterSpacing": `${tabletLetterSpacing}px`,

    // Mobile
    "--mobileFontSize": `${mobileFontSize}px`,
    "--mobileFontWeight": mobileFontWeight,
    "--mobileLineHeight": mobileLineHeight,
    "--mobileLetterSpacing": `${mobileLetterSpacing}px`,

    "--iconSize": `${iconSize}px`,
    "--iconSpacing": `${iconSpacing}px`,

    "--tabletIconSize": `${tabletIconSize}px`,
    "--mobileIconSize": `${mobileIconSize}px`,

    "--itemPaddingTop": `${itemPaddingTop}px`,
    "--itemPaddingRight": `${parseFloat(itemPaddingRight / 2)}px`,
    "--itemPaddingBottom": `${itemPaddingBottom}px`,
    "--itemPaddingLeft": `${parseFloat(itemPaddingLeft / 2)}px`,

    "--itemMarginTop": `${-itemPaddingTop}px`,
    "--itemMarginRight": `${parseFloat(-itemPaddingRight / 2)}px`,
    "--itemMarginBottom": `${-itemPaddingBottom}px`,
    "--itemMarginLeft": `${parseFloat(-itemPaddingLeft / 2)}px`,

    "--subMenuIconSize": `${subMenuIconSize}px`,
    "--subMenuIconSpacing": `${subMenuIconSpacing}px`,
    "--subMenuColor": hexToRgba(subMenuColorHex, subMenuColorOpacity),
    "--subMenuHoverColor": hexToRgba(
      subMenuHoverColorHex,
      subMenuHoverColorOpacity
    ),
    "--subMenuBgColor": hexToRgba(subMenuBgColorHex, subMenuBgColorOpacity),
    "--subMenuHoverBgColor": hexToRgba(
      subMenuHoverBgColorHex,
      subMenuHoverBgColorOpacity
    ),
    "--subMenuBorderColor": hexToRgba(
      subMenuBorderColorHex,
      subMenuBorderColorOpacity
    ),
    "--subMenuHoverBorderColor": hexToRgba(
      subMenuHoverBorderColorHex,
      subMenuHoverBorderColorOpacity
    ),
    "--subMenuBorderWidth": `${subMenuBorderWidth}px`,
    "--subMenuBorderStyle": subMenuBorderStyle,

    "--subMenuFontFamily": getFontById(subMenuFontFamily).family,
    "--subMenuFontWeight": subMenuFontWeight,
    "--subMenuFontSize": `${subMenuFontSize}px`,
    "--subMenuLineHeight": subMenuLineHeight,
    "--subMenuLetterSpacing": `${subMenuLetterSpacing}px`,

    // Tablet
    "--tabletSubMenuFontSize": `${tabletSubMenuFontSize}px`,
    "--tabletSubMenuFontWeight": tabletSubMenuFontWeight,
    "--tabletSubMenuLineHeight": tabletSubMenuLineHeight,
    "--tabletSubMenuLetterSpacing": `${tabletSubMenuLetterSpacing}px`,

    // Mobile
    "--mobileSubMenuFontSize": `${mobileSubMenuFontSize}px`,
    "--mobileSubMenuFontWeight": mobileSubMenuFontWeight,
    "--mobileSubMenuLineHeight": mobileSubMenuLineHeight,
    "--mobileSubMenuLetterSpacing": `${mobileSubMenuLetterSpacing}px`,

    "--mMenuIconSize": `${mMenuIconSize}px`,
    "--mMenuIconSpacing": `${mMenuIconSpacing}px`,
    "--mMenuColor": hexToRgba(mMenuColorHex, mMenuColorOpacity),
    "--mMenuHoverColor": hexToRgba(mMenuHoverColorHex, mMenuHoverColorOpacity),
    "--mMenuBgColor": hexToRgba(mMenuBgColorHex, mMenuBgColorOpacity),
    "--mMenuBorderColor": hexToRgba(
      mMenuBorderColorHex,
      mMenuBorderColorOpacity
    ),
    "--mMenuFontFamily": getFontById(mMenuFontFamily).family,
    "--mMenuFontWeight": mMenuFontWeight,
    "--mMenuFontSize": `${mMenuFontSize}px`,
    "--mMenuLineHeight": mMenuLineHeight,
    "--mMenuLetterSpacing": `${mMenuLetterSpacing}px`,
    "--mMenuItemHorizontalAlign": aligns[mMenuItemHorizontalAlign],

    // Tablet
    "--tabletMMenuIconSize": `${tabletMMenuIconSize}px`,
    "--tabletMMenuIconSpacing": `${tabletMMenuIconSpacing}px`,
    "--tabletMMenuFontSize": `${tabletMMenuFontSize}px`,
    "--tabletMMenuFontWeight": tabletMMenuFontWeight,
    "--tabletMMenuLineHeight": tabletMMenuLineHeight,
    "--tabletMMenuLetterSpacing": `${tabletMMenuLetterSpacing}px`,
    "--tabletMMenuItemHorizontalAlign":
      aligns[tabletSyncOnChange(v, "mMenuItemHorizontalAlign")],

    // Mobile
    "--mobileMMenuIconSize": `${mobileMMenuIconSize}px`,
    "--mobileMMenuIconSpacing": `${mobileMMenuIconSpacing}px`,
    "--mobileMMenuFontSize": `${mobileMMenuFontSize}px`,
    "--mobileMMenuFontWeight": mobileMMenuFontWeight,
    "--mobileMMenuLineHeight": mobileMMenuLineHeight,
    "--mobileMMenuLetterSpacing": `${mobileMMenuLetterSpacing}px`,
    "--mobileMMenuItemHorizontalAlign":
      aligns[mobileSyncOnChange(v, "mMenuItemHorizontalAlign")]
  };
}
