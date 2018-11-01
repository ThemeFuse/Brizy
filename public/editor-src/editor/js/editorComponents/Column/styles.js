import classnames from "classnames";
import { css } from "glamor";
import { wInMobilePage } from "visual/config/columns";
import { imageUrl } from "visual/utils/image";
import { hexToRgba } from "visual/utils/color";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

const aligns = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end"
};

const isInnerRow = meta => {
  return meta.row && meta.row.isInner;
};

export function bgStyleClassName(v, props) {
  const {
    showOnDesktop,
    showOnTablet,
    showOnMobile,
    customClassName,
    items
  } = v;
  const hasItems = items.length >= 1;

  let glamorObj;

  if (IS_EDITOR) {
    const blurred = {
      filter: "blur(3px)",
      opacity: 0.9
    };
    const paddingStyle = {
      paddingTop: "var(--paddingTop)",
      paddingRight: "var(--paddingRight)",
      paddingBottom: "var(--paddingBottom)",
      paddingLeft: "var(--paddingLeft)"
    };
    const marginStyle = {
      marginTop: "var(--marginTop)",
      marginRight: "var(--marginRight)",
      marginBottom: "var(--marginBottom)",
      marginLeft: "var(--marginLeft)"
    };

    const tabletPaddingStyle = {
      "& > .brz-bg-content": {
        paddingTop: "var(--tabletPaddingTop)",
        paddingRight: "var(--tabletPaddingRight)",
        paddingBottom: "var(--tabletPaddingBottom)",
        paddingLeft: "var(--tabletPaddingLeft)"
      }
    };
    const tabletMarginStyle = {
      marginTop: "var(--tabletMarginTop)",
      marginRight: "var(--tabletMarginRight)",
      marginBottom: "var(--tabletMarginBottom)",
      marginLeft: "var(--tabletMarginLeft)"
    };

    const mobilePaddingStyle = {
      "& > .brz-bg-content": {
        paddingTop: "var(--mobilePaddingTop)",
        paddingRight: "var(--mobilePaddingRight)",
        paddingBottom: "var(--mobilePaddingBottom)",
        paddingLeft: "var(--mobilePaddingLeft)"
      }
    };
    const mobileMarginStyle = {
      marginTop: "var(--mobileMarginTop)",
      marginRight: "var(--mobileMarginRight)",
      marginBottom: "var(--mobileMarginBottom)",
      marginLeft: "var(--mobileMarginLeft)"
    };

    glamorObj = {
      zIndex: "var(--zIndex)",

      "> .brz-bg-media": {
        borderTopWidth: "var(--borderTopWidth)",
        borderRightWidth: "var(--borderRightWidth)",
        borderBottomWidth: "var(--borderBottomWidth)",
        borderLeftWidth: "var(--borderLeftWidth)",
        borderColor: "var(--borderColor)",
        borderStyle: "var(--borderStyle)",
        borderTopLeftRadius: "var(--borderTopLeftRadius)",
        borderTopRightRadius: "var(--borderTopRightRadius)",
        borderBottomLeftRadius: "var(--borderBottomLeftRadius)",
        borderBottomRightRadius: "var(--borderBottomRightRadius)",
        boxShadow: "var(--boxShadow)"
      },
      "> .brz-bg-content": {
        borderTopWidth: "var(--borderTopWidth)",
        borderRightWidth: "var(--borderRightWidth)",
        borderBottomWidth: "var(--borderBottomWidth)",
        borderLeftWidth: "var(--borderLeftWidth)",
        borderColor: "transparent",
        borderStyle: "solid"
      },
      ".brz-ed--desktop &": {
        ...(showOnDesktop === "on" ? null : blurred),
        ...(hasItems ? paddingStyle : null),
        ...(hasItems ? { alignItems: "var(--verticalAlign)" } : null),
        ...(hasItems ? marginStyle : null),

        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--backgroundImage)",
          backgroundPositionX: "var(--backgroundPositionX)",
          backgroundPositionY: "var(--backgroundPositionY)"
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--backgroundColor)"
        }
      },
      ".brz-ed--tablet &": {
        ...(showOnTablet === "on" ? null : blurred),
        ...(hasItems ? tabletPaddingStyle : null),
        ...(hasItems ? tabletMarginStyle : null),
        ...(hasItems ? { alignItems: "var(--verticalAlign)" } : null),

        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--tabletBackgroundImage)",
          backgroundPositionX: "var(--tabletBackgroundPositionX)",
          backgroundPositionY: "var(--tabletBackgroundPositionY)"
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--tabletBackgroundColor)"
        }
      },
      ".brz-ed--mobile &": {
        ...(showOnMobile === "on" ? null : blurred),
        ...(hasItems ? mobilePaddingStyle : null),
        ...(hasItems ? mobileMarginStyle : null),

        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--mobileBackgroundImage)",
          backgroundPositionX: "var(--mobileBackgroundPositionX)",
          backgroundPositionY: "var(--mobileBackgroundPositionY)"
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--mobileBackgroundColor)"
        }
      }
    };
  } else {
    const {
      verticalAlign,
      bgImageSrc,
      bgPositionX,
      bgPositionY,
      bgColorHex,
      bgColorOpacity,
      borderWidthType,
      borderWidth,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderColorHex,
      borderColorOpacity,
      borderRadiusType,
      borderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      boxShadow,
      boxShadowColorHex,
      boxShadowColorOpacity,
      boxShadowBlur,
      boxShadowSpread,
      boxShadowVertical,
      boxShadowHorizontal,
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
      zIndex,

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
    const paddingStyle = {
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
          : paddingLeft + paddingLeftSuffix
    };
    const marginStyle = {
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
          : marginLeft + marginLeftSuffix
    };

    // Tablet
    const tabletPaddingStyle = {
      "& > .brz-bg-content": {
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
            : tabletPaddingLeft + tabletPaddingLeftSuffix
      }
    };
    const tabletMarginStyle = {
      marginTop:
        tabletMarginType === "grouped"
          ? tabletMargin + tabletMarginSuffix
          : tabletMarginTop + tabletMarginTopSuffix,
      marginBottom:
        tabletMarginType === "grouped"
          ? tabletMargin + tabletMarginSuffix
          : tabletMarginBottom + tabletMarginBottomSuffix,
      marginLeft:
        tabletMarginType === "grouped"
          ? tabletMargin + tabletMarginSuffix
          : tabletMarginLeft + tabletMarginLeftSuffix,
      marginRight:
        tabletMarginType === "grouped"
          ? tabletMargin + tabletMarginSuffix
          : tabletMarginRight + tabletMarginRightSuffix
    };

    // Mobile
    const mobilePaddingStyle = {
      "& > .brz-bg-content": {
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
            : mobilePaddingLeft + mobilePaddingLeftSuffix
      }
    };
    const mobileMarginStyle = {
      marginTop:
        mobileMarginType === "grouped"
          ? mobileMargin + mobileMarginSuffix
          : mobileMarginTop + mobileMarginTopSuffix,
      marginBottom:
        mobileMarginType === "grouped"
          ? mobileMargin + mobileMarginSuffix
          : mobileMarginBottom + mobileMarginBottomSuffix,
      marginLeft:
        mobileMarginType === "grouped"
          ? mobileMargin + mobileMarginSuffix
          : mobileMarginLeft + mobileMarginLeftSuffix,
      marginRight:
        mobileMarginType === "grouped"
          ? mobileMargin + mobileMarginSuffix
          : mobileMarginRight + mobileMarginRightSuffix
    };
    const boxShadowStyle =
      boxShadow === "on"
        ? `${boxShadowHorizontal}px ${boxShadowVertical}px ${boxShadowBlur}px ${boxShadowSpread}px ${hexToRgba(
            boxShadowColorHex,
            boxShadowColorOpacity
          )}`
        : "none";

    glamorObj = {
      zIndex: zIndex === 0 ? "auto" : zIndex,

      ...(hasItems ? marginStyle : null),

      "> .brz-bg-content": {
        borderTopWidth:
          borderWidthType === "grouped"
            ? `${borderWidth}px`
            : `${borderTopWidth}px`,
        borderRightWidth:
          borderWidthType === "grouped"
            ? `${borderWidth}px`
            : `${borderRightWidth}px`,
        borderBottomWidth:
          borderWidthType === "grouped"
            ? `${borderWidth}px`
            : `${borderBottomWidth}px`,
        borderLeftWidth:
          borderWidthType === "grouped"
            ? `${borderWidth}px`
            : `${borderLeftWidth}px`,

        borderColor: "transparent",
        borderStyle: "solid",
        ...(hasItems ? paddingStyle : null)
      },
      "> .brz-bg-media": {
        borderTopWidth:
          borderWidthType === "grouped"
            ? `${borderWidth}px`
            : `${borderTopWidth}px`,
        borderRightWidth:
          borderWidthType === "grouped"
            ? `${borderWidth}px`
            : `${borderRightWidth}px`,
        borderBottomWidth:
          borderWidthType === "grouped"
            ? `${borderWidth}px`
            : `${borderBottomWidth}px`,
        borderLeftWidth:
          borderWidthType === "grouped"
            ? `${borderWidth}px`
            : `${borderLeftWidth}px`,

        borderColor: `${hexToRgba(borderColorHex, borderColorOpacity)}`,
        borderStyle: "solid",

        borderTopLeftRadius:
          borderRadiusType === "grouped"
            ? `${borderRadius}px`
            : `${borderTopLeftRadius}px`,
        borderTopRightRadius:
          borderRadiusType === "grouped"
            ? `${borderRadius}px`
            : `${borderTopRightRadius}px`,
        borderBottomLeftRadius:
          borderRadiusType === "grouped"
            ? `${borderRadius}px`
            : `${borderBottomLeftRadius}px`,
        borderBottomRightRadius:
          borderRadiusType === "grouped"
            ? `${borderRadius}px`
            : `${borderBottomRightRadius}px`,
        boxShadow: boxShadowStyle
      },
      "> .brz-bg-media > .brz-bg-image": {
        backgroundImage: bgImageSrc ? `url(${imageUrl(bgImageSrc)})` : "none",
        backgroundPosition: `${bgPositionX}% ${bgPositionY}%`
      },
      "> .brz-bg-media > .brz-bg-color": {
        backgroundColor: hexToRgba(bgColorHex, bgColorOpacity)
      },
      "@media (max-width: 991px)": {
        ...(hasItems ? tabletMarginStyle : null),
        ...(hasItems ? tabletPaddingStyle : null),

        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: tabletSyncOnChange(v, "bgImageSrc")
            ? `url(${imageUrl(tabletSyncOnChange(v, "bgImageSrc"))})`
            : "none",
          backgroundPosition: `
            ${tabletSyncOnChange(v, "bgPositionX")}%
            ${tabletSyncOnChange(v, "bgPositionY")}%
          `
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: hexToRgba(
            tabletSyncOnChange(v, "bgColorHex"),
            tabletSyncOnChange(v, "bgColorOpacity")
          )
        }
      },
      "@media (max-width: 991px) and (min-width: 768px)": {
        ".brz &": {
          display: showOnTablet === "off" && "none"
        }
      },
      "@media (max-width: 767px)": {
        ...(hasItems ? mobileMarginStyle : null),
        ...(hasItems ? mobilePaddingStyle : null),

        ".brz &": {
          display: showOnMobile === "off" && "none"
        },
        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: mobileSyncOnChange(v, "bgImageSrc")
            ? `url(${imageUrl(mobileSyncOnChange(v, "bgImageSrc"))})`
            : "none",
          backgroundPosition: `
            ${mobileSyncOnChange(v, "bgPositionX")}%
            ${mobileSyncOnChange(v, "bgPositionY")}%
          `
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: hexToRgba(
            mobileSyncOnChange(v, "bgColorHex"),
            mobileSyncOnChange(v, "bgColorOpacity")
          )
        }
      },
      "@media (min-width: 768px)": {
        ".brz &": {
          alignItems: hasItems && `${aligns[verticalAlign]}`
        }
      },
      "@media (min-width: 992px)": {
        ".brz &": {
          display: showOnDesktop === "off" && "none"
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-d-xs-flex", glamorClassName, customClassName);
}

export function bgStyleCSSVars(v, props) {
  if (IS_PREVIEW) return;

  const {
    verticalAlign,
    bgImageSrc,
    bgColorHex,
    bgColorOpacity,
    bgPositionX,
    bgPositionY,
    borderWidthType,
    borderWidth,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,
    borderColorHex,
    borderColorOpacity,
    borderRadiusType,
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    boxShadow,
    boxShadowColorHex,
    boxShadowColorOpacity,
    boxShadowBlur,
    boxShadowSpread,
    boxShadowVertical,
    boxShadowHorizontal,
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
    zIndex,

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

  const boxShadowStyle =
    boxShadow === "on"
      ? `${boxShadowHorizontal}px ${boxShadowVertical}px ${boxShadowBlur}px ${boxShadowSpread}px ${hexToRgba(
          boxShadowColorHex,
          boxShadowColorOpacity
        )}`
      : "none";

  return {
    "--verticalAlign": aligns[verticalAlign],
    "--backgroundImage": Boolean(bgImageSrc)
      ? `url(${imageUrl(bgImageSrc)})`
      : "none",
    "--backgroundPositionX": `${bgPositionX}%`,
    "--backgroundPositionY": `${bgPositionY}%`,
    "--backgroundColor": hexToRgba(bgColorHex, bgColorOpacity),
    "--borderTopWidth":
      borderWidthType === "grouped"
        ? `${borderWidth}px`
        : `${borderTopWidth}px`,
    "--borderRightWidth":
      borderWidthType === "grouped"
        ? `${borderWidth}px`
        : `${borderRightWidth}px`,
    "--borderBottomWidth":
      borderWidthType === "grouped"
        ? `${borderWidth}px`
        : `${borderBottomWidth}px`,
    "--borderLeftWidth":
      borderWidthType === "grouped"
        ? `${borderWidth}px`
        : `${borderLeftWidth}px`,
    "--borderColor": `${hexToRgba(borderColorHex, borderColorOpacity)}`,
    "--borderStyle": "solid",
    "--borderTopLeftRadius":
      borderRadiusType === "grouped"
        ? `${borderRadius}px`
        : `${borderTopLeftRadius}px`,
    "--borderTopRightRadius":
      borderRadiusType === "grouped"
        ? `${borderRadius}px`
        : `${borderTopRightRadius}px`,
    "--borderBottomLeftRadius":
      borderRadiusType === "grouped"
        ? `${borderRadius}px`
        : `${borderBottomLeftRadius}px`,
    "--borderBottomRightRadius":
      borderRadiusType === "grouped"
        ? `${borderRadius}px`
        : `${borderBottomRightRadius}px`,
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
    "--zIndex": zIndex === 0 ? "auto" : zIndex,
    "--boxShadow": boxShadowStyle,

    // Tablet
    "--tabletBackgroundImage": tabletSyncOnChange(v, "bgImageSrc")
      ? `url(${imageUrl(tabletSyncOnChange(v, "bgImageSrc"))})`
      : "none",
    "--tabletBackgroundPositionX": `${tabletSyncOnChange(v, "bgPositionX")}%`,
    "--tabletBackgroundPositionY": `${tabletSyncOnChange(v, "bgPositionY")}%`,
    "--tabletBackgroundColor": hexToRgba(
      tabletSyncOnChange(v, "bgColorHex"),
      tabletSyncOnChange(v, "bgColorOpacity")
    ),
    "--tabletMarginTop":
      tabletMarginType === "grouped"
        ? tabletMargin + tabletMarginSuffix
        : tabletMarginTop + tabletMarginTopSuffix,
    "--tabletMarginBottom":
      tabletMarginType === "grouped"
        ? tabletMargin + tabletMarginSuffix
        : tabletMarginBottom + tabletMarginBottomSuffix,
    "--tabletMarginLeft":
      tabletMarginType === "grouped"
        ? tabletMargin + tabletMarginSuffix
        : tabletMarginLeft + tabletMarginLeftSuffix,
    "--tabletMarginRight":
      tabletMarginType === "grouped"
        ? tabletMargin + tabletMarginSuffix
        : tabletMarginRight + tabletMarginRightSuffix,
    "--tabletPaddingTop":
      tabletPaddingType === "grouped"
        ? tabletPadding + tabletPaddingSuffix
        : tabletPaddingTop + tabletPaddingTopSuffix,
    "--tabletPaddingRight":
      tabletPaddingType === "grouped"
        ? tabletPadding + tabletPaddingSuffix
        : tabletPaddingRight + tabletPaddingRightSuffix,
    "--tabletPaddingBottom":
      tabletPaddingType === "grouped"
        ? tabletPadding + tabletPaddingSuffix
        : tabletPaddingBottom + tabletPaddingBottomSuffix,
    "--tabletPaddingLeft":
      tabletPaddingType === "grouped"
        ? tabletPadding + tabletPaddingSuffix
        : tabletPaddingLeft + tabletPaddingLeftSuffix,

    // Mobile
    "--mobileBackgroundImage": mobileSyncOnChange(v, "bgImageSrc")
      ? `url(${imageUrl(mobileSyncOnChange(v, "bgImageSrc"))})`
      : "none",
    "--mobileBackgroundPositionX": `${mobileSyncOnChange(v, "bgPositionX")}%`,
    "--mobileBackgroundPositionY": `${mobileSyncOnChange(v, "bgPositionY")}%`,
    "--mobileBackgroundColor": hexToRgba(
      mobileSyncOnChange(v, "bgColorHex"),
      mobileSyncOnChange(v, "bgColorOpacity")
    ),
    "--mobileMarginTop":
      mobileMarginType === "grouped"
        ? mobileMargin + mobileMarginSuffix
        : mobileMarginTop + mobileMarginTopSuffix,
    "--mobileMarginBottom":
      mobileMarginType === "grouped"
        ? mobileMargin + mobileMarginSuffix
        : mobileMarginBottom + mobileMarginBottomSuffix,
    "--mobileMarginLeft":
      mobileMarginType === "grouped"
        ? mobileMargin + mobileMarginSuffix
        : mobileMarginLeft + mobileMarginLeftSuffix,
    "--mobileMarginRight":
      mobileMarginType === "grouped"
        ? mobileMargin + mobileMarginSuffix
        : mobileMarginRight + mobileMarginRightSuffix,
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

export function styleClassName(v, props) {
  const { className, items } = v;
  const { meta } = props;

  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        willChange: "flex, max-width",
        flex: "1 1 var(--width)",
        maxWidth: "var(--width)"
      },
      ".brz-ed--tablet &": {
        willChange: "flex, max-width",
        flex: "1 1 var(--width)",
        maxWidth: "var(--width)"
      },
      ".brz-ed--mobile &": {
        willChange: "flex, max-width",
        flex: "1 1 var(--mobileWidth)",
        maxWidth: "var(--mobileWidth)"
      }
    };
    if (items.length === 0) {
      glamorObj["& > .brz-ed-border"] = {
        flex: 1,
        display: "flex",
        flexDirection: "column"
      };
    }
  } else {
    const { width } = v;

    glamorObj = {
      "@media (min-width: 768px)": {
        ".brz &": {
          willChange: "flex, max-width",
          flex: `1 1 ${width}%`,
          maxWidth: `${width}%`
        }
      }
    };

    if (isInnerRow(meta) && meta.desktopW <= wInMobilePage) {
      glamorObj["@media (min-width: 320px)"] = {
        ".brz &": {
          willChange: "flex, max-width",
          flex: `1 1 ${width}%`,
          maxWidth: `${width}%`
        }
      };
    }
    if (items.length === 0) {
      glamorObj["& > .brz-ed-border"] = {
        flex: 1,
        display: "flex",
        flexDirection: "column"
      };
    }
  }

  const glamorClassName = String(css(glamorObj));

  return classnames(
    "brz-columns",
    { "brz-columns__posts": IS_EDITOR && meta.posts },
    glamorClassName,
    className
  );
}

export function styleCSSVars(v, props) {
  if (IS_PREVIEW) return;

  const { width } = v;
  const { meta } = props;
  const needMobileWidth = isInnerRow(meta) && meta.desktopW <= wInMobilePage;

  return {
    "--width": `${width}%`,
    "--mobileWidth": needMobileWidth ? `${width}%` : "100%"
  };
}
