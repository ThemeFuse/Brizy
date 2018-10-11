import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

const aligns = {
  left: "flex-start",
  center: "center",
  right: "flex-end"
};

export function styleClassName(v) {
  const { customClassName, showOnDesktop, showOnMobile } = v;
  let glamorClassName;

  if (IS_PREVIEW) {
    glamorClassName = String(
      css({
        ".brz &": {
          display: showOnDesktop === "on" ? "block" : "none"
        },

        "@media (max-width: 767px)": {
          ".brz &": {
            display: showOnMobile === "on" ? "block" : "none"
          }
        }
      })
    );
  }

  return classnames("brz-wrapper", glamorClassName, customClassName);
}

export function containerStyleClassName(v) {
  const { className, showOnDesktop, showOnMobile } = v;
  const blurred = {
    filter: "blur(3px)",
    opacity: 0.9
  };
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      position: "relative",
      zIndex: "var(--zIndex)",

      ".brz-ed--desktop &": {
        ...(showOnDesktop === "on" ? null : blurred),
        justifyContent: "var(--horizontalAlign)",
        paddingTop: "var(--paddingTop)",
        paddingRight: "var(--paddingRight)",
        paddingBottom: "var(--paddingBottom)",
        paddingLeft: "var(--paddingLeft)",
        marginTop: "var(--marginTop)",
        marginRight: "var(--marginRight)",
        marginBottom: "var(--marginBottom)",
        marginLeft: "var(--marginLeft)"
      },
      ".brz-ed--mobile &": {
        ...(showOnMobile === "on" ? null : blurred),
        justifyContent: "var(--mobileHorizontalAlign)",
        paddingTop: "var(--mobilePaddingTop)",
        paddingRight: "var(--mobilePaddingRight)",
        paddingBottom: "var(--mobilePaddingBottom)",
        paddingLeft: "var(--mobilePaddingLeft)",
        marginTop: "var(--mobileMarginTop)",
        marginRight: "var(--mobileMarginRight)",
        marginBottom: "var(--mobileMarginBottom)",
        marginLeft: "var(--mobileMarginLeft)"
      }
    };
  } else {
    const {
      zIndex,
      horizontalAlign,
      paddingType,
      padding,
      paddingSuffix,
      paddingTop,
      paddingTopSuffix,
      paddingRight,
      paddingRightSuffix,
      paddingBottom,
      paddingBottomSuffix,
      paddingLeft,
      paddingLeftSuffix,
      marginType,
      margin,
      marginSuffix,
      marginTop,
      marginTopSuffix,
      marginRight,
      marginRightSuffix,
      marginBottom,
      marginBottomSuffix,
      marginLeft,
      marginLeftSuffix,
      mobileMarginType,
      mobileMargin,
      mobileMarginSuffix,
      mobileMarginTop,
      mobileMarginTopSuffix,
      mobileMarginRight,
      mobileMarginRightSuffix,
      mobileMarginBottom,
      mobileMarginBottomSuffix,
      mobileMarginLeft,
      mobileMarginLeftSuffix,
      mobilePaddingType,
      mobilePadding,
      mobilePaddingSuffix,
      mobilePaddingTop,
      mobilePaddingTopSuffix,
      mobilePaddingRight,
      mobilePaddingRightSuffix,
      mobilePaddingBottom,
      mobilePaddingBottomSuffix,
      mobilePaddingLeft,
      mobilePaddingLeftSuffix
    } = v;

    glamorObj = {
      position: zIndex === 0 ? "static" : "relative",
      zIndex: zIndex === 0 ? "auto" : zIndex,
      justifyContent: aligns[horizontalAlign],
      paddingTop:
        paddingType === "grouped"
          ? padding + paddingSuffix
          : paddingTop + paddingTopSuffix,
      paddingRight:
        paddingType === "grouped"
          ? padding + paddingSuffix
          : paddingRight + paddingRightSuffix,
      paddingBottom:
        paddingType === "grouped"
          ? padding + paddingSuffix
          : paddingBottom + paddingBottomSuffix,
      paddingLeft:
        paddingType === "grouped"
          ? padding + paddingSuffix
          : paddingLeft + paddingLeftSuffix,
      marginTop:
        marginType === "grouped"
          ? margin + marginSuffix
          : marginTop + marginTopSuffix,
      marginRight:
        marginType === "grouped"
          ? margin + marginSuffix
          : marginRight + marginRightSuffix,
      marginBottom:
        marginType === "grouped"
          ? margin + marginSuffix
          : marginBottom + marginBottomSuffix,
      marginLeft:
        marginType === "grouped"
          ? margin + marginSuffix
          : marginLeft + marginLeftSuffix,

      "@media (max-width: 767px)": {
        justifyContent: aligns[mobileSyncOnChange(v, "horizontalAlign")],
        paddingTop:
          mobilePaddingType === "grouped"
            ? mobilePadding + mobilePaddingSuffix
            : mobilePaddingTop + mobilePaddingTopSuffix,
        paddingRight:
          mobilePaddingType === "grouped"
            ? mobilePadding + mobilePaddingSuffix
            : mobilePaddingRight + mobilePaddingRightSuffix,
        paddingBottom:
          mobilePaddingType === "grouped"
            ? mobilePadding + mobilePaddingSuffix
            : mobilePaddingBottom + mobilePaddingBottomSuffix,
        paddingLeft:
          mobilePaddingType === "grouped"
            ? mobilePadding + mobilePaddingSuffix
            : mobilePaddingLeft + mobilePaddingLeftSuffix,
        marginTop:
          mobileMarginType === "grouped"
            ? mobileMargin + mobileMarginSuffix
            : mobileMarginTop + mobileMarginTopSuffix,
        marginRight:
          mobileMarginType === "grouped"
            ? mobileMargin + mobileMarginSuffix
            : mobileMarginRight + mobileMarginRightSuffix,
        marginBottom:
          mobileMarginType === "grouped"
            ? mobileMargin + mobileMarginSuffix
            : mobileMarginBottom + mobileMarginBottomSuffix,
        marginLeft:
          mobileMarginType === "grouped"
            ? mobileMargin + mobileMarginSuffix
            : mobileMarginLeft + mobileMarginLeftSuffix
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-d-xs-flex", glamorClassName, className);
}

export function containerStyleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    zIndex,
    horizontalAlign,
    paddingType,
    padding,
    paddingSuffix,
    paddingTop,
    paddingTopSuffix,
    paddingRight,
    paddingRightSuffix,
    paddingBottom,
    paddingBottomSuffix,
    paddingLeft,
    paddingLeftSuffix,
    marginType,
    margin,
    marginSuffix,
    marginTop,
    marginTopSuffix,
    marginRight,
    marginRightSuffix,
    marginBottom,
    marginBottomSuffix,
    marginLeft,
    marginLeftSuffix,
    mobileMarginType,
    mobileMargin,
    mobileMarginSuffix,
    mobileMarginTop,
    mobileMarginTopSuffix,
    mobileMarginRight,
    mobileMarginRightSuffix,
    mobileMarginBottom,
    mobileMarginBottomSuffix,
    mobileMarginLeft,
    mobileMarginLeftSuffix,
    mobilePaddingType,
    mobilePadding,
    mobilePaddingSuffix,
    mobilePaddingTop,
    mobilePaddingTopSuffix,
    mobilePaddingRight,
    mobilePaddingRightSuffix,
    mobilePaddingBottom,
    mobilePaddingBottomSuffix,
    mobilePaddingLeft,
    mobilePaddingLeftSuffix
  } = v;

  return {
    "--zIndex": zIndex === 0 ? "auto" : zIndex,
    "--horizontalAlign": aligns[horizontalAlign],
    "--paddingTop":
      paddingType === "grouped"
        ? padding + paddingSuffix
        : paddingTop + paddingTopSuffix,
    "--paddingRight":
      paddingType === "grouped"
        ? padding + paddingSuffix
        : paddingRight + paddingRightSuffix,
    "--paddingBottom":
      paddingType === "grouped"
        ? padding + paddingSuffix
        : paddingBottom + paddingBottomSuffix,
    "--paddingLeft":
      paddingType === "grouped"
        ? padding + paddingSuffix
        : paddingLeft + paddingLeftSuffix,
    "--marginTop":
      marginType === "grouped"
        ? margin + marginSuffix
        : marginTop + marginTopSuffix,
    "--marginRight":
      marginType === "grouped"
        ? margin + marginSuffix
        : marginRight + marginRightSuffix,
    "--marginBottom":
      marginType === "grouped"
        ? margin + marginSuffix
        : marginBottom + marginBottomSuffix,
    "--marginLeft":
      marginType === "grouped"
        ? margin + marginSuffix
        : marginLeft + marginLeftSuffix,
    "--mobileMarginTop":
      mobileMarginType === "grouped"
        ? mobileMargin + mobileMarginSuffix
        : mobileMarginTop + mobileMarginTopSuffix,
    "--mobileMarginRight":
      mobileMarginType === "grouped"
        ? mobileMargin + mobileMarginSuffix
        : mobileMarginRight + mobileMarginRightSuffix,
    "--mobileMarginBottom":
      mobileMarginType === "grouped"
        ? mobileMargin + mobileMarginSuffix
        : mobileMarginBottom + mobileMarginBottomSuffix,
    "--mobileMarginLeft":
      mobileMarginType === "grouped"
        ? mobileMargin + mobileMarginSuffix
        : mobileMarginLeft + mobileMarginLeftSuffix,
    "--mobileHorizontalAlign": aligns[mobileSyncOnChange(v, "horizontalAlign")],
    "--mobilePaddingTop":
      mobilePaddingType === "grouped"
        ? mobilePadding + mobilePaddingSuffix
        : mobilePaddingTop + mobilePaddingTopSuffix,
    "--mobilePaddingRight":
      mobilePaddingType === "grouped"
        ? mobilePadding + mobilePaddingSuffix
        : mobilePaddingRight + mobilePaddingRightSuffix,
    "--mobilePaddingBottom":
      mobilePaddingType === "grouped"
        ? mobilePadding + mobilePaddingSuffix
        : mobilePaddingBottom + mobilePaddingBottomSuffix,
    "--mobilePaddingLeft":
      mobilePaddingType === "grouped"
        ? mobilePadding + mobilePaddingSuffix
        : mobilePaddingLeft + mobilePaddingLeftSuffix
  };
}
