import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

const aligns = {
  left: "flex-start",
  center: "center",
  right: "flex-end"
};

export function styleClassName(v, props) {
  const { customClassName, showOnDesktop, showOnMobile } = v;
  const { className: propsClassName } = props;
  let glamorObj;

  if (IS_PREVIEW) {
    glamorObj = {
      ".brz &": {
        display: showOnDesktop === "on" ? "block" : "none"
      },

      "@media (max-width: 767px)": {
        ".brz &": {
          display: showOnMobile === "on" ? "block" : "none"
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
    const { showOnDesktop, showOnMobile } = v;
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
      marginTop: "var(--itemMarginTop)",
      marginRight: "var(--itemMarginRight)",
      marginBottom: "var(--itemMarginBottom)",
      marginLeft: "var(--itemMarginLeft)",

      ".brz-ed--desktop &": {
        justifyContent: "var(--horizontalAlign)",
        paddingTop: "var(--paddingTop)",
        paddingRight: "var(--paddingRight)",
        paddingBottom: "var(--paddingBottom)",
        paddingLeft: "var(--paddingLeft)"
      },
      ".brz-ed--mobile &": {
        justifyContent: "var(--mobileHorizontalAlign)",
        paddingTop: "var(--mobilePaddingTop)",
        paddingRight: "var(--mobilePaddingRight)",
        paddingBottom: "var(--mobilePaddingBottom)",
        paddingLeft: "var(--mobilePaddingLeft)"
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
      itemPaddingTop,
      itemPaddingRight,
      itemPaddingBottom,
      itemPaddingLeft,
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
      marginTop: `${-itemPaddingTop}px`,
      marginRight: `${parseFloat(-itemPaddingRight / 2)}px`,
      marginBottom: `${-itemPaddingBottom}px`,
      marginLeft: `${parseFloat(-itemPaddingLeft / 2)}px`,

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
            : mobilePaddingLeft + mobilePaddingLeftSuffix
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
    itemPaddingTop,
    itemPaddingRight,
    itemPaddingBottom,
    itemPaddingLeft,
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
    "--itemMarginTop": `${-itemPaddingTop}px`,
    "--itemMarginRight": `${parseFloat(-itemPaddingRight / 2)}px`,
    "--itemMarginBottom": `${-itemPaddingBottom}px`,
    "--itemMarginLeft": `${parseFloat(-itemPaddingLeft / 2)}px`,
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

export function itemsStyleClassName(v) {
  const { itemClassName } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      paddingTop: "var(--itemPaddingTop)",
      paddingRight: "var(--itemPaddingRight)",
      paddingBottom: "var(--itemPaddingBottom)",
      paddingLeft: "var(--itemPaddingLeft)"
    };
  } else {
    const {
      itemPaddingTop,
      itemPaddingRight,
      itemPaddingBottom,
      itemPaddingLeft
    } = v;

    glamorObj = {
      paddingTop: `${itemPaddingTop}px`,
      paddingRight: `${parseFloat(itemPaddingRight / 2)}px`,
      paddingBottom: `${itemPaddingBottom}px`,
      paddingLeft: `${parseFloat(itemPaddingLeft / 2)}px`
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-wrapper-clone__item", glamorClassName, itemClassName);
}

export function itemsStyleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    itemPaddingTop,
    itemPaddingRight,
    itemPaddingBottom,
    itemPaddingLeft
  } = v;

  return {
    "--itemPaddingTop": `${itemPaddingTop}px`,
    "--itemPaddingRight": `${parseFloat(itemPaddingRight / 2)}px`,
    "--itemPaddingBottom": `${itemPaddingBottom}px`,
    "--itemPaddingLeft": `${parseFloat(itemPaddingLeft / 2)}px`
  };
}
