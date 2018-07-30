import classnames from "classnames";
import { css } from "glamor";
import { imageUrl } from "visual/utils/image";
import { hexToRgba } from "visual/utils/color";

const backgroundAttachment = {
  none: "scroll",
  fixed: "fixed",
  animated: "scroll"
};

export function sectionStyleClassName(v) {
  const { showOnDesktop, showOnMobile, className, customClassName, slider } = v;
  const sliderFullHeight = slider === "on" ? "height" : "minHeight";

  let glamorObj;
  if (IS_EDITOR) {
    const blurred = {
      filter: "blur(3px)",
      opacity: 0.9
    };

    glamorObj = {
      zIndex: "var(--zIndex)",
      ".brz & .brz-section__content": {
        [`${sliderFullHeight}`]: "var(--fullHeight100vh)"
      },
      ".brz & .brz-slick-slider__dots": {
        color: "var(--colorDots)"
      },
      ".brz & .brz-slick-slider__arrow": {
        color: "var(--colorArrows)"
      },
      ".brz-ed--desktop & .brz-container__wrap": {
        ...(showOnDesktop === "on" ? null : blurred)
      },
      ".brz-ed--mobile & .brz-container__wrap": {
        ...(showOnMobile === "on" ? null : blurred)
      }
    };
  } else {
    const {
      fullHeight,
      sliderDotsColorHex,
      sliderDotsColorOpacity,
      sliderArrowsColorHex,
      sliderArrowsColorOpacity,
      zIndex
    } = v;

    glamorObj = {
      zIndex: zIndex === 0 ? "auto" : zIndex,

      ".brz &": {
        display: showOnDesktop === "on" ? "block" : "none"
      },
      ".brz & .brz-section__content": {
        [`${sliderFullHeight}`]: fullHeight === "on" ? "100vh" : "100%"
      },
      ".brz & .brz-slick-slider__dots": {
        color: hexToRgba(sliderDotsColorHex, sliderDotsColorOpacity)
      },
      ".brz & .brz-slick-slider__arrow": {
        color: hexToRgba(sliderArrowsColorHex, sliderArrowsColorOpacity)
      },

      "@media (max-width: 767px)": {
        ".brz &": {
          display: showOnMobile === "on" ? "block" : "none"
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));
  return classnames("brz-section", glamorClassName, className, customClassName);
}

export function sectionStyleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    fullHeight,
    sliderDotsColorHex,
    sliderDotsColorOpacity,
    sliderArrowsColorHex,
    sliderArrowsColorOpacity,
    zIndex
  } = v;

  return {
    "--fullHeight100vh": fullHeight === "on" ? "100vh" : "100%",
    "--colorDots": hexToRgba(sliderDotsColorHex, sliderDotsColorOpacity),
    "--colorArrows": hexToRgba(sliderArrowsColorHex, sliderArrowsColorOpacity),
    "--zIndex": zIndex === 0 ? "auto" : zIndex
  };
}

export function bgStyleClassName(v, props) {
  let glamorObj;
  if (IS_EDITOR) {
    glamorObj = {
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
        borderBottomRightRadius: "var(--borderBottomRightRadius)"
      },
      ".brz-ed--desktop &": {
        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--backgroundImage)",
          backgroundPositionX: "var(--backgroundPositionX)",
          backgroundPositionY: "var(--backgroundPositionY)",
          backgroundAttachment: "var(--backgroundAttachment)"
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--backgroundColor)"
        },
        "> .brz-bg-media > .brz-bg-map": {
          display: "var(--mediaBg)"
        }
      },
      ".brz-ed--mobile &": {
        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--mobileBackgroundImage)",
          backgroundPositionX: "var(--mobileBackgroundPositionX)",
          backgroundPositionY: "var(--mobileBackgroundPositionY)",
          backgroundAttachment: "var(--mobileBackgroundAttachment)"
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
      media,
      bgImageSrc,
      bgPositionX,
      bgPositionY,
      bgAttachment,
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
      mobileMedia,
      mobileBgImageSrc,
      mobileBgPositionX,
      mobileBgPositionY,
      mobileBgAttachment,
      mobileBgColorHex,
      mobileBgColorOpacity
    } = v;
    const { showSlider } = props.meta;

    glamorObj = {
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
            : `${borderBottomRightRadius}px`
      },
      "> .brz-bg-media > .brz-bg-image": {
        backgroundImage:
          media === "image" && bgImageSrc
            ? `url(${imageUrl(bgImageSrc)})`
            : "none",
        backgroundPosition: `${bgPositionX}% ${bgPositionY}%`,
        backgroundAttachment:
          backgroundAttachment[showSlider ? "none" : bgAttachment]
      },
      "> .brz-bg-media > .brz-bg-color": {
        backgroundColor: hexToRgba(bgColorHex, bgColorOpacity)
      },
      "> .brz-bg-media > .brz-bg-map": {
        display: media === "map" ? "block" : "none"
      },
      "@media (max-width: 767px)": {
        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage:
            mobileBgImageSrc && mobileMedia !== "map"
              ? `url(${imageUrl(mobileBgImageSrc)})`
              : "none",
          backgroundPosition: `${mobileBgPositionX}% ${mobileBgPositionY}%`,
          backgroundAttachment:
            backgroundAttachment[showSlider ? "none" : mobileBgAttachment]
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: hexToRgba(mobileBgColorHex, mobileBgColorOpacity)
        },
        "> .brz-bg-media > .brz-bg-map": {
          display: mobileMedia === "map" ? "block" : "none"
        }
      }
    };
  }
  const glamorClassName = String(css(glamorObj));

  return classnames(glamorClassName);
}

export function bgStyleCSSVars(v, props) {
  if (IS_PREVIEW) return null;

  const {
    media,
    bgImageSrc,
    bgAttachment,
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
    mobileMedia,
    mobileBgImageSrc,
    mobileBgAttachment,
    mobileBgPositionX,
    mobileBgPositionY,
    mobileBgColorHex,
    mobileBgColorOpacity
  } = v;
  const { showSlider } = props.meta;

  return {
    "--mediaBg": media === "map" ? "block" : "none",
    "--backgroundImage":
      media === "image" && bgImageSrc ? `url(${imageUrl(bgImageSrc)})` : "none",
    "--backgroundPositionX": `${bgPositionX}%`,
    "--backgroundPositionY": `${bgPositionY}%`,
    "--backgroundAttachment":
      backgroundAttachment[showSlider ? "none" : bgAttachment],
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
    "--mobileMediaBg": mobileMedia === "map" ? "block" : "none",
    "--mobileBackgroundImage":
      mobileBgImageSrc && mobileMedia !== "map"
        ? `url(${imageUrl(mobileBgImageSrc)})`
        : "none",
    "--mobileBackgroundPositionX": `${mobileBgPositionX}%`,
    "--mobileBackgroundPositionY": `${mobileBgPositionY}%`,
    "--mobileBackgroundAttachment":
      backgroundAttachment[showSlider ? "none" : mobileBgAttachment],
    "--mobileBackgroundColor": hexToRgba(mobileBgColorHex, mobileBgColorOpacity)
  };
}

export function itemsStyleClassName(v) {
  const { containerClassName } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        maxWidth: "var(--maxWidth)"
      },
      borderTopWidth: "var(--borderTopWidth)",
      borderRightWidth: "var(--borderRightWidth)",
      borderBottomWidth: "var(--borderBottomWidth)",
      borderLeftWidth: "var(--borderLeftWidth)",
      borderColor: "transparent",
      borderStyle: "solid"
    };
  } else {
    const {
      containerSize,
      containerType,
      borderWidthType,
      borderWidth,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth
    } = v;
    glamorObj = {
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

      "@media (min-width: 768px)": {
        maxWidth: containerType === "boxed" ? `${containerSize}%` : `100%`
      }
    };
  }
  const glamorClassName = String(css(glamorObj));

  return classnames("brz-container", glamorClassName, containerClassName);
}

export function itemsStyleCSSVars(v) {
  if (IS_PREVIEW) return null;

  const {
    containerSize,
    containerType,
    borderWidthType,
    borderWidth,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth
  } = v;

  return {
    "--maxWidth": containerType === "boxed" ? `${containerSize}%` : `100%`,
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
        : `${borderLeftWidth}px`
  };
}

export function containerStyleClassName(v) {
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      maxWidth: "var(--containerWidth)"
    };
  } else {
    const {
      containerType,
      paddingType,
      padding,
      paddingSuffix,
      paddingTop,
      paddingTopSuffix,
      paddingBottom,
      paddingBottomSuffix,
      mobilePaddingType,
      mobilePadding,
      mobilePaddingSuffix,
      mobilePaddingTop,
      mobilePaddingTopSuffix,
      mobilePaddingBottom,
      mobilePaddingBottomSuffix
    } = v;

    glamorObj = {
      maxWidth: containerType === "fullWidth" ? "100%" : "1170px",
      paddingTop:
        paddingType === "grouped"
          ? padding + paddingSuffix
          : paddingTop + paddingTopSuffix,
      paddingBottom:
        paddingType === "grouped"
          ? padding + paddingSuffix
          : paddingBottom + paddingBottomSuffix,

      "@media (max-width: 767px)": {
        paddingTop:
          mobilePaddingType === "grouped"
            ? mobilePadding + mobilePaddingSuffix
            : mobilePaddingTop + mobilePaddingTopSuffix,
        paddingBottom:
          mobilePaddingType === "grouped"
            ? mobilePadding + mobilePaddingSuffix
            : mobilePaddingBottom + mobilePaddingBottomSuffix
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-container__wrap", glamorClassName);
}

export function containerStyleCSSVars(v) {
  if (IS_PREVIEW) return null;

  const { containerType } = v;

  return {
    "--containerWidth": containerType === "fullWidth" ? "100%" : "1170px"
  };
}

// Content
export function contentStyleClassName(v) {
  return classnames("brz-section__content", v.className);
}
