import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";
import { getFontById } from "visual/utils/fonts";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

export function containerStyleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz &": {
        backgroundColor: "var(--bg2Color)"
      },
      ".brz-ed--desktop &": {
        width: "var(--width)",
        borderRadius: "var(--borderRadius)"
      },
      ".brz-ed--tablet &": {
        width: "var(--tabletWidth)",
        borderRadius: "var(--tabletBorderRadius)"
      },
      ".brz-ed--mobile &": {
        width: "var(--mobileWidth)",
        borderRadius: "var(--mobileBorderRadius)"
      }
    };
  } else {
    const {
      // General
      width,
      borderRadius,

      // Color
      bg2ColorHex,
      bg2ColorOpacity
    } = v;

    glamorObj = {
      ".brz &": {
        width: `${width}%`,
        borderRadius: `${borderRadius}px`,
        backgroundColor: hexToRgba(bg2ColorHex, bg2ColorOpacity)
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          width: `${tabletSyncOnChange(v, "width")}%`,
          borderRadius: `${tabletSyncOnChange(v, "borderRadius")}px`
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          width: `${mobileSyncOnChange(v, "width")}%`,
          borderRadius: `${mobileSyncOnChange(v, "borderRadius")}px`
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-progress-bar", className, glamorClassName);
}

export function containerStyleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    // General
    width,
    borderRadius,

    // Color
    bg2ColorHex,
    bg2ColorOpacity
  } = v;

  return {
    "--width": `${width}%`,
    "--borderRadius": `${borderRadius}px`,
    "--bg2Color": hexToRgba(bg2ColorHex, bg2ColorOpacity),

    // Tablet
    "--tabletWidth": `${tabletSyncOnChange(v, "width")}%`,
    "--tabletBorderRadius": `${tabletSyncOnChange(v, "borderRadius")}px`,

    // Mobile
    "--mobileWidth": `${mobileSyncOnChange(v, "width")}%`,
    "--mobileBorderRadius": `${mobileSyncOnChange(v, "borderRadius")}px`
  };
}

export function styleClassName(v) {
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz &": {
        maxWidth: "var(--percentage)",
        padding: "var(--padding)",

        // Typography
        fontFamily: "var(--fontFamily)",

        // Color
        color: "var(--color)",
        backgroundColor: "var(--bgColor)"
      },
      ".brz-ed--desktop &": {
        fontSize: "var(--fontSize)",
        lineHeight: "var(--lineHeight)",
        fontWeight: "var(--fontWeight)",
        letterSpacing: "var(--letterSpacing)",
        borderRadius: "var(--borderRadius)"
      },
      ".brz-ed--tablet &": {
        fontSize: "var(--tabletFontSize)",
        lineHeight: "var(--tabletLineHeight)",
        fontWeight: "var(--tabletFontWeight)",
        letterSpacing: "var(--tabletLetterSpacing)",
        borderRadius: "var(--tabletBorderRadius)"
      },
      ".brz-ed--mobile &": {
        fontSize: "var(--mobileFontSize)",
        lineHeight: "var(--mobileLineHeight)",
        fontWeight: "var(--mobileFontWeight)",
        letterSpacing: "var(--mobileLetterSpacing)",
        borderRadius: "var(--mobileBorderRadius)"
      }
    };
  } else {
    const {
      percentage,
      borderRadius,

      // Typography
      fontSize,
      fontFamily,
      lineHeight,
      fontWeight,
      letterSpacing,

      // Color
      colorHex,
      colorOpacity,
      bgColorHex,
      bgColorOpacity,

      // Padding
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,

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
        maxWidth: `${percentage}%`,
        padding: `${paddingTop}px ${paddingRight}px`,
        borderRadius: `${borderRadius}px`,

        // Typography
        fontFamily: getFontById(fontFamily).family,
        fontSize,
        lineHeight,
        fontWeight,
        letterSpacing,

        // Color
        color: hexToRgba(colorHex, colorOpacity),
        backgroundColor: hexToRgba(bgColorHex, bgColorOpacity)
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          fontSize: `${tabletFontSize}px`,
          lineHeight: tabletLineHeight,
          fontWeight: tabletFontWeight,
          letterSpacing: `${tabletLetterSpacing}px`,
          borderRadius: `${tabletSyncOnChange(v, "borderRadius")}px`
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          fontSize: `${mobileFontSize}px`,
          lineHeight: mobileLineHeight,
          fontWeight: mobileFontWeight,
          letterSpacing: `${mobileLetterSpacing}px`,
          borderRadius: `${mobileSyncOnChange(v, "borderRadius")}px`
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames(
    "brz-d-xs-flex",
    "brz-justify-content-xs-between",
    "brz-align-items-xs-center",
    "brz-progress-bar__wrapper",
    glamorClassName
  );
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    percentage,
    borderRadius,

    // Typography
    fontSize,
    fontFamily,
    lineHeight,
    fontWeight,
    letterSpacing,

    // Color
    colorHex,
    colorOpacity,
    bgColorHex,
    bgColorOpacity,

    // Padding
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,

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
    // General
    "--percentage": `${percentage}%`,
    "--borderRadius": `${borderRadius}px`,
    "--padding": `${paddingTop}px ${paddingRight}px`,

    // Typography
    "--fontSize": `${fontSize}px`,
    "--fontFamily": getFontById(fontFamily).family,
    "--lineHeight": lineHeight,
    "--fontWeight": fontWeight,
    "--letterSpacing": `${letterSpacing}px`,

    // Color
    "--color": hexToRgba(colorHex, colorOpacity),
    "--bgColor": hexToRgba(bgColorHex, bgColorOpacity),

    // Tablet
    "--tabletFontSize": `${tabletFontSize}px`,
    "--tabletLineHeight": `${tabletLineHeight}`,
    "--tabletFontWeight": tabletFontWeight,
    "--tabletLetterSpacing": `${tabletLetterSpacing}px`,
    "--tabletBorderRadius": `${tabletSyncOnChange(v, "borderRadius")}px`,

    // Mobile
    "--mobileFontSize": `${mobileFontSize}px`,
    "--mobileLineHeight": `${mobileLineHeight}`,
    "--mobileFontWeight": mobileFontWeight,
    "--mobileLetterSpacing": `${mobileLetterSpacing}px`,
    "--mobileBorderRadius": `${mobileSyncOnChange(v, "borderRadius")}px`
  };
}
