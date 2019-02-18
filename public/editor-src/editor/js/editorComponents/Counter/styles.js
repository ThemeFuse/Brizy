import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";
import { getFontById } from "visual/utils/fonts";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz &": {
        fontFamily: "var(--fontFamily)",
        color: "var(--color)"
      },
      ".brz-ed--desktop &": {
        fontSize: "var(--fontSize)",
        lineHeight: "var(--lineHeight)",
        fontWeight: "var(--fontWeight)",
        letterSpacing: "var(--letterSpacing)"
      },
      ".brz-ed--tablet &": {
        fontSize: "var(--tabletFontSize)",
        lineHeight: "var(--tabletLineHeight)",
        fontWeight: "var(--tabletFontWeight)",
        letterSpacing: "var(--tabletLetterSpacing)"
      },
      ".brz-ed--mobile &": {
        fontSize: "var(--mobileFontSize)",
        lineHeight: "var(--mobileLineHeight)",
        fontWeight: "var(--mobileFontWeight)",
        letterSpacing: "var(--mobileLetterSpacing)"
      },
      ".brz &:hover": {
        color: "var(--hoverColor)"
      }
    };
  } else {
    const {
      fontSize,
      fontFamily,
      lineHeight,
      fontWeight,
      letterSpacing,
      colorHex,
      colorOpacity,
      hoverColorHex,
      hoverColorOpacity,

      // Tablet
      tabletFontSize,
      tabletLineHeight,
      tabletFontWeight,
      tabletLetterSpacing,

      // Mobile
      mobileFontSize,
      mobileLineHeight,
      mobileFontWeight,
      mobileLetterSpacing
    } = v;

    glamorObj = {
      ".brz &": {
        color: hexToRgba(colorHex, colorOpacity),
        fontFamily: getFontById(fontFamily).family,
        fontSize,
        lineHeight,
        fontWeight,
        letterSpacing
      },
      ".brz &:hover": {
        color: hexToRgba(hoverColorHex, hoverColorOpacity)
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          fontSize: `${tabletFontSize}px`,
          lineHeight: tabletLineHeight,
          fontWeight: tabletFontWeight,
          letterSpacing: `${tabletLetterSpacing}px`
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          fontSize: `${mobileFontSize}px`,
          lineHeight: mobileLineHeight,
          fontWeight: mobileFontWeight,
          letterSpacing: `${mobileLetterSpacing}px`
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-counter", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    fontSize,
    fontFamily,
    lineHeight,
    fontWeight,
    letterSpacing,
    colorHex,
    colorOpacity,
    hoverColorHex,
    hoverColorOpacity,

    // Tablet
    tabletFontSize,
    tabletLineHeight,
    tabletFontWeight,
    tabletLetterSpacing,

    // Mobile
    mobileFontSize,
    mobileLineHeight,
    mobileFontWeight,
    mobileLetterSpacing
  } = v;

  return {
    "--fontSize": `${fontSize}px`,
    "--fontFamily": getFontById(fontFamily).family,
    "--fontWeight": fontWeight,
    "--lineHeight": lineHeight,
    "--letterSpacing": `${letterSpacing}px`,
    "--color": hexToRgba(colorHex, colorOpacity),
    "--hoverColor": hexToRgba(hoverColorHex, hoverColorOpacity),

    // Tablet
    "--tabletFontSize": `${tabletFontSize}px`,
    "--tabletLineHeight": tabletLineHeight,
    "--tabletFontWeight": tabletFontWeight,
    "--tabletLetterSpacing": `${tabletLetterSpacing}px`,

    // Mobile
    "--mobileFontSize": `${mobileFontSize}px`,
    "--mobileLineHeight": mobileLineHeight,
    "--mobileFontWeight": mobileFontWeight,
    "--mobileLetterSpacing": `${mobileLetterSpacing}px`
  };
}