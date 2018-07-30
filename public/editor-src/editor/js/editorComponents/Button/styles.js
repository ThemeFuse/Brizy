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
        flexFlow: "var(--iconPosition)",
        fontFamily: "var(--fontFamily)",
        color: "var(--color)",
        borderColor: "var(--borderColor)",
        backgroundColor: "var(--backgroundColor)",
        borderWidth: "var(--borderWidth)",
        borderStyle: "var(--borderStyle)",
        boxShadow: "var(--boxShadow)"
      },
      ".brz &&:hover": {
        color: "var(--hoverColor)",
        borderColor: "var(--hoverBorderColor)",
        backgroundColor: "var(--hoverBgColor)",
        boxShadow: "var(--boxShadow)"
      },
      ".brz-ed--desktop &": {
        fontSize: "var(--fontSize)",
        lineHeight: "var(--lineHeight)",
        fontWeight: "var(--fontWeight)",
        letterSpacing: "var(--letterSpacing)",
        paddingTop: "var(--paddingTop)",
        paddingRight: "var(--paddingRight)",
        paddingBottom: "var(--paddingBottom)",
        paddingLeft: "var(--paddingLeft)",
        borderRadius: "var(--borderRadius)"
      },
      ".brz-ed--mobile &": {
        fontSize: "var(--mobileFontSize)",
        fontWeight: "var(--mobileFontWeight)",
        lineHeight: "var(--mobileLineHeight)",
        letterSpacing: "var(--mobileLetterSpacing)",
        paddingTop: "var(--mobilePaddingTop)",
        paddingRight: "var(--mobilePaddingRight)",
        paddingBottom: "var(--mobilePaddingBottom)",
        paddingLeft: "var(--mobilePaddingLeft)",
        borderRadius: "var(--mobileBorderRadius)"
      }
    };
  } else {
    const {
      iconPosition,
      fontFamily,
      fontSize,
      fontWeight,
      lineHeight,
      letterSpacing,
      colorHex,
      colorOpacity,
      bgColorHex,
      bgColorOpacity,
      borderColorHex,
      borderColorOpacity,
      borderWidth,
      borderStyle,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      borderRadius,
      hoverColorHex,
      hoverColorOpacity,
      hoverBgColorHex,
      hoverBgColorOpacity,
      hoverBorderColorHex,
      hoverBorderColorOpacity,
      boxShadow,
      boxShadowColorHex,
      boxShadowColorOpacity,
      boxShadowBlur,
      boxShadowSpread,
      boxShadowVertical,
      boxShadowHorizontal,
      mobileFontSize,
      mobileFontWeight,
      mobileLineHeight,
      mobileLetterSpacing,
      mobilePaddingTop,
      mobilePaddingRight,
      mobilePaddingBottom,
      mobilePaddingLeft,
      mobileBorderRadius
    } = v;

    const boxShadowStyle =
      boxShadow === "on"
        ? `${boxShadowHorizontal}px ${boxShadowVertical}px ${boxShadowBlur}px ${boxShadowSpread}px ${hexToRgba(
        boxShadowColorHex,
        boxShadowColorOpacity
        )}`
        : "none";

    glamorObj = {
      ".brz &": {
        flexFlow: iconPosition !== "left" ? "row-reverse nowrap" : "row nowrap",
        fontFamily: getFontById(fontFamily).family,
        fontSize,
        lineHeight,
        fontWeight,
        letterSpacing,
        color: hexToRgba(colorHex, colorOpacity),
        borderColor: hexToRgba(borderColorHex, borderColorOpacity),
        backgroundColor: hexToRgba(bgColorHex, bgColorOpacity),
        borderWidth,
        borderStyle,
        paddingTop: `${paddingTop}px`,
        paddingRight: `${paddingRight}px`,
        paddingBottom: `${paddingBottom}px`,
        paddingLeft: `${paddingLeft}px`,
        borderRadius,
        boxShadow: boxShadowStyle
      },
      ".brz &&:hover": {
        color: hexToRgba(hoverColorHex, hoverColorOpacity),
        borderColor: hexToRgba(hoverBorderColorHex, hoverBorderColorOpacity),
        backgroundColor: hexToRgba(hoverBgColorHex, hoverBgColorOpacity),
        boxShadow: boxShadowStyle
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          fontSize: `${mobileFontSize}px`,
          fontWeight: mobileFontWeight,
          lineHeight: mobileLineHeight,
          letterSpacing: `${mobileLetterSpacing}px`,
          paddingTop: `${mobilePaddingTop}px`,
          paddingRight: `${mobilePaddingRight}px`,
          paddingBottom: `${mobilePaddingBottom}px`,
          paddingLeft: `${mobilePaddingLeft}px`,
          borderRadius: mobileBorderRadius
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-btn", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    iconPosition,
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    colorHex,
    colorOpacity,
    bgColorHex,
    bgColorOpacity,
    borderColorHex,
    borderColorOpacity,
    borderWidth,
    borderStyle,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    borderRadius,
    hoverColorHex,
    hoverColorOpacity,
    hoverBgColorHex,
    hoverBgColorOpacity,
    hoverBorderColorHex,
    hoverBorderColorOpacity,
    boxShadow,
    boxShadowColorHex,
    boxShadowColorOpacity,
    boxShadowBlur,
    boxShadowSpread,
    boxShadowVertical,
    boxShadowHorizontal,
    mobileFontSize,
    mobileFontWeight,
    mobileLineHeight,
    mobileLetterSpacing,
    mobilePaddingTop,
    mobilePaddingRight,
    mobilePaddingBottom,
    mobilePaddingLeft,
    mobileBorderRadius
  } = v;

  const boxShadowStyle =
    boxShadow === "on"
      ? `${boxShadowHorizontal}px ${boxShadowVertical}px ${boxShadowBlur}px ${boxShadowSpread}px ${hexToRgba(
      boxShadowColorHex,
      boxShadowColorOpacity
      )}`
      : "none";

  return {
    "--iconPosition":
      iconPosition !== "left" ? "row-reverse nowrap" : "row nowrap",
    "--fontFamily": getFontById(fontFamily).family,
    "--fontWeight": fontWeight,
    "--fontSize": `${fontSize}px`,
    "--lineHeight": lineHeight,
    "--letterSpacing": `${letterSpacing}px`,
    "--color": hexToRgba(colorHex, colorOpacity),
    "--borderColor": hexToRgba(borderColorHex, borderColorOpacity),
    "--backgroundColor": hexToRgba(bgColorHex, bgColorOpacity),
    "--borderWidth": `${borderWidth}px`,
    "--borderStyle": borderStyle,
    "--borderRadius": `${borderRadius}px`,
    "--boxShadow": boxShadowStyle,
    "--paddingTop": `${paddingTop}px`,
    "--paddingRight": `${paddingRight}px`,
    "--paddingBottom": `${paddingBottom}px`,
    "--paddingLeft": `${paddingLeft}px`,
    "--hoverColor": hexToRgba(hoverColorHex, hoverColorOpacity),
    "--hoverBorderColor": hexToRgba(
      hoverBorderColorHex,
      hoverBorderColorOpacity
    ),
    "--hoverBgColor": hexToRgba(hoverBgColorHex, hoverBgColorOpacity),
    "--mobileFontSize": `${mobileFontSize}px`,
    "--mobileFontWeight": mobileFontWeight,
    "--mobileLineHeight": mobileLineHeight,
    "--mobileLetterSpacing": `${mobileLetterSpacing}px`,
    "--mobilePaddingTop": `${mobilePaddingTop}px`,
    "--mobilePaddingRight": `${mobilePaddingRight}px`,
    "--mobilePaddingBottom": `${mobilePaddingBottom}px`,
    "--mobilePaddingLeft": `${mobilePaddingLeft}px`,
    "--mobileBorderRadius": `${mobileBorderRadius}px`
  };
}

export function iconStyleClassName(v) {
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz &": {
        fontSize: "var(--iconFontSize)",
        marginRight: "var(--iconMarginRight)",
        marginLeft: "var(--iconMarginLeft)",
        flex: "1 0 auto",
        strokeWidth: "var(--iconStrokeWidth)"
      }
    };
  } else {
    const { iconCustomSize, iconPosition, iconSpacing, iconName, iconType } = v;
    const marginColumn = iconPosition === "left" ? "marginRight" : "marginLeft";

    glamorObj = {
      ".brz &": {
        fontSize: `${iconCustomSize}px`,
        [marginColumn]: `${iconSpacing}px`,
        flex: "1 0 auto",
        strokeWidth:
          iconType === "outline" && iconCustomSize <= 24
            ? 1
            : iconType === "outline" &&
              iconCustomSize > 24 &&
              iconCustomSize <= 32
              ? 1.1
              : iconType === "outline" &&
                iconCustomSize > 32 &&
                iconCustomSize <= 48
                ? 1.4
                : iconType === "outline" &&
                  iconCustomSize > 48 &&
                  iconCustomSize <= 64
                  ? 2.3
                  : iconType === "outline" && iconCustomSize > 64 ? 3 : 0
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames(glamorClassName);
}

export function iconStyleCSSVars(v) {
  if (IS_PREVIEW) return;

  const { iconCustomSize, iconPosition, iconSpacing, iconName, iconType } = v;
  const marginColumn = iconPosition === "left" ? "marginRight" : "marginLeft";

  return {
    "--iconFontSize": `${iconCustomSize}px`,
    "--iconMarginRight": iconPosition === "left" ? `${iconSpacing}px` : 0,
    "--iconMarginLeft": iconPosition === "right" ? `${iconSpacing}px` : 0,
    "--iconStrokeWidth":
      iconType === "outline" && iconCustomSize <= 24
        ? 1
        : iconType === "outline" && iconCustomSize > 24 && iconCustomSize <= 32
          ? 1.1
          : iconType === "outline" &&
            iconCustomSize > 32 &&
            iconCustomSize <= 48
            ? 1.4
            : iconType === "outline" &&
              iconCustomSize > 48 &&
              iconCustomSize <= 64
              ? 2.3
              : iconType === "outline" && iconCustomSize > 64 ? 3 : 0
  };
}
