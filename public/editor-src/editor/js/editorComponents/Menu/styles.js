import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";
import { getFontById } from "visual/utils/fonts";
import { mobileSyncOnChange, tabletSyncOnChange } from "visual/utils/onChange";
import { styleColor, styleBoxShadow } from "visual/utils/style";

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
          borderColor: "var(--mMenuBorderColor)",

          "&:hover > .mm-listitem__text, .mm-btn_next:hover, &.mm-listitem_opened": {
            color: "var(--mMenuHoverColor)"
          }
        },
        "& .brz-menu__sub-menu": {
          fontFamily: "var(--subMenuFontFamily)",
          color: "var(--subMenuColor)",
          borderTopLeftRadius: "var(--borderTopLeftRadius)",
          borderTopRightRadius: "var(--borderTopRightRadius)",
          borderBottomLeftRadius: "var(--borderBottomLeftRadius)",
          borderBottomRightRadius: "var(--borderBottomRightRadius)",
          boxShadow: "var(--subMenuBoxShadow)",

          "&:hover": {
            boxShadow: "var(--subMenuHoverBoxShadow)"
          },

          "& .brz-a:hover": {
            color: "var(--subMenuHoverColor)"
          }
        },
        "& .mm-navbar": {
          color: "var(--mMenuColor)"
        },
        "& .brz-menu__ul > .brz-menu__item": {
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
        "&:not(.mm-menu) .brz-menu__dropdown .brz-menu__item-dropdown": {
          "&:after": {
            borderColor: "var(--subMenuColor)"
          },
          "&:hover:after": {
            borderColor: "var(--subMenuHoverColor)"
          }
        },

        // Dropdown Menu Items
        "& .brz-menu__dropdown > .brz-menu__item:not(:last-child)": {
          borderBottomWidth: "var(--subMenuBorderWidth)",
          borderBottomStyle: "var(--subMenuBorderStyle)",
          borderBottomColor: "var(--subMenuBorderColor)"
        },

        // MMenu Style
        "&.mm-menu.mm-menu_theme-dark": {
          "& .mm-panels, & .mm-panels > .mm-panel": {
            backgroundColor: "var(--mMenuBgColor)"
          },
          "& .mm-navbar.mm-listitem, & .mm-listitem_opened > .mm-listitem__text:after": {
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
          height: `calc(var(--mMenuLineHeight) * var(--mMenuFontSize) + 19px)`
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
          marginLeft: "var(--itemPaddingLeft)"
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
          height: `calc(var(--tabletMMenuLineHeight) * var(--tabletMMenuFontSize) + 19px)`
        },

        // Spacing for 0 level menu item
        "& .brz-menu__ul:not(.mm-listview)": {
          marginTop: "var(--tabletItemMarginTop)",
          marginRight: "var(--tabletItemMarginRight)",
          marginBottom: "var(--tabletItemMarginBottom)",
          marginLeft: "var(--tabletItemMarginLeft)"
        },
        "& .brz-menu__ul > .brz-menu__item": {
          paddingTop: "var(--tabletItemPaddingTop)",
          marginRight: "var(--tabletItemPaddingRight)",
          paddingBottom: "var(--tabletItemPaddingBottom)",
          marginLeft: "var(--tabletItemPaddingLeft)"
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
          height: `calc(var(--mobileMMenuLineHeight) * var(--mobileMMenuFontSize) + 19px)`
        },

        // Spacing for 0 level menu item
        "& .brz-menu__ul:not(.mm-listview)": {
          marginTop: "var(--mobileItemMarginTop)",
          marginRight: "var(--mobileItemMarginRight)",
          marginBottom: "var(--mobileItemMarginBottom)",
          marginLeft: "var(--mobileItemMarginLeft)"
        },
        "& .brz-menu__ul > .brz-menu__item": {
          paddingTop: "var(--mobileItemPaddingTop)",
          marginRight: "var(--mobileItemPaddingRight)",
          paddingBottom: "var(--mobileItemPaddingBottom)",
          marginLeft: "var(--mobileItemPaddingLeft)"
        }
      }
    };
  } else {
    const {
      fontFamily,
      fontFamilyType,
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
      subMenuHoverColorHex,
      subMenuHoverColorOpacity,
      subMenuBgColorHex,
      subMenuBgColorOpacity,
      subMenuHoverBgColorHex,
      subMenuHoverBgColorOpacity,
      subMenuBorderColorHex,
      subMenuBorderColorOpacity,
      subMenuBorderWidth,
      subMenuBorderStyle,
      subMenuFontFamily,
      subMenuFontFamilyType,
      subMenuFontWeight,
      subMenuFontSize,
      subMenuLineHeight,
      subMenuLetterSpacing,
      borderRadiusType,
      borderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
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
      mMenuFontFamilyType,
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
      tabletItemPaddingTop,
      tabletItemPaddingRight,
      tabletItemPaddingBottom,
      tabletItemPaddingLeft,
      mobileMMenuFontSize,
      mobileMMenuFontWeight,
      mobileMMenuLineHeight,
      mobileMMenuLetterSpacing,
      mobileMMenuIconSize,
      mobileMMenuIconSpacing,
      mobileItemPaddingTop,
      mobileItemPaddingRight,
      mobileItemPaddingBottom,
      mobileItemPaddingLeft
    } = v;

    glamorObj = {
      ".brz &": {
        color: styleColor({ v, device: "desktop", state: "normal" }),
        fontFamily: getFontById({ family: fontFamily, type: fontFamilyType })
          .family,
        fontWeight: fontWeight,
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
        letterSpacing: `${letterSpacing}px`,

        "& .brz-menu__sub-menu": {
          color: styleColor({
            v,
            device: "desktop",
            state: "normal",
            prefix: "subMenuColor"
          }),
          fontFamily: getFontById({
            family: subMenuFontFamily,
            type: subMenuFontFamilyType
          }).family,
          fontWeight: subMenuFontWeight,
          fontSize: `${subMenuFontSize}px`,
          lineHeight: subMenuLineHeight,
          letterSpacing: `${subMenuLetterSpacing}px`,
          borderTopLeftRadius:
            borderRadiusType === "grouped"
              ? `${borderRadius}px`
              : `${borderTopLeftRadius}px`,
          borderTopRightRadius:
            borderRadiusType === "grouped"
              ? `${borderRadius}px`
              : `${borderTopRightRadius}px`,
          borderBottomLeftRadius:
            borderRadiusType === "grouped"
              ? `${borderRadius}px`
              : `${borderBottomLeftRadius}px`,
          borderBottomRightRadius:
            borderRadiusType === "grouped"
              ? `${borderRadius}px`
              : `${borderBottomRightRadius}px`,
          boxShadow: styleBoxShadow({ v, device: "desktop", state: "normal" }),

          "&:hover": {
            boxShadow: styleBoxShadow({ v, device: "desktop", state: "hover" })
          },

          "& .brz-a:hover": {
            color: hexToRgba(subMenuHoverColorHex, subMenuHoverColorOpacity)
          }
        },
        "& .brz-mm-menu__item": {
          color: hexToRgba(mMenuColorHex, mMenuColorOpacity),
          fontFamily: getFontById({
            family: mMenuFontFamily,
            type: mMenuFontFamilyType
          }).family,
          fontSize: `${mMenuFontSize}`,
          fontWeight: mMenuFontWeight,
          lineHeight: mMenuLineHeight,
          letterSpacing: `${mMenuLetterSpacing}`,
          borderColor: hexToRgba(mMenuBorderColorHex, mMenuBorderColorOpacity),

          "&:hover > .mm-listitem__text, .mm-btn_next:hover, &.mm-listitem_opened": {
            color: hexToRgba(mMenuHoverColorHex, mMenuHoverColorOpacity)
          },
          "& .mm-listitem__text": {
            justifyContent: aligns[mMenuItemHorizontalAlign]
          }
        },
        "& .mm-navbar": {
          color: hexToRgba(mMenuColorHex, mMenuColorOpacity),
          fontFamily: getFontById({
            family: mMenuFontFamily,
            type: mMenuFontFamilyType
          }).family,
          fontSize: `${mMenuFontSize}`,
          fontWeight: mMenuFontWeight,
          lineHeight: mMenuLineHeight,
          letterSpacing: `${mMenuLetterSpacing}`,
          borderColor: hexToRgba(mMenuBorderColorHex, mMenuBorderColorOpacity)
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
            color: styleColor({ v, device: "desktop", state: "hover" })
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
        "&:not(.mm-menu) .brz-menu__dropdown .brz-menu__item-dropdown": {
          "&:after": {
            borderColor: styleColor({
              v,
              device: "desktop",
              state: "normal",
              prefix: "subMenuColor"
            })
          },
          "&:hover:after": {
            borderColor: hexToRgba(
              subMenuHoverColorHex,
              subMenuHoverColorOpacity
            )
          }
        },

        // Dropdown Menu Items
        "& .brz-menu__dropdown > .brz-menu__item:not(:last-child)": {
          borderBottomWidth: `${subMenuBorderWidth}px`,
          borderBottomStyle: subMenuBorderStyle,
          borderBottomColor: hexToRgba(
            subMenuBorderColorHex,
            subMenuBorderColorOpacity
          )
        },

        // MMenu Style
        "&.mm-menu.mm-menu_theme-dark": {
          "& .mm-panels, & .mm-panels > .mm-panel": {
            backgroundColor: hexToRgba(mMenuBgColorHex, mMenuBgColorOpacity)
          },
          "& .mm-navbar.mm-listitem, & .mm-listitem_opened > .mm-listitem__text:after": {
            borderColor: hexToRgba(mMenuBorderColorHex, mMenuBorderColorOpacity)
          }
        },
        "&.mm-menu .mm-listitem_vertical .mm-btn_next": {
          height: `${mMenuLineHeight * mMenuFontSize + 19}px`
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
            height: `${tabletMMenuLineHeight * tabletMMenuFontSize + 19}px`
          },

          // Spacing for 0 level menu item
          "& .brz-menu__ul:not(.mm-listview)": {
            marginTop: `${tabletItemPaddingTop}px`,
            marginRight: `${parseFloat(-tabletItemPaddingRight / 2)}px`,
            marginBottom: `${tabletItemPaddingBottom}px`,
            marginLeft: `${parseFloat(-tabletItemPaddingLeft / 2)}px`
          },
          "& .brz-menu__ul > .brz-menu__item": {
            paddingTop: `${tabletItemPaddingTop}px`,
            marginRight: `${parseFloat(tabletItemPaddingRight / 2)}px`,
            paddingBottom: `${tabletItemPaddingBottom}px`,
            marginLeft: `${parseFloat(tabletItemPaddingLeft / 2)}px`
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
            height: `${mobileMMenuLineHeight * mobileMMenuFontSize + 19}px`
          },

          // Spacing for 0 level menu item
          "& .brz-menu__ul:not(.mm-listview)": {
            marginTop: `${mobileItemPaddingTop}px`,
            marginRight: `${parseFloat(-mobileItemPaddingRight / 2)}px`,
            marginBottom: `${mobileItemPaddingBottom}px`,
            marginLeft: `${parseFloat(-mobileItemPaddingLeft / 2)}px`
          },
          "& .brz-menu__ul > .brz-menu__item": {
            paddingTop: `${mobileItemPaddingTop}px`,
            marginRight: `${parseFloat(mobileItemPaddingRight / 2)}px`,
            paddingBottom: `${mobileItemPaddingBottom}px`,
            marginLeft: `${parseFloat(mobileItemPaddingLeft / 2)}px`
          }
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames(
    "brz-menu",
    {
      "brz-menu__mmenu": hasMMenu,
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
    fontFamily,
    fontFamilyType,
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
    subMenuHoverColorHex,
    subMenuHoverColorOpacity,
    subMenuBgColorHex,
    subMenuBgColorOpacity,
    subMenuHoverBgColorHex,
    subMenuHoverBgColorOpacity,
    subMenuBorderColorHex,
    subMenuBorderColorOpacity,
    subMenuBorderWidth,
    subMenuBorderStyle,
    subMenuFontFamily,
    subMenuFontFamilyType,
    subMenuFontWeight,
    subMenuFontSize,
    subMenuLineHeight,
    subMenuLetterSpacing,
    borderRadiusType,
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
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
    mMenuFontFamilyType,
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
    tabletItemPaddingTop,
    tabletItemPaddingRight,
    tabletItemPaddingBottom,
    tabletItemPaddingLeft,
    mobileMMenuFontSize,
    mobileMMenuFontWeight,
    mobileMMenuLineHeight,
    mobileMMenuLetterSpacing,
    mobileMMenuIconSize,
    mobileMMenuIconSpacing,
    mobileItemPaddingTop,
    mobileItemPaddingRight,
    mobileItemPaddingBottom,
    mobileItemPaddingLeft
  } = v;
  return {
    "--color": styleColor({ v, device: "desktop", state: "normal" }),
    "--hoverColor": styleColor({ v, device: "desktop", state: "hover" }),
    "--fontFamily": getFontById({ family: fontFamily, type: fontFamilyType })
      .family,
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
    "--subMenuColor": styleColor({
      v,
      device: "desktop",
      state: "normal",
      prefix: "subMenuColor"
    }),
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
    "--subMenuBorderWidth": `${subMenuBorderWidth}px`,
    "--subMenuBorderStyle": subMenuBorderStyle,

    "--subMenuFontFamily": getFontById({
      family: subMenuFontFamily,
      type: subMenuFontFamilyType
    }).family,
    "--subMenuFontWeight": subMenuFontWeight,
    "--subMenuFontSize": `${subMenuFontSize}px`,
    "--subMenuLineHeight": subMenuLineHeight,
    "--subMenuLetterSpacing": `${subMenuLetterSpacing}px`,
    "--subMenuBoxShadow": styleBoxShadow({
      v,
      device: "desktop",
      state: "normal"
    }),

    "--subMenuHoverBoxShadow": styleBoxShadow({
      v,
      device: "desktop",
      state: "hover"
    }),

    "--borderTopLeftRadius":
      borderRadiusType === "grouped"
        ? `${borderRadius}px`
        : `${borderTopLeftRadius}px`,
    "--borderTopRightRadius":
      borderRadiusType === "grouped"
        ? `${borderRadius}px`
        : `${borderTopRightRadius}px`,
    "--borderBottomLeftRadius":
      borderRadiusType === "grouped"
        ? `${borderRadius}px`
        : `${borderBottomLeftRadius}px`,
    "--borderBottomRightRadius":
      borderRadiusType === "grouped"
        ? `${borderRadius}px`
        : `${borderBottomRightRadius}px`,

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
    "--mMenuFontFamily": getFontById({
      family: mMenuFontFamily,
      type: mMenuFontFamilyType
    }).family,
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

    "--tabletItemPaddingTop": `${tabletItemPaddingTop}px`,
    "--tabletItemPaddingRight": `${parseFloat(tabletItemPaddingRight / 2)}px`,
    "--tabletItemPaddingBottom": `${tabletItemPaddingBottom}px`,
    "--tabletItemPaddingLeft": `${parseFloat(tabletItemPaddingLeft / 2)}px`,

    "--tabletItemMarginTop": `${-tabletItemPaddingTop}px`,
    "--tabletItemMarginRight": `${parseFloat(-tabletItemPaddingRight / 2)}px`,
    "--tabletItemMarginBottom": `${-tabletItemPaddingBottom}px`,
    "--tabletItemMarginLeft": `${parseFloat(-tabletItemPaddingLeft / 2)}px`,

    // Mobile
    "--mobileMMenuIconSize": `${mobileMMenuIconSize}px`,
    "--mobileMMenuIconSpacing": `${mobileMMenuIconSpacing}px`,
    "--mobileMMenuFontSize": `${mobileMMenuFontSize}px`,
    "--mobileMMenuFontWeight": mobileMMenuFontWeight,
    "--mobileMMenuLineHeight": mobileMMenuLineHeight,
    "--mobileMMenuLetterSpacing": `${mobileMMenuLetterSpacing}px`,
    "--mobileMMenuItemHorizontalAlign":
      aligns[mobileSyncOnChange(v, "mMenuItemHorizontalAlign")],

    "--mobileItemPaddingTop": `${mobileItemPaddingTop}px`,
    "--mobileItemPaddingRight": `${parseFloat(mobileItemPaddingRight / 2)}px`,
    "--mobileItemPaddingBottom": `${mobileItemPaddingBottom}px`,
    "--mobileItemPaddingLeft": `${parseFloat(mobileItemPaddingLeft / 2)}px`,

    "--mobileItemMarginTop": `${-mobileItemPaddingTop}px`,
    "--mobileItemMarginRight": `${parseFloat(-mobileItemPaddingRight / 2)}px`,
    "--mobileItemMarginBottom": `${-mobileItemPaddingBottom}px`,
    "--mobileItemMarginLeft": `${parseFloat(-mobileItemPaddingLeft / 2)}px`
  };
}
