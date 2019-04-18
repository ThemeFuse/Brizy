import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

import {
  styleItemPaddingTop,
  styleItemPaddingRight,
  styleItemPaddingBottom,
  styleItemPaddingLeft,
  styleItemMarginTop,
  styleItemMarginRight,
  styleItemMarginBottom,
  styleItemMarginLeft
} from "visual/utils/style";

const aligns = {
  left: "flex-start",
  center: "center",
  right: "flex-end"
};

export function styleClassName(v, props) {
  const { customClassName, showOnDesktop, showOnTablet, showOnMobile } = v;
  const { className: propsClassName } = props;
  let glamorObj;

  if (IS_PREVIEW) {
    glamorObj = {
      ".brz &": {
        display: showOnDesktop === "off" && "none"
      },

      "@media (max-width: 991px) and (min-width: 768px)": {
        ".brz &": {
          display: showOnTablet === "off" && "none"
        }
      },

      "@media (max-width: 767px)": {
        ".brz &": {
          display: showOnMobile === "off" && "none"
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames(
    "brz-wrapper-clone",
    glamorClassName,
    customClassName,
    propsClassName
  );
}

export function wrapStyleClassName(v) {
  let glamorObj;

  if (IS_EDITOR) {
    const { showOnDesktop, showOnTablet, showOnMobile } = v;

    const blurred = {
      filter: "blur(3px)",
      opacity: 0.9
    };

    glamorObj = {
      position: "var(--position)",
      zIndex: "var(--zIndex)",

      ".brz-ed--desktop &": {
        ...(showOnDesktop === "on" ? null : blurred),
        marginTop: "var(--marginTop)",
        marginRight: "var(--marginRight)",
        marginBottom: "var(--marginBottom)",
        marginLeft: "var(--marginLeft)"
      },
      ".brz-ed--tablet &": {
        marginTop: "var(--tabletMarginTop)",
        marginBottom: "var(--tabletMarginBottom)",
        marginLeft: "var(--tabletMarginLeft)",
        ...(showOnTablet === "on" ? null : blurred)
      },
      ".brz-ed--mobile &": {
        ...(showOnMobile === "on" ? null : blurred),
        marginTop: "var(--mobileMarginTop)",
        marginRight: "var(--mobileMarginRight)",
        marginBottom: "var(--mobileMarginBottom)",
        marginLeft: "var(--mobileMarginLeft)"
      }
    };
  } else {
    const {
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
      mobileMarginLeftSuffix
    } = v;

    glamorObj = {
      position: zIndex === 0 ? "static" : "relative",
      zIndex: zIndex === 0 ? "auto" : zIndex,
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

  return classnames("brz-wrapper-clone__wrap", glamorClassName);
}

export function wrapStyleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    zIndex,
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
    mobileMarginLeftSuffix
  } = v;

  return {
    "--position": zIndex === 0 ? "static" : "relative",
    "--zIndex": zIndex === 0 ? "auto" : zIndex,
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

    // Tablet
    "--tabletMarginTop":
      tabletMarginType === "grouped"
        ? tabletMargin + tabletMarginSuffix
        : tabletMarginTop + tabletMarginTopSuffix,
    "--tabletMarginRight":
      tabletMarginType === "grouped"
        ? tabletMargin + tabletMarginSuffix
        : tabletMarginRight + tabletMarginRightSuffix,
    "--tabletMarginBottom":
      tabletMarginType === "grouped"
        ? tabletMargin + tabletMarginSuffix
        : tabletMarginBottom + tabletMarginBottomSuffix,
    "--tabletMarginLeft":
      tabletMarginType === "grouped"
        ? tabletMargin + tabletMarginSuffix
        : tabletMarginLeft + tabletMarginLeftSuffix,

    // Mobile
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
        : mobileMarginLeft + mobileMarginLeftSuffix
  };
}

export function containerStyleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      flex: "1 1 auto",

      ".brz-ed--desktop &": {
        justifyContent: "var(--horizontalAlign)",
        paddingTop: "var(--paddingTop)",
        paddingRight: "var(--paddingRight)",
        paddingBottom: "var(--paddingBottom)",
        paddingLeft: "var(--paddingLeft)",

        marginTop: "var(--itemMarginTop)",
        marginRight: "var(--itemMarginRight)",
        marginBottom: "var(--itemMarginBottom)",
        marginLeft: "var(--itemMarginLeft)"
      },
      ".brz-ed--tablet &": {
        justifyContent: "var(--tabletHorizontalAlign)",
        paddingTop: "var(--tabletPaddingTop)",
        paddingRight: "var(--tabletPaddingRight)",
        paddingBottom: "var(--tabletPaddingBottom)",
        paddingLeft: "var(--tabletPaddingLeft)",

        marginTop: "var(--tabletItemMarginTop)",
        marginRight: "var(--tabletItemMarginRight)",
        marginBottom: "var(--tabletItemMarginBottom)",
        marginLeft: "var(--tabletItemMarginLeft)"
      },
      ".brz-ed--mobile &": {
        justifyContent: "var(--mobileHorizontalAlign)",
        paddingTop: "var(--mobilePaddingTop)",
        paddingRight: "var(--mobilePaddingRight)",
        paddingBottom: "var(--mobilePaddingBottom)",
        paddingLeft: "var(--mobilePaddingLeft)",

        marginTop: "var(--mobileItemMarginTop)",
        marginRight: "var(--mobileItemMarginRight)",
        marginBottom: "var(--mobileIMarginBottom)",
        marginLeft: "var(--mobileItemMarginLeft)"
      }
    };
  } else {
    const {
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
      flex: "1 1 auto",

      marginTop: styleItemMarginTop({
        v,
        device: "desktop"
      }),
      marginRight: styleItemMarginRight({
        v,
        device: "desktop"
      }),
      marginBottom: styleItemMarginBottom({
        v,
        device: "desktop"
      }),
      marginLeft: styleItemMarginLeft({
        v,
        device: "desktop"
      }),

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

        marginTop: styleItemMarginTop({
          v,
          device: "tablet"
        }),
        marginRight: styleItemMarginRight({
          v,
          device: "tablet"
        }),
        marginBottom: styleItemMarginBottom({
          v,
          device: "tablet"
        }),
        marginLeft: styleItemMarginLeft({
          v,
          device: "tablet"
        })
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

        marginTop: styleItemMarginTop({
          v,
          device: "mobile"
        }),
        marginRight: styleItemMarginRight({
          v,
          device: "mobile"
        }),
        marginBottom: styleItemMarginBottom({
          v,
          device: "mobile"
        }),
        marginLeft: styleItemMarginLeft({
          v,
          device: "mobile"
        })
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames(
    "brz-d-xs-flex brz-flex-xs-wrap",
    glamorClassName,
    className
  );
}

export function containerStyleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
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

    "--itemMarginTop": styleItemMarginTop({
      v,
      device: "desktop"
    }),
    "--itemMarginRight": styleItemMarginRight({
      v,
      device: "desktop"
    }),
    "--itemMarginBottom": styleItemMarginBottom({
      v,
      device: "desktop"
    }),
    "--itemMarginLeft": styleItemMarginLeft({
      v,
      device: "desktop"
    }),

    // Tablet
    "--tabletHorizontalAlign": aligns[tabletSyncOnChange(v, "horizontalAlign")],
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

    "--tabletItemMarginTop": styleItemMarginTop({
      v,
      device: "tablet"
    }),
    "--tabletItemMarginRight": styleItemMarginRight({
      v,
      device: "tablet"
    }),
    "--tabletItemMarginBottom": styleItemMarginBottom({
      v,
      device: "tablet"
    }),
    "--tabletItemMarginLeft": styleItemMarginLeft({
      v,
      device: "tablet"
    }),

    // Mobile
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
        : mobilePaddingLeft + mobilePaddingLeftSuffix,

    "--mobileItemMarginTop": styleItemMarginTop({
      v,
      device: "mobile"
    }),
    "--mobileItemMarginRight": styleItemMarginRight({
      v,
      device: "mobile"
    }),
    "--mobileItemMarginBottom": styleItemMarginBottom({
      v,
      device: "mobile"
    }),
    "--mobileItemMarginLeft": styleItemMarginLeft({
      v,
      device: "mobile"
    })
  };
}

export function itemsStyleClassName(v) {
  const { itemClassName } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        paddingTop: "var(--itemPaddingTop)",
        paddingRight: "var(--itemPaddingRight)",
        paddingBottom: "var(--itemPaddingBottom)",
        paddingLeft: "var(--itemPaddingLeft)"
      },
      ".brz-ed--tablet &": {
        paddingTop: "var(--tabletItemPaddingTop)",
        paddingRight: "var(--tabletItemPaddingRight)",
        paddingBottom: "var(--tabletItemPaddingBottom)",
        paddingLeft: "var(--tabletItemPaddingLeft)"
      },
      ".brz-ed--mobile &": {
        paddingTop: "var(--mobileItemPaddingTop)",
        paddingRight: "var(--mobileItemPaddingRight)",
        paddingBottom: "var(--mobileItemPaddingBottom)",
        paddingLeft: "var(--mobileItemPaddingLeft)"
      }
    };
  } else {
    glamorObj = {
      paddingTop: styleItemPaddingTop({
        v,
        device: "desktop"
      }),
      paddingRight: styleItemPaddingRight({
        v,
        device: "desktop"
      }),
      paddingBottom: styleItemPaddingBottom({
        v,
        device: "desktop"
      }),
      paddingLeft: styleItemPaddingLeft({
        v,
        device: "desktop"
      }),

      "@media (max-width: 991px)": {
        paddingTop: styleItemPaddingTop({
          v,
          device: "tablet"
        }),
        paddingRight: styleItemPaddingRight({
          v,
          device: "tablet"
        }),
        paddingBottom: styleItemPaddingBottom({
          v,
          device: "tablet"
        }),
        paddingLeft: styleItemPaddingLeft({
          v,
          device: "tablet"
        })
      },
      "@media (max-width: 767px)": {
        paddingTop: styleItemPaddingTop({
          v,
          device: "mobile"
        }),
        paddingRight: styleItemPaddingRight({
          v,
          device: "mobile"
        }),
        paddingBottom: styleItemPaddingBottom({
          v,
          device: "mobile"
        }),
        paddingLeft: styleItemPaddingLeft({
          v,
          device: "mobile"
        })
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-wrapper-clone__item", glamorClassName, itemClassName);
}

export function itemsStyleCSSVars(v) {
  if (IS_PREVIEW) return;

  return {
    "--itemPaddingTop": styleItemPaddingTop({
      v,
      device: "desktop"
    }),
    "--itemPaddingRight": styleItemPaddingRight({
      v,
      device: "desktop"
    }),
    "--itemPaddingBottom": styleItemPaddingBottom({
      v,
      device: "desktop"
    }),
    "--itemPaddingLeft": styleItemPaddingLeft({
      v,
      device: "desktop"
    }),

    "--tabletItemPaddingTop": styleItemPaddingTop({
      v,
      device: "tablet"
    }),
    "--tabletItemPaddingRight": styleItemPaddingRight({
      v,
      device: "tablet"
    }),
    "--tabletItemPaddingBottom": styleItemPaddingBottom({
      v,
      device: "tablet"
    }),
    "--tabletItemPaddingLeft": styleItemPaddingLeft({
      v,
      device: "tablet"
    }),

    "--mobileItemPaddingTop": styleItemPaddingTop({
      v,
      device: "mobile"
    }),
    "--mobileItemPaddingRight": styleItemPaddingRight({
      v,
      device: "mobile"
    }),
    "--mobileItemPaddingBottom": styleItemPaddingBottom({
      v,
      device: "mobile"
    }),
    "--mobileItemPaddingLeft": styleItemPaddingLeft({
      v,
      device: "mobile"
    })
  };
}
