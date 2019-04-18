import classnames from "classnames";
import { css } from "glamor";
import { getFontById } from "visual/utils/fonts";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import {
  styleBgColor,
  styleBorderColor,
  styleBgGradient,
  styleBoxShadow,
  styleColor
} from "visual/utils/style";

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
        backgroundImage: "var(--backgroundGradient)",
        borderWidth: "var(--borderWidth)",
        borderStyle: "var(--borderStyle)",
        boxShadow: "var(--boxShadow)"
      },
      ".brz &&:hover": {
        color: "var(--hoverColor)",
        borderColor: "var(--hoverBorderColor)",
        backgroundColor: "var(--hoverBgColor)",
        boxShadow: "var(--boxShadow)",
        backgroundImage: "var(--hoverBackgroundGradient)"
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
      ".brz-ed--tablet &": {
        fontSize: "var(--tabletFontSize)",
        fontWeight: "var(--tabletFontWeight)",
        lineHeight: "var(--tabletLineHeight)",
        letterSpacing: "var(--tabletLetterSpacing)",
        paddingTop: "var(--tabletPaddingTop)",
        paddingRight: "var(--tabletPaddingRight)",
        paddingBottom: "var(--tabletPaddingBottom)",
        paddingLeft: "var(--tabletPaddingLeft)",
        borderRadius: "var(--tabletBorderRadius)"
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
      borderWidth,
      borderStyle,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      borderRadius,
      borderRadiusType,

      // Tablet
      tabletFontSize,
      tabletFontWeight,
      tabletLineHeight,
      tabletLetterSpacing,
      tabletPaddingTop,
      tabletPaddingRight,
      tabletPaddingBottom,
      tabletPaddingLeft,

      // Mobile
      mobileFontSize,
      mobileFontWeight,
      mobileLineHeight,
      mobileLetterSpacing,
      mobilePaddingTop,
      mobilePaddingRight,
      mobilePaddingBottom,
      mobilePaddingLeft
    } = v;

    // the same code (calculation) like in editor
    let tabletContentHeight =
      v.iconSize === "custom" &&
      tabletFontSize * tabletLineHeight >= v.iconCustomSize
        ? tabletFontSize * tabletLineHeight
        : v.iconSize === "custom" &&
          tabletFontSize * tabletLineHeight < v.iconCustomSize
        ? v.iconCustomSize
        : v.iconSize !== "custom" &&
          tabletFontSize * tabletLineHeight >= v[`${v.iconSize}IconSize`]
        ? tabletFontSize * tabletLineHeight
        : v[`${v.iconSize}IconSize`];
    let maxTabletBorderRadius = Math.round(
      (tabletContentHeight + v.tabletPaddingTop * 2 + v.tempBorderWidth * 2) / 2
    );

    let mobileContentHeight =
      v.iconSize === "custom" &&
      mobileFontSize * mobileLineHeight >= v.iconCustomSize
        ? mobileFontSize * mobileLineHeight
        : v.iconSize === "custom" &&
          mobileFontSize * mobileLineHeight < v.iconCustomSize
        ? v.iconCustomSize
        : v.iconSize !== "custom" &&
          mobileFontSize * mobileLineHeight >= v[`${v.iconSize}IconSize`]
        ? mobileFontSize * mobileLineHeight
        : v[`${v.iconSize}IconSize`];
    let maxMobileBorderRadius = Math.round(
      (mobileContentHeight + v.mobilePaddingTop * 2 + v.tempBorderWidth * 2) / 2
    );

    let tabletBorderRadius = v.tempTabletBorderRadius;
    let mobileBorderRadius = v.tempMobileBorderRadius;

    if (borderRadiusType === "square") {
      // old method (get border radius from desktop tempBorderRadius)
      tabletBorderRadius = v.tempTabletBorderRadius;
      mobileBorderRadius = v.tempMobileBorderRadius;
    } else if (borderRadiusType === "rounded") {
      tabletBorderRadius = maxTabletBorderRadius;
      mobileBorderRadius = maxMobileBorderRadius;
    } else if (borderRadiusType === "custom") {
      // now the border radius come from desktop
      tabletBorderRadius = tabletSyncOnChange(v, "borderRadius");
      mobileBorderRadius = mobileSyncOnChange(v, "borderRadius");
    }
    // end the same code (calculation) like in editor

    glamorObj = {
      ".brz &": {
        flexFlow: iconPosition !== "left" ? "row-reverse nowrap" : "row nowrap",
        fontFamily: getFontById(fontFamily).family,
        fontSize,
        lineHeight,
        fontWeight,
        letterSpacing,
        color: styleColor({ v, device: "desktop", state: "normal" }),
        borderColor: styleBorderColor({
          v,
          device: "desktop",
          state: "normal"
        }),
        backgroundColor: styleBgColor({
          v,
          device: "desktop",
          state: "normal"
        }),
        backgroundImage: styleBgGradient({
          v,
          device: "desktop",
          state: "normal"
        }),
        borderWidth,
        borderStyle,
        paddingTop: `${paddingTop}px`,
        paddingRight: `${paddingRight}px`,
        paddingBottom: `${paddingBottom}px`,
        paddingLeft: `${paddingLeft}px`,
        borderRadius,
        boxShadow: styleBoxShadow({ v, device: "desktop", state: "normal" })
      },
      ".brz &&:hover": {
        color: styleColor({ v, device: "desktop", state: "hover" }),
        borderColor: styleBorderColor({
          v,
          device: "desktop",
          state: "hover"
        }),
        backgroundColor: styleBgColor({
          v,
          device: "desktop",
          state: "hover"
        }),
        boxShadow: styleBoxShadow({ v, device: "desktop", state: "normal" }),
        backgroundImage: styleBgGradient({
          v,
          device: "desktop",
          state: "hover"
        })
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          fontSize: `${tabletFontSize}px`,
          fontWeight: tabletFontWeight,
          lineHeight: tabletLineHeight,
          letterSpacing: `${tabletLetterSpacing}px`,
          paddingTop: `${tabletPaddingTop}px`,
          paddingRight: `${tabletPaddingRight}px`,
          paddingBottom: `${tabletPaddingBottom}px`,
          paddingLeft: `${tabletPaddingLeft}px`,
          borderRadius: `${tabletBorderRadius}px`
        }
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
          borderRadius: `${mobileBorderRadius}px`
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
    borderWidth,
    borderStyle,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    borderRadiusType,
    borderRadius,

    // Tablet
    tabletFontSize,
    tabletFontWeight,
    tabletLineHeight,
    tabletLetterSpacing,
    tabletPaddingTop,
    tabletPaddingRight,
    tabletPaddingBottom,
    tabletPaddingLeft,

    // Mobile
    mobileFontSize,
    mobileFontWeight,
    mobileLineHeight,
    mobileLetterSpacing,
    mobilePaddingTop,
    mobilePaddingRight,
    mobilePaddingBottom,
    mobilePaddingLeft
  } = v;

  // calculations copied from toolbar
  let tabletContentHeight =
    v.iconSize === "custom" &&
    tabletFontSize * tabletLineHeight >= v.iconCustomSize
      ? tabletFontSize * tabletLineHeight
      : v.iconSize === "custom" &&
        tabletFontSize * tabletLineHeight < v.iconCustomSize
      ? v.iconCustomSize
      : v.iconSize !== "custom" &&
        tabletFontSize * tabletLineHeight >= v[`${v.iconSize}IconSize`]
      ? tabletFontSize * tabletLineHeight
      : v[`${v.iconSize}IconSize`];
  let maxTabletBorderRadius = Math.round(
    (tabletContentHeight + v.tabletPaddingTop * 2 + v.tempBorderWidth * 2) / 2
  );

  let mobileContentHeight =
    v.iconSize === "custom" &&
    mobileFontSize * mobileLineHeight >= v.iconCustomSize
      ? mobileFontSize * mobileLineHeight
      : v.iconSize === "custom" &&
        mobileFontSize * mobileLineHeight < v.iconCustomSize
      ? v.iconCustomSize
      : v.iconSize !== "custom" &&
        mobileFontSize * mobileLineHeight >= v[`${v.iconSize}IconSize`]
      ? mobileFontSize * mobileLineHeight
      : v[`${v.iconSize}IconSize`];
  let maxMobileBorderRadius = Math.round(
    (mobileContentHeight + v.mobilePaddingTop * 2 + v.tempBorderWidth * 2) / 2
  );

  let tabletBorderRadius = v.tempTabletBorderRadius;
  let mobileBorderRadius = v.tempMobileBorderRadius;

  if (borderRadiusType === "square") {
    // old method (get border radius from desktop tempBorderRadius)
    tabletBorderRadius = v.tempTabletBorderRadius;
    mobileBorderRadius = v.tempMobileBorderRadius;
  } else if (borderRadiusType === "rounded") {
    tabletBorderRadius = maxTabletBorderRadius;
    mobileBorderRadius = maxMobileBorderRadius;
  } else if (borderRadiusType === "custom") {
    // now the border radius come from desktop
    tabletBorderRadius = tabletSyncOnChange(v, "borderRadius");
    mobileBorderRadius = mobileSyncOnChange(v, "borderRadius");
  }

  return {
    "--iconPosition":
      iconPosition !== "left" ? "row-reverse nowrap" : "row nowrap",
    "--fontFamily": getFontById(fontFamily).family,
    "--fontWeight": fontWeight,
    "--fontSize": `${fontSize}px`,
    "--lineHeight": lineHeight,
    "--letterSpacing": `${letterSpacing}px`,
    "--color": styleColor({ v, device: "desktop", state: "normal" }),
    "--borderColor": styleBorderColor({
      v,
      device: "desktop",
      state: "normal"
    }),
    "--backgroundColor": styleBgColor({
      v,
      device: "desktop",
      state: "normal"
    }),
    "--backgroundGradient": styleBgGradient({
      v,
      device: "desktop",
      state: "normal"
    }),
    "--borderWidth": `${borderWidth}px`,
    "--borderStyle": borderStyle,
    "--borderRadius": `${borderRadius}px`,
    "--boxShadow": styleBoxShadow({ v, device: "desktop", state: "normal" }),
    "--paddingTop": `${paddingTop}px`,
    "--paddingRight": `${paddingRight}px`,
    "--paddingBottom": `${paddingBottom}px`,
    "--paddingLeft": `${paddingLeft}px`,
    "--hoverColor": styleColor({ v, device: "desktop", state: "hover" }),
    "--hoverBorderColor": styleBorderColor({
      v,
      device: "desktop",
      state: "hover"
    }),
    "--hoverBgColor": styleBgColor({
      v,
      device: "desktop",
      state: "hover"
    }),
    "--hoverBackgroundGradient": styleBgGradient({
      v,
      device: "desktop",
      state: "hover"
    }),

    // Tablet
    "--tabletFontSize": `${tabletFontSize}px`,
    "--tabletFontWeight": tabletFontWeight,
    "--tabletLineHeight": tabletLineHeight,
    "--tabletLetterSpacing": `${tabletLetterSpacing}px`,
    "--tabletPaddingTop": `${tabletPaddingTop}px`,
    "--tabletPaddingRight": `${tabletPaddingRight}px`,
    "--tabletPaddingBottom": `${tabletPaddingBottom}px`,
    "--tabletPaddingLeft": `${tabletPaddingLeft}px`,
    "--tabletBorderRadius": `${tabletBorderRadius}px`,

    // Mobile
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
            : iconType === "outline" && iconCustomSize > 64
            ? 3
            : 0
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
        : iconType === "outline" && iconCustomSize > 32 && iconCustomSize <= 48
        ? 1.4
        : iconType === "outline" && iconCustomSize > 48 && iconCustomSize <= 64
        ? 2.3
        : iconType === "outline" && iconCustomSize > 64
        ? 3
        : 0
  };
}
