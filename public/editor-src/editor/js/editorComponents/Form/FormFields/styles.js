import classnames from "classnames";
import { css } from "glamor";
import { getFontById } from "visual/utils/fonts";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import {
  styleColor,
  styleBgColor,
  styleBorderColor,
  styleBorderStyle,
  styleBorderWidth
} from "visual/utils/style";

// FormFields
export function styleClassName(v) {
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz & .brz-forms__item": {
        fontFamily: "var(--fontFamily)",
        color: "var(--color)",

        "& .brz-forms__field": {
          backgroundColor: "var(--backgroundColor)",
          borderColor: "var(--borderColor)",
          borderWidth: "var(--borderWidth)",
          borderStyle: "var(--borderStyle)"
        },
        "& .brz-forms__select-item__input": {
          color: "var(--color)"
        }
      },
      ".brz & .form-alert": {
        fontFamily: "var(--fontFamily)"
      },
      ".brz-ed--desktop &.brz-forms__fields": {
        marginRight: "var(--marginRight)",
        marginLeft: "var(--marginLeft)"
      },
      ".brz-ed--desktop & .brz-forms__item": {
        fontSize: "var(--fontSize)",
        lineHeight: "var(--lineHeight)",
        fontWeight: "var(--fontWeight)",
        letterSpacing: "var(--letterSpacing)",
        paddingRight: "var(--paddingRight)",
        paddingBottom: "var(--paddingBottom)",
        paddingLeft: "var(--paddingLeft)"
      },
      ".brz-ed--tablet &.brz-forms__fields": {
        marginRight: "var(--tabletMarginRight)",
        marginLeft: "var(--tabletMarginLeft)"
      },
      ".brz-ed--tablet & .brz-forms__item": {
        fontSize: "var(--tabletFontSize)",
        lineHeight: "var(--tabletLineHeight)",
        fontWeight: "var(--tabletFontWeight)",
        letterSpacing: "var(--tabletLetterSpacing)",
        paddingRight: "var(--tabletPaddingRight)",
        paddingBottom: "var(--tabletPaddingBottom)",
        paddingLeft: "var(--tabletPaddingLeft)"
      },
      ".brz-ed--mobile &.brz-forms__fields": {
        marginRight: "var(--mobileMarginRight)",
        marginLeft: "var(--mobileMarginLeft)"
      },
      ".brz-ed--mobile & .brz-forms__item": {
        fontSize: "var(--mobileFontSize)",
        lineHeight: "var(--mobileLineHeight)",
        fontWeight: "var(--mobileFontWeight)",
        letterSpacing: "var(--mobileLetterSpacing)",
        paddingRight: "var(--mobilePaddingRight)",
        paddingBottom: "var(--mobilePaddingBottom)",
        paddingLeft: "var(--mobilePaddingLeft)"
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
      paddingRight,
      paddingBottom,
      paddingLeft,
      borderWidth,

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
      marginRight: `-${paddingRight / 2}px`,
      marginLeft: `-${paddingLeft / 2}px`,

      ".brz & .brz-forms__item": {
        fontFamily: getFontById({ family: fontFamily, type: fontFamilyType })
          .family,
        fontSize,
        lineHeight,
        fontWeight,
        letterSpacing,
        color: styleColor({ v, device: "desktop", state: "normal" }),
        paddingRight: `${paddingRight / 2}px`,
        paddingBottom: `${paddingBottom}px`,
        paddingLeft: `${paddingLeft / 2}px`,

        "& .brz-forms__field, .brz-control__select-current": {
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
          }),
          borderStyle: styleBorderStyle({ v, device: "desktop" }),

          "&::placeholder": {
            color: styleColor({ v, device: "desktop", state: "normal" })
          }
        },
        "&.brz-forms__item--error .brz-forms__field": {
          borderWidth:
            borderWidth === 0
              ? "2px"
              : styleBorderWidth({
                  v,
                  device: "desktop",
                  state: "normal",
                  current: "borderWidth"
                })
        }
      },
      ".brz & .form-alert": {
        fontFamily: getFontById({ family: fontFamily, type: fontFamilyType })
          .family
      },
      "@media (max-width: 991px)": {
        ".brz &.brz-forms__fields": {
          marginRight: `-${tabletSyncOnChange(v, "paddingRight") / 2}px`,
          marginLeft: `-${tabletSyncOnChange(v, "paddingLeft") / 2}px`
        },
        ".brz & .brz-forms__item": {
          fontSize: `${tabletFontSize}px`,
          lineHeight: tabletLineHeight,
          fontWeight: tabletFontWeight,
          letterSpacing: `${tabletLetterSpacing}px`,
          paddingRight: `${tabletSyncOnChange(v, "paddingRight") / 2}px`,
          paddingBottom: `${tabletSyncOnChange(v, "paddingBottom")}px`,
          paddingLeft: `${tabletSyncOnChange(v, "paddingLeft") / 2}px`
        }
      },
      "@media (max-width: 767px)": {
        ".brz &.brz-forms__fields": {
          marginRight: `-${mobileSyncOnChange(v, "paddingRight") / 2}px`,
          marginLeft: `-${mobileSyncOnChange(v, "paddingLeft") / 2}px`
        },
        ".brz & .brz-forms__item": {
          fontSize: `${mobileFontSize}px`,
          lineHeight: mobileLineHeight,
          fontWeight: mobileFontWeight,
          letterSpacing: `${mobileLetterSpacing}px`,
          paddingRight: `${mobileSyncOnChange(v, "paddingRight") / 2}px`,
          paddingBottom: `${mobileSyncOnChange(v, "paddingBottom")}px`,
          paddingLeft: `${mobileSyncOnChange(v, "paddingLeft") / 2}px`
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-forms__fields", glamorClassName);
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
    "--paddingTop": `${paddingTop}px`,
    "--paddingRight": `${paddingRight / 2}px`,
    "--paddingBottom": `${paddingBottom}px`,
    "--paddingLeft": `${paddingLeft / 2}px`,
    "--marginRight": `-${paddingRight / 2}px`,
    "--marginLeft": `-${paddingLeft / 2}px`,

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
    "--borderStyle": styleBorderStyle({ v, device: "desktop" }),

    // Tablet
    "--tabletFontSize": `${tabletFontSize}px`,
    "--tabletLineHeight": tabletLineHeight,
    "--tabletFontWeight": tabletFontWeight,
    "--tabletLetterSpacing": `${tabletLetterSpacing}px`,

    "--tabletPaddingTop": `${tabletSyncOnChange(v, "paddingTop")}px`,
    "--tabletPaddingRight": `${tabletSyncOnChange(v, "paddingRight") / 2}px`,
    "--tabletPaddingBottom": `${tabletSyncOnChange(v, "paddingBottom")}px`,
    "--tabletPaddingLeft": `${tabletSyncOnChange(v, "paddingLeft") / 2}px`,
    "--tabletMarginRight": `-${tabletSyncOnChange(v, "paddingRight") / 2}px`,
    "--tabletMarginLeft": `-${tabletSyncOnChange(v, "paddingLeft") / 2}px`,

    // Mobile
    "--mobileFontSize": `${mobileFontSize}px`,
    "--mobileLineHeight": mobileLineHeight,
    "--mobileFontWeight": mobileFontWeight,
    "--mobileLetterSpacing": `${mobileLetterSpacing}px`,

    "--mobilePaddingTop": `${mobileSyncOnChange(v, "paddingTop")}px`,
    "--mobilePaddingRight": `${mobileSyncOnChange(v, "paddingRight") / 2}px`,
    "--mobilePaddingBottom": `${mobileSyncOnChange(v, "paddingBottom")}px`,
    "--mobilePaddingLeft": `${mobileSyncOnChange(v, "paddingLeft") / 2}px`,
    "--mobileMarginRight": `-${mobileSyncOnChange(v, "paddingRight") / 2}px`,
    "--mobileMarginLeft": `-${mobileSyncOnChange(v, "paddingLeft") / 2}px`
  };
}
