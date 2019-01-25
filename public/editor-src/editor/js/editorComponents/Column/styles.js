import classnames from "classnames";
import { css } from "glamor";
import { imageUrl } from "visual/utils/image";
import { hexToRgba } from "visual/utils/color";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import {
  styleBgImage,
  styleBgPositionX,
  styleBgPositionY,
  styleBorderStyle,
  styleBorderWidth,
  styleBorderRadius,
  styleBgColor,
  styleBorderColor,
  styleVerticalAlign,
  stylePadding,
  styleMargin,
  styleBoxShadow,
  styleSizeWidth,
  styleShowOnDesktopFilter,
  styleShowOnDesktopOpacity,
  styleShowOnTabletFilter,
  styleShowOnTabletOpacity,
  styleShowOnMobileFilter,
  styleShowOnMobileOpacity,
  styleZIndex
} from "visual/utils/style";

const aligns = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end"
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
        filter: "var(--filter)",
        opacity: "var(--opacity)",

        paddingTop: "var(--paddingTop)",
        paddingRight: "var(--paddingRight)",
        paddingBottom: "var(--paddingBottom)",
        paddingLeft: "var(--paddingLeft)",

        alignItems: "var(--verticalAlign)",

        marginTop: "var(--marginTop)",
        marginRight: "var(--marginRight)",
        marginBottom: "var(--marginBottom)",
        marginLeft: "var(--marginLeft)",

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
        filter: "var(--tabletFilter)",
        opacity: "var(--tabletOpacity)",

        alignItems: "var(--tabletVerticalAlign)",

        marginTop: "var(--tabletMarginTop)",
        marginRight: "var(--tabletMarginRight)",
        marginBottom: "var(--tabletMarginBottom)",
        marginLeft: "var(--tabletMarginLeft)",

        "& > .brz-bg-content": {
          paddingTop: "var(--tabletPaddingTop)",
          paddingRight: "var(--tabletPaddingRight)",
          paddingBottom: "var(--tabletPaddingBottom)",
          paddingLeft: "var(--tabletPaddingLeft)"
        },

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
        filter: "var(--mobileFilter)",
        opacity: "var(--mobileOpacity)",

        marginTop: "var(--mobileMarginTop)",
        marginRight: "var(--mobileMarginRight)",
        marginBottom: "var(--mobileMarginBottom)",
        marginLeft: "var(--mobileMarginLeft)",

        "& > .brz-bg-content": {
          paddingTop: "var(--mobilePaddingTop)",
          paddingRight: "var(--mobilePaddingRight)",
          paddingBottom: "var(--mobilePaddingBottom)",
          paddingLeft: "var(--mobilePaddingLeft)"
        },

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
  const { items } = v;
  const hasItems = items.length >= 1;

  if (IS_PREVIEW) return;

  return {
    "--backgroundImage": styleBgImage({
      v,
      device: "desktop",
      state: "normal"
    }),
    "--backgroundPositionX": styleBgPositionX({
      v,
      device: "desktop",
      state: "normal"
    }),
    "--backgroundPositionY": styleBgPositionY({
      v,
      device: "desktop",
      state: "normal"
    }),
    "--borderTopWidth": styleBorderWidth({
      v,
      device: "desktop",
      state: "normal",
      current: "borderTopWidth"
    }),
    "--borderRightWidth": styleBorderWidth({
      v,
      device: "desktop",
      state: "normal",
      current: "borderRightWidth"
    }),
    "--borderBottomWidth": styleBorderWidth({
      v,
      device: "desktop",
      state: "normal",
      current: "borderBottomWidth"
    }),
    "--borderLeftWidth": styleBorderWidth({
      v,
      device: "desktop",
      state: "normal",
      current: "borderLeftWidth"
    }),
    "--borderStyle": styleBorderStyle({
      v,
      device: "desktop",
      state: "normal"
    }),
    "--borderTopLeftRadius": styleBorderRadius({
      v,
      device: "desktop",
      state: "normal",
      current: "borderTopLeftRadius"
    }),
    "--borderTopRightRadius": styleBorderRadius({
      v,
      device: "desktop",
      state: "normal",
      current: "borderTopRightRadius"
    }),
    "--borderBottomLeftRadius": styleBorderRadius({
      v,
      device: "desktop",
      state: "normal",
      current: "borderBottomLeftRadius"
    }),
    "--borderBottomRightRadius": styleBorderRadius({
      v,
      device: "desktop",
      state: "normal",
      current: "borderBottomRightRadius"
    }),
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
    "--verticalAlign": styleVerticalAlign({
      v,
      device: "desktop",
      state: "normal",
      hasItems
    }),
    "--paddingTop": stylePadding({
      v,
      device: "desktop",
      state: "normal",
      current: "paddingTop",
      hasItems
    }),
    "--paddingRight": stylePadding({
      v,
      device: "desktop",
      state: "normal",
      current: "paddingRight",
      hasItems
    }),
    "--paddingBottom": stylePadding({
      v,
      device: "desktop",
      state: "normal",
      current: "paddingBottom",
      hasItems
    }),
    "--paddingLeft": stylePadding({
      v,
      device: "desktop",
      state: "normal",
      current: "paddingLeft",
      hasItems
    }),
    "--marginTop": styleMargin({
      v,
      device: "desktop",
      state: "normal",
      current: "marginTop",
      hasItems
    }),
    "--marginRight": styleMargin({
      v,
      device: "desktop",
      state: "normal",
      current: "marginRight",
      hasItems
    }),
    "--marginBottom": styleMargin({
      v,
      device: "desktop",
      state: "normal",
      current: "marginBottom",
      hasItems
    }),
    "--marginLeft": styleMargin({
      v,
      device: "desktop",
      state: "normal",
      current: "marginLeft",
      hasItems
    }),
    "--boxShadow": styleBoxShadow({ v, device: "desktop", state: "normal" }),
    "--filter": styleShowOnDesktopFilter({ v }),
    "--opacity": styleShowOnDesktopOpacity({ v }),
    "--zIndex": styleZIndex({ v }),

    // Tablet
    "--tabletFilter": styleShowOnTabletFilter({ v }),
    "--tabletOpacity": styleShowOnTabletOpacity({ v }),
    "--tabletBackgroundImage": styleBgImage({
      v,
      device: "tablet",
      state: "normal"
    }),
    "--tabletBackgroundPositionX": styleBgPositionX({
      v,
      device: "tablet",
      state: "normal"
    }),
    "--tabletBackgroundPositionY": styleBgPositionY({
      v,
      device: "tablet",
      state: "normal"
    }),
    "--tabletBackgroundColor": styleBgColor({
      v,
      device: "tablet",
      state: "normal"
    }),
    "--tabletPaddingTop": stylePadding({
      v,
      device: "tablet",
      state: "normal",
      current: "paddingTop",
      hasItems
    }),
    "--tabletPaddingRight": stylePadding({
      v,
      device: "tablet",
      state: "normal",
      current: "paddingRight",
      hasItems
    }),
    "--tabletPaddingBottom": stylePadding({
      v,
      device: "tablet",
      state: "normal",
      current: "paddingBottom",
      hasItems
    }),
    "--tabletPaddingLeft": stylePadding({
      v,
      device: "tablet",
      state: "normal",
      current: "paddingLeft",
      hasItems
    }),
    "--tabletMarginTop": styleMargin({
      v,
      device: "tablet",
      state: "normal",
      current: "marginTop",
      hasItems
    }),
    "--tabletMarginBottom": styleMargin({
      v,
      device: "tablet",
      state: "normal",
      current: "marginBottom",
      hasItems
    }),
    "--tabletMarginLeft": styleMargin({
      v,
      device: "tablet",
      state: "normal",
      current: "marginLeft",
      hasItems
    }),
    "--tabletMarginRight": styleMargin({
      v,
      device: "tablet",
      state: "normal",
      current: "marginRight",
      hasItems
    }),
    "--tabletVerticalAlign": styleVerticalAlign({
      v,
      device: "tablet",
      state: "normal",
      hasItems
    }),

    // Mobile
    "--mobileFilter": styleShowOnMobileFilter({ v }),
    "--mobileOpacity": styleShowOnMobileOpacity({ v }),

    "--mobileBackgroundImage": styleBgImage({
      v,
      device: "mobile",
      state: "normal"
    }),
    "--mobileBackgroundPositionX": styleBgPositionX({
      v,
      device: "mobile",
      state: "normal"
    }),
    "--mobileBackgroundPositionY": styleBgPositionY({
      v,
      device: "mobile",
      state: "normal"
    }),
    "--mobileBackgroundColor": styleBgColor({
      v,
      device: "mobile",
      state: "normal"
    }),
    "--mobilePaddingTop": stylePadding({
      v,
      device: "mobile",
      state: "normal",
      current: "paddingTop",
      hasItems
    }),
    "--mobilePaddingRight": stylePadding({
      v,
      device: "mobile",
      state: "normal",
      current: "paddingRight",
      hasItems
    }),
    "--mobilePaddingBottom": stylePadding({
      v,
      device: "mobile",
      state: "normal",
      current: "paddingBottom",
      hasItems
    }),
    "--mobilePaddingLeft": stylePadding({
      v,
      device: "mobile",
      state: "normal",
      current: "paddingLeft",
      hasItems
    }),
    "--mobileMarginTop": styleMargin({
      v,
      device: "mobile",
      state: "normal",
      current: "marginTop",
      hasItems
    }),
    "--mobileMarginBottom": styleMargin({
      v,
      device: "mobile",
      state: "normal",
      current: "marginBottom",
      hasItems
    }),
    "--mobileMarginLeft": styleMargin({
      v,
      device: "mobile",
      state: "normal",
      current: "marginLeft",
      hasItems
    }),
    "--mobileMarginRight": styleMargin({
      v,
      device: "mobile",
      state: "normal",
      current: "marginRight",
      hasItems
    })
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
        flex: "1 1 var(--tabletWidth)",
        maxWidth: "var(--tabletWidth)"
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
    const { width, mobileWidth, zIndex } = v;

    glamorObj = {
      ".brz &": {
        zIndex: zIndex === 0 ? "auto" : zIndex
      },
      "@media (min-width: 992px)": {
        ".brz &": {
          willChange: "flex, max-width",
          flex: `1 1 ${width}%`,
          maxWidth: `${width}%`
        }
      },
      "@media (max-width: 991px) and (min-width: 768px)": {
        ".brz &": {
          willChange: "flex, max-width",
          flex: `1 1 ${tabletSyncOnChange(v, "width")}%`,
          maxWidth: `${tabletSyncOnChange(v, "width")}%`
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          willChange: "flex, max-width",
          flex: `1 1 ${mobileWidth}%`,
          maxWidth: `${mobileWidth}%`
        }
      }
    };
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

  return {
    "--width": styleSizeWidth({
      v,
      device: "desktop"
    }),
    "--tabletWidth": styleSizeWidth({
      v,
      device: "tablet"
    }),
    "--mobileWidth": styleSizeWidth({
      v,
      device: "mobile"
    })
  };
}
