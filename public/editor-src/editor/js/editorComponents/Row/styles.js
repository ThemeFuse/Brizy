import classnames from "classnames";
import { css } from "glamor";
import { imageUrl } from "visual/utils/image";
import { hexToRgba } from "visual/utils/color";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

const aligns = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end"
};

export function bgStyleClassName(v) {
  const { showOnDesktop, showOnTablet, showOnMobile, customClassName } = v;

  let glamorObj;
  if (IS_EDITOR) {
    const blurred = {
      filter: "blur(3px)",
      opacity: 0.9
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
        alignItems: "var(--verticalAlign)",
        maxWidth: "var(--maxWidth)",
        minHeight: "var(--minHeight) !important",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "var(--marginTop)",
        marginBottom: "var(--marginBottom)",

        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--backgroundImage)",
          backgroundPositionX: "var(--backgroundPositionX)",
          backgroundPositionY: "var(--backgroundPositionY)"
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--backgroundColor)"
        },
        "> .brz-bg-media > .brz-bg-map": {
          display: "var(--mediaBg)"
        }
      },
      ".brz-ed--tablet &": {
        ...(showOnTablet === "on" ? null : blurred),
        marginTop: "var(--tabletMarginTop)",
        marginBottom: "var(--tabletMarginBottom)",

        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--tabletBackgroundImage)",
          backgroundPositionX: "var(--tabletBackgroundPositionX)",
          backgroundPositionY: "var(--tabletBackgroundPositionY)"
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--tabletBackgroundColor)"
        },
        "> .brz-bg-media > .brz-bg-map": {
          display: "var(--tabletMediaBg)"
        }
      },
      ".brz-ed--mobile &": {
        ...(showOnMobile === "on" ? null : blurred),
        marginTop: "var(--mobileMarginTop)",
        marginBottom: "var(--mobileMarginBottom)",

        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--mobileBackgroundImage)",
          backgroundPositionX: "var(--mobileBackgroundPositionX)",
          backgroundPositionY: "var(--mobileBackgroundPositionY)"
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--mobileBackgroundColor)"
        },
        "> .brz-bg-media > .brz-bg-map": {
          display: "var(--mobileMediaBg)"
        }
      }
    };
  } else {
    const {
      size: maxWidth,
      verticalAlign,
      columnsHeight,
      columnsHeightStyle,
      marginType,
      margin,
      marginSuffix,
      marginTop,
      marginTopSuffix,
      marginBottom,
      marginBottomSuffix,
      media,
      bgImageSrc,
      bgPositionX,
      bgPositionY,
      bgColorHex,
      bgColorOpacity,
      borderWidth,
      borderWidthType,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderColorHex,
      borderColorOpacity,
      borderRadius,
      borderRadiusType,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      zIndex,
      boxShadow,
      boxShadowColorHex,
      boxShadowColorOpacity,
      boxShadowBlur,
      boxShadowSpread,
      boxShadowVertical,
      boxShadowHorizontal,

      // Tablet
      tabletMarginType,
      tabletMargin,
      tabletMarginSuffix,
      tabletMarginTop,
      tabletMarginTopSuffix,
      tabletMarginBottom,
      tabletMarginBottomSuffix,

      // Mobile
      mobileMarginType,
      mobileMargin,
      mobileMarginSuffix,
      mobileMarginTop,
      mobileMarginTopSuffix,
      mobileMarginBottom,
      mobileMarginBottomSuffix
    } = v;
    const boxShadowStyle =
      boxShadow === "on"
        ? `${boxShadowHorizontal}px ${boxShadowVertical}px ${boxShadowBlur}px ${boxShadowSpread}px ${hexToRgba(
            boxShadowColorHex,
            boxShadowColorOpacity
          )}`
        : "none";

    glamorObj = {
      zIndex: zIndex === 0 ? "auto" : zIndex,

      marginLeft: "auto",
      marginRight: "auto",
      marginTop:
        marginType === "grouped"
          ? margin + marginSuffix
          : marginTop + marginTopSuffix,
      marginBottom:
        marginType === "grouped"
          ? margin + marginSuffix
          : marginBottom + marginBottomSuffix,

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
        borderStyle: "solid"
      },
      "> .brz-bg-media > .brz-bg-image": {
        backgroundImage:
          media === "image" && bgImageSrc
            ? `url(${imageUrl(bgImageSrc)})`
            : "none",
        backgroundPosition: `${bgPositionX}% ${bgPositionY}%`
      },
      "> .brz-bg-media > .brz-bg-color": {
        backgroundColor: hexToRgba(bgColorHex, bgColorOpacity)
      },
      "> .brz-bg-media > .brz-bg-map": {
        display: media === "map" ? "block" : "none"
      },
      "@media (max-width: 991px)": {
        marginTop:
          tabletMarginType === "grouped"
            ? tabletMargin + tabletMarginSuffix
            : tabletMarginTop + tabletMarginTopSuffix,
        marginBottom:
          tabletMarginType === "grouped"
            ? tabletMargin + tabletMarginSuffix
            : tabletMarginBottom + tabletMarginBottomSuffix,

        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage:
            tabletSyncOnChange(v, "bgImageSrc") &&
            tabletSyncOnChange(v, "media") !== "map"
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
        },
        "> .brz-bg-media > .brz-bg-map": {
          display: tabletSyncOnChange(v, "media") === "map" ? "block" : "none"
        }
      },
      "@media (max-width: 991px) and (min-width: 768px)": {
        ".brz &": {
          display: showOnTablet === "off" && "none"
        }
      },
      "@media (max-width: 767px)": {
        marginTop:
          mobileMarginType === "grouped"
            ? mobileMargin + mobileMarginSuffix
            : mobileMarginTop + mobileMarginTopSuffix,
        marginBottom:
          mobileMarginType === "grouped"
            ? mobileMargin + mobileMarginSuffix
            : mobileMarginBottom + mobileMarginBottomSuffix,

        ".brz &": {
          display: showOnMobile === "off" && "none"
        },
        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage:
            mobileSyncOnChange(v, "bgImageSrc") &&
            mobileSyncOnChange(v, "media") !== "map"
              ? `url(${imageUrl(mobileSyncOnChange(v, "bgImageSrc"))})`
              : "none",
          backgroundPosition: `${mobileSyncOnChange(
            v,
            "bgPositionX"
          )}% ${mobileSyncOnChange(v, "bgPositionY")}%`
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: hexToRgba(
            mobileSyncOnChange(v, "bgColorHex"),
            mobileSyncOnChange(v, "bgColorOpacity")
          )
        },
        "> .brz-bg-media > .brz-bg-map": {
          display: mobileSyncOnChange(v, "media") === "map" ? "block" : "none"
        }
      },
      "@media (min-width: 992px)": {
        ".brz &": {
          display: showOnDesktop === "off" && "none",
          alignItems: `${aligns[verticalAlign]}`,
          maxWidth: `${maxWidth}%`,
          minHeight:
            columnsHeightStyle === "custom"
              ? `${columnsHeight}px !important`
              : "auto"
        }
      }
    };
  }
  const glamorClassName = String(css(glamorObj));

  return classnames(
    "brz-d-xs-flex",
    "brz-flex-xs-wrap",
    customClassName,
    glamorClassName
  );
}

export function bgStyleCSSVars(v) {
  if (IS_PREVIEW) return null;

  const {
    size: maxWidth,
    columnsHeightStyle,
    columnsHeight,
    verticalAlign,
    media,
    bgImageSrc,
    bgPositionX,
    bgPositionY,
    bgColorHex,
    bgColorOpacity,
    marginType,
    margin,
    marginSuffix,
    marginTop,
    marginTopSuffix,
    marginBottom,
    marginBottomSuffix,
    borderWidth,
    borderWidthType,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,
    borderColorHex,
    borderColorOpacity,
    borderRadius,
    borderRadiusType,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    zIndex,
    boxShadow,
    boxShadowColorHex,
    boxShadowColorOpacity,
    boxShadowBlur,
    boxShadowSpread,
    boxShadowVertical,
    boxShadowHorizontal,

    // Tablet
    tabletMarginType,
    tabletMargin,
    tabletMarginSuffix,
    tabletMarginTop,
    tabletMarginTopSuffix,
    tabletMarginBottom,
    tabletMarginBottomSuffix,

    // Mobile
    mobileMarginType,
    mobileMargin,
    mobileMarginSuffix,
    mobileMarginTop,
    mobileMarginTopSuffix,
    mobileMarginBottom,
    mobileMarginBottomSuffix
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
    "--maxWidth": `${maxWidth}%`,
    "--minHeight":
      columnsHeightStyle === "custom" ? `${columnsHeight}px` : "auto",
    "--marginTop":
      marginType === "grouped"
        ? margin + marginSuffix
        : marginTop + marginTopSuffix,
    "--marginBottom":
      marginType === "grouped"
        ? margin + marginSuffix
        : marginBottom + marginBottomSuffix,
    "--mediaBg": media === "map" ? "block" : "none",
    "--backgroundImage":
      media === "image" && bgImageSrc ? `url(${imageUrl(bgImageSrc)})` : "none",
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
    "--zIndex": zIndex === 0 ? "auto" : zIndex,
    "--boxShadow": boxShadowStyle,

    // Tablet
    "--tabletMediaBg":
      tabletSyncOnChange(v, "media") === "map" ? "block" : "none",
    "--tabletBackgroundImage":
      tabletSyncOnChange(v, "bgImageSrc") &&
      tabletSyncOnChange(v, "media") !== "map"
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

    // Mobile
    "--mobileMediaBg":
      mobileSyncOnChange(v, "media") === "map" ? "block" : "none",
    "--mobileBackgroundImage":
      mobileSyncOnChange(v, "bgImageSrc") &&
      mobileSyncOnChange(v, "media") !== "map"
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
        : mobileMarginBottom + mobileMarginBottomSuffix
  };
}

export function containerStyleClassName(v, isInnerRow) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        paddingTop: "var(--paddingTop)",
        paddingRight: "var(--paddingRight)",
        paddingBottom: "var(--paddingBottom)",
        paddingLeft: "var(--paddingLeft)"
      },
      ".brz-ed--tablet &": {
        paddingTop: "var(--tabletPaddingTop)",
        paddingRight: "var(--tabletPaddingRight)",
        paddingBottom: "var(--tabletPaddingBottom)",
        paddingLeft: "var(--tabletPaddingLeft)"
      },
      ".brz-ed--mobile &": {
        paddingTop: "var(--mobilePaddingTop)",
        paddingRight: "var(--mobilePaddingRight)",
        paddingBottom: "var(--mobilePaddingBottom)",
        paddingLeft: "var(--mobilePaddingLeft)"
      }
    };
  } else {
    const {
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

      // Tablet
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

      "@media (max-width: 991px)": {
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
      },

      "@media (max-width: 767px)": {
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
  }

  const glamorClassName = String(css(glamorObj));

  return classnames(
    "brz-row",
    { "brz-row--inner": isInnerRow },
    className,
    glamorClassName
  );
}

export function containerStyleCSSVars(v, isInnerRow) {
  if (IS_PREVIEW) return;

  const {
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

    // Tablet
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

    // Tablet
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
