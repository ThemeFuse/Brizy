import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";
import { getFontById } from "visual/utils/fonts";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if(IS_EDITOR) {
    glamorObj = {
      ".brz & .menu": {
        fontFamily: "var(--fontFamily)",
      },
      ".brz & .menu > .menu-item a": {
        color: "var(--color)",
      },
      ".brz-ed--desktop &": {
        maxWidth: "var(--maxWidth)",
        width: "var(--width)",

        "& .menu > .menu-item": {
          fontSize: "var(--fontSize)",
          lineHeight: "var(--lineHeight)",
          fontWeight: "var(--fontWeight)",
          letterSpacing: "var(--letterSpacing)",

          "&:not(:last-child)": {
            marginRight: "var(--itemPadding)",
          }
        }
      },
      ".brz-ed--mobile &": {
        maxWidth: "var(--mobileMaxWidth)",

        "& .menu > .menu-item": {
          fontSize: "var(--mobileFontSize)",
          lineHeight: "var(--mobileLineHeight)",
          fontWeight: "var(--mobileFontWeight)",
          letterSpacing: "var(--mobileLetterSpacing)",

          "&:not(:last-child)": {
            marginRight: "var(--mobileMarginRight)",
            marginBottom: "var(--mobileMarginBottom)",
          }
        },
        "& .brz-wp-shortcode__menu__icon--bars": {
          backgroundColor: "var(--color)",
          color: "var(--color)"
        },
        "& .menu .sub-menu": {
          display: "none"
        }
      }
    }
  } else {
    const {
      menuName,
      fontFamily,
      fontSize,
      lineHeight,
      fontWeight,
      letterSpacing,
      colorHex,
      colorOpacity,
      mobileFontSize,
      mobileLineHeight,
      mobileFontWeight,
      mobileLetterSpacing,
      width,
      itemPadding,
      mobileToggleMenu
    } = v;

    glamorObj = {
      ".brz &": {
        maxWidth: `${width}%`,
        width: menuName ? "auto" : "100%",
      },
      ".brz & .menu": {
        fontFamily: getFontById(fontFamily).family,
      },
      ".brz & .menu > .menu-item": {
        fontSize,
        lineHeight,
        fontWeight,
        letterSpacing,

        "& a": {
          color: hexToRgba(colorHex, colorOpacity),
        },
        "&:not(:last-child)": {
          marginRight: `${itemPadding}px`
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          maxWidth: `${mobileSyncOnChange(v, "width")}%`
        },
        ".brz & .menu > .menu-item": {
          fontSize: `${mobileFontSize}px`,
          lineHeight: mobileLineHeight,
          fontWeight: mobileFontWeight,
          letterSpacing: `${mobileLetterSpacing}px`,

          "&:not(:last-child)": {
            marginRight: mobileToggleMenu === "off" ? `${mobileSyncOnChange(v, "itemPadding")}px` : 0,
            marginBottom: mobileToggleMenu === "on" ? `${mobileSyncOnChange(v, "itemPadding")}px` : 0,
          }
        },
        ".brz & .menu .menu-item a": {
          color: hexToRgba(colorHex, colorOpacity),
        },
        "& .brz-wp-shortcode__menu__icon--bars": {
          backgroundColor: hexToRgba(colorHex, colorOpacity),
          color: hexToRgba(colorHex, colorOpacity)
        },
      }
    }
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-wp-shortcode__menu", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    menuName,
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    colorHex,
    colorOpacity,
    width,
    itemPadding,
    mobileFontSize,
    mobileLineHeight,
    mobileFontWeight,
    mobileLetterSpacing,
    mobileToggleMenu
  } = v;

  return {
    "--maxWidth": `${width}%`,
    "--itemPadding": `${itemPadding}px`,
    "--width": menuName ? "auto" : "100%",

    // Typography
    "--fontFamily": getFontById(fontFamily).family,
    "--fontWeight": fontWeight,
    "--fontSize": `${fontSize}px`,
    "--lineHeight": lineHeight,
    "--letterSpacing": `${letterSpacing}px`,

    // Colors
    "--color": hexToRgba(colorHex, colorOpacity),

    // Mobile
    "--mobileItemPadding": `${mobileSyncOnChange(v, "itemPadding")}px`,
    "--mobileMarginRight": mobileToggleMenu === "off" ? `${mobileSyncOnChange(v, "itemPadding")}px` : 0,
    "--mobileMarginBottom": mobileToggleMenu === "on" ? `${mobileSyncOnChange(v, "itemPadding")}px` : 0,
    "--mobileFontSize": `${mobileFontSize}px`,
    "--mobileLineHeight": mobileLineHeight,
    "--mobileFontWeight": mobileFontWeight,
    "--mobileLetterSpacing": `${mobileLetterSpacing}px`,
    "--mobileMaxWidth": `${mobileSyncOnChange(v, "width")}%`,
  };
}
