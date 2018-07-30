import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";
import { getFontById } from "visual/utils/fonts";

// Accordion Style
export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz &": {
        fontFamily: "var(--fontFamily)",

        "& .brz-accordion__nav, & .brz-accordion__content": {
          color: "var(--color)",
          backgroundColor: "var(--backgroundColor)",
          borderColor: "var(--borderColor)",
          borderWidth: "var(--borderWidth)",
        },
        "& .brz-accordion__content": {
          marginTop: "var(--marginTop)"
        }
      },

      ".brz-ed--desktop &": {
        fontSize: "var(--fontSize)",
        lineHeight: "var(--lineHeight)",
        fontWeight: "var(--fontWeight)",
        letterSpacing: "var(--letterSpacing)",

        "& .brz-accordion__content": {
          paddingTop: "var(--paddingTop)",
          paddingRight: "var(--paddingRight)",
          paddingBottom: "var(--paddingBottom)",
          paddingLeft: "var(--paddingLeft)"
        },
      },
      ".brz-ed--mobile &": {
        fontSize: "var(--mobileFontSize)",
        lineHeight: "var(--mobileLineHeight)",
        fontWeight: "var(--mobileFontWeight)",
        letterSpacing: "var(--mobileLetterSpacing)",

        "& .brz-accordion__content": {
          paddingTop: "var(--mobilePaddingTop)",
          paddingRight: "var(--mobilePaddingRight)",
          paddingBottom: "var(--mobilePaddingBottom)",
          paddingLeft: "var(--mobilePaddingLeft)"
        },
      }
    };
  } else {
    const {
      fontFamily,
      fontSize,
      lineHeight,
      fontWeight,
      letterSpacing,
      colorHex,
      colorOpacity,
      bgColorHex,
      bgColorOpacity,
      borderWidth,
      borderColorHex,
      borderColorOpacity,
      paddingType,
      padding,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      mobilePaddingType,
      mobilePadding,
      mobilePaddingTop,
      mobilePaddingRight,
      mobilePaddingBottom,
      mobilePaddingLeft,
      mobileFontSize,
      mobileLineHeight,
      mobileFontWeight,
      mobileLetterSpacing
    } = v;

    glamorObj = {
      ".brz &": {
        fontFamily: getFontById(fontFamily).family,
        fontSize,
        lineHeight,
        fontWeight,
        letterSpacing,

        "& .brz-accordion__content": {
          marginTop: `-${borderWidth}px`,
          paddingTop:
            paddingType === "grouped" ? `${padding}px` : `${paddingTop}px`,
          paddingRight:
            paddingType === "grouped" ? `${padding}px` : `${paddingRight}px`,
          paddingBottom:
            paddingType === "grouped" ? `${padding}px` : `${paddingBottom}px`,
          paddingLeft:
            paddingType === "grouped" ? `${padding}px` : `${paddingLeft}px`,
        },
        "& .brz-accordion__nav, & .brz-accordion__content": {
          color: hexToRgba(colorHex, colorOpacity),
          backgroundColor: hexToRgba(bgColorHex, bgColorOpacity),
          borderColor: hexToRgba(borderColorHex, borderColorOpacity),
          borderWidth,
        },
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          fontSize: `${mobileFontSize}px`,
          lineHeight: mobileLineHeight,
          fontWeight: mobileFontWeight,
          letterSpacing: `${mobileLetterSpacing}px`,

          "& .brz-accordion__content": {
            paddingTop:
              mobilePaddingType === "grouped"
                ? `${mobilePadding}px`
                : `${mobilePaddingTop}px`,
            paddingRight:
              mobilePaddingType === "grouped"
                ? `${mobilePadding}px`
                : `${mobilePaddingRight}px`,
            paddingBottom:
              mobilePaddingType === "grouped"
                ? `${mobilePadding}px`
                : `${mobilePaddingBottom}px`,
            paddingLeft:
              mobilePaddingType === "grouped"
                ? `${mobilePadding}px`
                : `${mobilePaddingLeft}px`
          },
        },
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-accordion", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return null;

  const {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    colorHex,
    colorOpacity,
    bgColorHex,
    bgColorOpacity,
    borderWidth,
    borderColorHex,
    borderColorOpacity,
    mobileFontSize,
    mobileLineHeight,
    mobileFontWeight,
    mobileLetterSpacing,
    paddingType,
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    mobilePaddingType,
    mobilePadding,
    mobilePaddingTop,
    mobilePaddingRight,
    mobilePaddingBottom,
    mobilePaddingLeft
  } = v;

  return {
    // Typography
    "--fontFamily": getFontById(fontFamily).family,
    "--fontWeight": fontWeight,
    "--fontSize": `${fontSize}px`,
    "--lineHeight": lineHeight,
    "--letterSpacing": `${letterSpacing}px`,

    // Colors
    "--color": hexToRgba(colorHex, colorOpacity),
    "--backgroundColor": hexToRgba(bgColorHex, bgColorOpacity),
    "--borderColor": hexToRgba(borderColorHex, borderColorOpacity),

    // Border
    "--borderWidth": `${borderWidth}px`,
    "--marginTop": `-${borderWidth}px`,

    // Padding Tab
    "--paddingTop":
      paddingType === "grouped" ? `${padding}px` : `${paddingTop}px`,
    "--paddingRight":
      paddingType === "grouped" ? `${padding}px` : `${paddingRight}px`,
    "--paddingBottom":
      paddingType === "grouped" ? `${padding}px` : `${paddingBottom}px`,
    "--paddingLeft":
      paddingType === "grouped" ? `${padding}px` : `${paddingLeft}px`,
    "--mobilePaddingTop":
      mobilePaddingType === "grouped"
        ? `${mobilePadding}px`
        : `${mobilePaddingTop}px`,
    "--mobilePaddingRight":
      mobilePaddingType === "grouped"
        ? `${mobilePadding}px`
        : `${mobilePaddingRight}px`,
    "--mobilePaddingBottom":
      mobilePaddingType === "grouped"
        ? `${mobilePadding}px`
        : `${mobilePaddingBottom}px`,
    "--mobilePaddingLeft":
      mobilePaddingType === "grouped"
        ? `${mobilePadding}px`
        : `${mobilePaddingLeft}px`,

    // Mobile
    "--mobileFontSize": `${mobileFontSize}px`,
    "--mobileLineHeight": mobileLineHeight,
    "--mobileFontWeight": mobileFontWeight,
    "--mobileLetterSpacing": `${mobileLetterSpacing}px`,
  };
}
