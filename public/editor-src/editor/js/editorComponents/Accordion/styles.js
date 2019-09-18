import classnames from "classnames";
import { css } from "glamor";
import { getFontById } from "visual/utils/fonts";
import {
  styleBorderColor,
  styleColor,
  styleBgColor,
  styleBorderWidth
} from "visual/utils/style";

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
          borderWidth: "var(--borderWidth)"
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
        }
      },
      ".brz-ed--tablet &": {
        fontSize: "var(--tabletFontSize)",
        lineHeight: "var(--tabletLineHeight)",
        fontWeight: "var(--tabletFontWeight)",
        letterSpacing: "var(--tabletLetterSpacing)",

        "& .brz-accordion__content": {
          paddingTop: "var(--tabletPaddingTop)",
          paddingRight: "var(--tabletPaddingRight)",
          paddingBottom: "var(--tabletPaddingBottom)",
          paddingLeft: "var(--tabletPaddingLeft)"
        }
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
        }
      }
    };
  } else {
    const {
      fontFamily,
      fontFamilyType,
      fontSize,
      lineHeight,
      fontWeight,
      letterSpacing,
      borderWidth,
      paddingType,
      padding,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,

      // Tablet
      tabletPaddingType,
      tabletPadding,
      tabletPaddingTop,
      tabletPaddingRight,
      tabletPaddingBottom,
      tabletPaddingLeft,
      tabletFontSize,
      tabletLineHeight,
      tabletFontWeight,
      tabletLetterSpacing,

      // Mobile
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
        fontFamily: getFontById({ family: fontFamily, type: fontFamilyType })
          .family,
        fontSize,
        lineHeight,
        fontWeight,
        letterSpacing,

        "& .brz-accordion__content": {
          marginTop: `-${styleBorderWidth({
            v,
            device: "desktop",
            state: "normal",
            current: "borderWidth"
          })}`,
          paddingTop:
            paddingType === "grouped" ? `${padding}px` : `${paddingTop}px`,
          paddingRight:
            paddingType === "grouped" ? `${padding}px` : `${paddingRight}px`,
          paddingBottom:
            paddingType === "grouped" ? `${padding}px` : `${paddingBottom}px`,
          paddingLeft:
            paddingType === "grouped" ? `${padding}px` : `${paddingLeft}px`
        },
        "& .brz-accordion__nav, & .brz-accordion__content": {
          color: styleColor({ v, device: "desktop", state: "normal" }),
          backgroundColor: styleBgColor({
            v,
            device: "desktop",
            state: "normal"
          }),
          borderColor: styleBorderColor({
            v,
            device: "desktop",
            state: "normal"
          }),
          borderWidth: styleBorderWidth({
            v,
            device: "desktop",
            state: "normal",
            current: "borderWidth"
          })
        }
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          fontSize: `${tabletFontSize}px`,
          lineHeight: tabletLineHeight,
          fontWeight: tabletFontWeight,
          letterSpacing: `${tabletLetterSpacing}px`,

          "& .brz-accordion__content": {
            paddingTop:
              tabletPaddingType === "grouped"
                ? `${tabletPadding}px`
                : `${tabletPaddingTop}px`,
            paddingRight:
              tabletPaddingType === "grouped"
                ? `${tabletPadding}px`
                : `${tabletPaddingRight}px`,
            paddingBottom:
              tabletPaddingType === "grouped"
                ? `${tabletPadding}px`
                : `${tabletPaddingBottom}px`,
            paddingLeft:
              tabletPaddingType === "grouped"
                ? `${tabletPadding}px`
                : `${tabletPaddingLeft}px`
          }
        }
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
          }
        }
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
    fontFamilyType,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    borderWidth,
    paddingType,
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,

    // Tablet
    tabletPaddingType,
    tabletPadding,
    tabletPaddingTop,
    tabletPaddingRight,
    tabletPaddingBottom,
    tabletPaddingLeft,
    tabletFontSize,
    tabletLineHeight,
    tabletFontWeight,
    tabletLetterSpacing,

    // Mobile
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

  return {
    // Typography
    "--fontFamily": getFontById({ family: fontFamily, type: fontFamilyType })
      .family,
    "--fontWeight": fontWeight,
    "--fontSize": `${fontSize}px`,
    "--lineHeight": lineHeight,
    "--letterSpacing": `${letterSpacing}px`,

    // Colors
    "--color": styleColor({ v, device: "desktop", state: "normal" }),
    "--backgroundColor": styleBgColor({
      v,
      device: "desktop",
      state: "normal"
    }),
    "--borderColor": styleBorderColor({
      v,
      device: "desktop",
      state: "normal"
    }),

    // Border
    "--borderWidth": styleBorderWidth({
      v,
      device: "desktop",
      state: "normal",
      current: "borderWidth"
    }),
    "--marginTop": `-${styleBorderWidth({
      v,
      device: "desktop",
      state: "normal",
      current: "borderWidth"
    })}`,

    // Padding Tab
    "--paddingTop":
      paddingType === "grouped" ? `${padding}px` : `${paddingTop}px`,
    "--paddingRight":
      paddingType === "grouped" ? `${padding}px` : `${paddingRight}px`,
    "--paddingBottom":
      paddingType === "grouped" ? `${padding}px` : `${paddingBottom}px`,
    "--paddingLeft":
      paddingType === "grouped" ? `${padding}px` : `${paddingLeft}px`,

    // Tablet
    "--tabletFontSize": `${tabletFontSize}px`,
    "--tabletLineHeight": tabletLineHeight,
    "--tabletFontWeight": tabletFontWeight,
    "--tabletLetterSpacing": `${tabletLetterSpacing}px`,
    "--tabletPaddingTop":
      tabletPaddingType === "grouped"
        ? `${tabletPadding}px`
        : `${tabletPaddingTop}px`,
    "--tabletPaddingRight":
      tabletPaddingType === "grouped"
        ? `${tabletPadding}px`
        : `${tabletPaddingRight}px`,
    "--tabletPaddingBottom":
      tabletPaddingType === "grouped"
        ? `${tabletPadding}px`
        : `${tabletPaddingBottom}px`,
    "--tabletPaddingLeft":
      tabletPaddingType === "grouped"
        ? `${tabletPadding}px`
        : `${tabletPaddingLeft}px`,

    // Mobile
    "--mobileFontSize": `${mobileFontSize}px`,
    "--mobileLineHeight": mobileLineHeight,
    "--mobileFontWeight": mobileFontWeight,
    "--mobileLetterSpacing": `${mobileLetterSpacing}px`,
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
        : `${mobilePaddingLeft}px`
  };
}
