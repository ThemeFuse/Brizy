import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

import {
  styleAlignHorizontalAlign,
  stylePadding,
  styleMargin,
  styleZIndex
} from "visual/utils/style";

const aligns = {
  left: "flex-start",
  center: "center",
  right: "flex-end"
};

export function styleClassName(v) {
  const { customClassName, showOnDesktop, showOnTablet, showOnMobile } = v;
  let glamorClassName;

  if (IS_PREVIEW) {
    glamorClassName = String(
      css({
        ".brz &": {
          display: showOnDesktop === "on" ? "block" : "none"
        },

        "@media (max-width: 991px) and (min-width: 768px)": {
          ".brz &": {
            display: showOnTablet === "off" && "none"
          }
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
  const { className, showOnDesktop, showOnTablet, showOnMobile } = v;
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
      ".brz-ed--tablet &": {
        ...(showOnTablet === "on" ? null : blurred),
        justifyContent: "var(--tabletHorizontalAlign)",
        paddingTop: "var(--tabletPaddingTop)",
        paddingRight: "var(--tabletPaddingRight)",
        paddingBottom: "var(--tabletPaddingBottom)",
        paddingLeft: "var(--tabletPaddingLeft)",
        marginTop: "var(--tabletMarginTop)",
        marginRight: "var(--tabletMarginRight)",
        marginBottom: "var(--tabletMarginBottom)",
        marginLeft: "var(--tabletMarginLeft)"
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

      // Tablet
      tabletMarginType,
      tabletMargin,
      tabletMarginSuffix,
      tabletMarginTop,
      tabletMarginTopSuffix,
      tabletMarginRight,
      tabletMarginRightSuffix,
      tabletMarginBottom,
      tabletMarginBottomSuffix,
      tabletMarginLeft,
      tabletMarginLeftSuffix,
      tabletPaddingType,
      tabletPadding,
      tabletPaddingSuffix,
      tabletPaddingTop,
      tabletPaddingTopSuffix,
      tabletPaddingRight,
      tabletPaddingRightSuffix,
      tabletPaddingBottom,
      tabletPaddingBottomSuffix,
      tabletPaddingLeft,
      tabletPaddingLeftSuffix,

      // Mobile
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

      "@media (max-width: 991px)": {
        justifyContent: aligns[tabletSyncOnChange(v, "horizontalAlign")],
        paddingTop:
          tabletPaddingType === "grouped"
            ? tabletPadding + tabletPaddingSuffix
            : tabletPaddingTop + tabletPaddingTopSuffix,
        paddingRight:
          tabletPaddingType === "grouped"
            ? tabletPadding + tabletPaddingSuffix
            : tabletPaddingRight + tabletPaddingRightSuffix,
        paddingBottom:
          tabletPaddingType === "grouped"
            ? tabletPadding + tabletPaddingSuffix
            : tabletPaddingBottom + tabletPaddingBottomSuffix,
        paddingLeft:
          tabletPaddingType === "grouped"
            ? tabletPadding + tabletPaddingSuffix
            : tabletPaddingLeft + tabletPaddingLeftSuffix,
        marginTop:
          tabletMarginType === "grouped"
            ? tabletMargin + tabletMarginSuffix
            : tabletMarginTop + tabletMarginTopSuffix,
        marginRight:
          tabletMarginType === "grouped"
            ? tabletMargin + tabletMarginSuffix
            : tabletMarginRight + tabletMarginRightSuffix,
        marginBottom:
          tabletMarginType === "grouped"
            ? tabletMargin + tabletMarginSuffix
            : tabletMarginBottom + tabletMarginBottomSuffix,
        marginLeft:
          tabletMarginType === "grouped"
            ? tabletMargin + tabletMarginSuffix
            : tabletMarginLeft + tabletMarginLeftSuffix
      },

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

  return {
    /* ######### DESKTOP NORMAL ######### */

    "--horizontalAlign": styleAlignHorizontalAlign({ v, device: "desktop" }),
    "--paddingTop": stylePadding({
      v,
      device: "desktop",
      current: "paddingTop"
    }),
    "--paddingRight": stylePadding({
      v,
      device: "desktop",
      current: "paddingRight"
    }),
    "--paddingBottom": stylePadding({
      v,
      device: "desktop",
      current: "paddingBottom"
    }),
    "--paddingLeft": stylePadding({
      v,
      device: "desktop",
      current: "paddingLeft"
    }),

    "--marginTop": styleMargin({
      v,
      device: "desktop",
      current: "marginTop"
    }),
    "--marginRight": styleMargin({
      v,
      device: "desktop",
      current: "marginRight"
    }),
    "--marginBottom": styleMargin({
      v,
      device: "desktop",
      current: "marginBottom"
    }),
    "--marginLeft": styleMargin({
      v,
      device: "desktop",
      current: "marginLeft"
    }),
    "--zIndex": styleZIndex({ v }),

    /* ######### TABLET NORMAL ######### */

    "--tabletHorizontalAlign": styleAlignHorizontalAlign({
      v,
      device: "tablet"
    }),
    "--tabletPaddingTop": stylePadding({
      v,
      device: "tablet",
      current: "paddingTop"
    }),
    "--tabletPaddingRight": stylePadding({
      v,
      device: "tablet",
      current: "paddingRight"
    }),
    "--tabletPaddingBottom": stylePadding({
      v,
      device: "tablet",
      current: "paddingBottom"
    }),
    "--tabletPaddingLeft": stylePadding({
      v,
      device: "tablet",
      current: "paddingLeft"
    }),
    "--tabletMarginTop": styleMargin({
      v,
      device: "tablet",
      current: "marginTop"
    }),
    "--tabletMarginRight": styleMargin({
      v,
      device: "tablet",
      current: "marginRight"
    }),
    "--tabletMarginBottom": styleMargin({
      v,
      device: "tablet",
      current: "marginBottom"
    }),
    "--tabletMarginLeft": styleMargin({
      v,
      device: "tablet",
      current: "marginLeft"
    }),

    /* ######### MOBILE NORMAL ######### */

    "--mobileHorizontalAlign": styleAlignHorizontalAlign({
      v,
      device: "mobile"
    }),
    "--mobilePaddingTop": stylePadding({
      v,
      device: "mobile",
      current: "paddingTop"
    }),
    "--mobilePaddingRight": stylePadding({
      v,
      device: "mobile",
      current: "paddingRight"
    }),
    "--mobilePaddingBottom": stylePadding({
      v,
      device: "mobile",
      current: "paddingBottom"
    }),
    "--mobilePaddingLeft": stylePadding({
      v,
      device: "mobile",
      current: "paddingLeft"
    }),
    "--mobileMarginTop": styleMargin({
      v,
      device: "mobile",
      current: "marginTop"
    }),
    "--mobileMarginRight": styleMargin({
      v,
      device: "mobile",
      current: "marginRight"
    }),
    "--mobileMarginBottom": styleMargin({
      v,
      device: "mobile",
      current: "marginBottom"
    }),
    "--mobileMarginLeft": styleMargin({
      v,
      device: "mobile",
      current: "marginLeft"
    })
  };
}
