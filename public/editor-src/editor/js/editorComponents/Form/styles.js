import classnames from "classnames";
import { css } from "glamor";
import { getFontById } from "visual/utils/fonts";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import { styleColor, styleBgColor, styleBorderColor } from "visual/utils/style";

export function styleClassName(v) {
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        textAlign: "var(--horizontalAlign)"
      },
      ".brz-ed--tablet &": {
        textAlign: "var(--tabletHorizontalAlign)"
      },
      ".brz-ed--mobile &": {
        textAlign: "var(--mobileHorizontalAlign)"
      }
    };
  } else {
    const { horizontalAlign } = v;

    glamorObj = {
      textAlign: horizontalAlign,

      "@media (max-width: 991px)": {
        textAlign: tabletSyncOnChange(v, "horizontalAlign")
      },
      "@media (max-width: 767px)": {
        textAlign: mobileSyncOnChange(v, "horizontalAlign")
      }
    };
  }

  const glamorClassName = String(css(glamorObj));
  return classnames("brz-form", glamorClassName);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const { horizontalAlign } = v;

  return {
    "--horizontalAlign": horizontalAlign,
    "--tabletHorizontalAlign": tabletSyncOnChange(v, "horizontalAlign"),
    "--mobileHorizontalAlign": mobileSyncOnChange(v, "horizontalAlign")
  };
}

// FormFields
export function fieldsStyleClassName(v) {
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz & .brz-form__item": {
        fontFamily: "var(--fontFamily)",
        color: "var(--color)",

        "& .brz-form__field": {
          backgroundColor: "var(--backgroundColor)",
          borderColor: "var(--borderColor)",
          borderWidth: "var(--borderWidth)",
          borderStyle: "var(--borderStyle)",
          borderRadius: "var(--borderRadius)"
        },
        "& .brz-form__select-item__input": {
          color: "var(--color)"
        }
      },
      ".brz & .form-alert": {
        fontFamily: "var(--fontFamily)"
      },
      ".brz-ed--desktop &.brz-form__fields": {
        marginRight: "var(--marginRight)",
        marginLeft: "var(--marginLeft)"
      },
      ".brz-ed--desktop & .brz-form__item": {
        fontSize: "var(--fontSize)",
        lineHeight: "var(--lineHeight)",
        fontWeight: "var(--fontWeight)",
        letterSpacing: "var(--letterSpacing)",
        paddingRight: "var(--paddingRight)",
        paddingBottom: "var(--paddingBottom)",
        paddingLeft: "var(--paddingLeft)"
      },
      ".brz-ed--tablet &.brz-form__fields": {
        marginRight: "var(--tabletMarginRight)",
        marginLeft: "var(--tabletMarginLeft)"
      },
      ".brz-ed--tablet & .brz-form__item": {
        fontSize: "var(--tabletFontSize)",
        lineHeight: "var(--tabletLineHeight)",
        fontWeight: "var(--tabletFontWeight)",
        letterSpacing: "var(--tabletLetterSpacing)",
        paddingRight: "var(--tabletPaddingRight)",
        paddingBottom: "var(--tabletPaddingBottom)",
        paddingLeft: "var(--tabletPaddingLeft)"
      },
      ".brz-ed--mobile &.brz-form__fields": {
        marginRight: "var(--mobileMarginRight)",
        marginLeft: "var(--mobileMarginLeft)"
      },
      ".brz-ed--mobile & .brz-form__item": {
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
      fontSize,
      lineHeight,
      fontWeight,
      letterSpacing,
      borderStyle,
      borderWidth,
      borderRadius,
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
      marginRight: `-${paddingRight / 2}px`,
      marginLeft: `-${paddingLeft / 2}px`,

      ".brz & .brz-form__item": {
        fontFamily: getFontById(fontFamily).family,
        fontSize,
        lineHeight,
        fontWeight,
        letterSpacing,
        color: styleColor({ v, device: "desktop", state: "normal" }),
        paddingRight: `${paddingRight / 2}px`,
        paddingBottom: `${paddingBottom}px`,
        paddingLeft: `${paddingLeft / 2}px`,

        "& .brz-form__field, .brz-control__select-current": {
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
          borderWidth,
          borderStyle,
          borderRadius,

          "&::placeholder": {
            color: styleColor({ v, device: "desktop", state: "normal" })
          }
        }
      },
      ".brz & .form-alert": {
        fontFamily: getFontById(fontFamily).family
      },
      "@media (max-width: 991px)": {
        ".brz &.brz-form__fields": {
          marginRight: `-${tabletSyncOnChange(v, "paddingRight") / 2}px`,
          marginLeft: `-${tabletSyncOnChange(v, "paddingLeft") / 2}px`
        },
        ".brz & .brz-form__item": {
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
        ".brz &.brz-form__fields": {
          marginRight: `-${mobileSyncOnChange(v, "paddingRight") / 2}px`,
          marginLeft: `-${mobileSyncOnChange(v, "paddingLeft") / 2}px`
        },
        ".brz & .brz-form__item": {
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

  return classnames("brz-form__fields", glamorClassName);
}

export function fieldsStyleCSSVars(v) {
  if (IS_PREVIEW) return null;

  const {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    borderWidth,
    borderStyle,
    borderRadius,
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
    "--fontFamily": getFontById(fontFamily).family,
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
    "--borderWidth": `${borderWidth}px`,
    "--borderStyle": borderStyle,
    "--borderRadius": `${borderRadius}px`,

    // Tablet
    "--tabletFontSize": `${tabletFontSize}px`,
    "--tabletLineHeight": tabletLineHeight,
    "--tabletFontWeight": tabletFontWeight,
    "--tabletLetterSpacing": `${tabletLetterSpacing}px`,
    "--tabletBorderRadius": `${tabletSyncOnChange(v, "borderRadius")}px`, // this key is used only here, but no div use this variable

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
    "--mobileBorderRadius": `${mobileSyncOnChange(v, "borderRadius")}px`, // this key is used only here, but no div use this variable

    "--mobilePaddingTop": `${mobileSyncOnChange(v, "paddingTop")}px`,
    "--mobilePaddingRight": `${mobileSyncOnChange(v, "paddingRight") / 2}px`,
    "--mobilePaddingBottom": `${mobileSyncOnChange(v, "paddingBottom")}px`,
    "--mobilePaddingLeft": `${mobileSyncOnChange(v, "paddingLeft") / 2}px`,
    "--mobileMarginRight": `-${mobileSyncOnChange(v, "paddingRight") / 2}px`,
    "--mobileMarginLeft": `-${mobileSyncOnChange(v, "paddingLeft") / 2}px`
  };
}
