import classnames from "classnames";
import { css } from "glamor";
import { imageUrl, imagePopulationUrl } from "visual/utils/image";
import { hexToRgba } from "visual/utils/color";

export function sectionStyleClassName(v) {
  const { showOnDesktop, showOnMobile, className, customClassName } = v;

  let glamorObj;
  if (IS_EDITOR) {
    const blured = {
      filter: "blur(3px)",
      opacity: 0.9
    };

    glamorObj = {
      ".brz-ed--desktop &": {
        ...(showOnDesktop === "on" ? null : blured)
      },
      ".brz-ed--mobile &": {
        ...(showOnMobile === "on" ? null : blured)
      }
    };
  } else {
    glamorObj = {
      display: showOnDesktop === "on" ? "block" : "none",

      "@media (max-width: 767px)": {
        display: showOnMobile === "on" ? "block" : "none"
      }
    };
  }

  const glamorClassName = String(css(glamorObj));
  return classnames("brz-footer", glamorClassName, className, customClassName);
}

export function bgStyleClassName(v) {
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
          backgroundPositionY: "var(--backgroundPositionY)"
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--backgroundColor)"
        }
      },
      ".brz-ed--mobile &": {
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
      bgImageSrc,
      bgPositionX,
      bgPositionY,
      bgColorHex,
      bgColorOpacity,
      bgPopulation,
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
      mobileBgImageSrc,
      mobileBgPositionX,
      mobileBgPositionY,
      mobileBgColorHex,
      mobileBgColorOpacity
    } = v;
    const bgImage = bgPopulation
      ? imagePopulationUrl(bgPopulation)
      : imageUrl(bgImageSrc);

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
          bgImageSrc || bgPopulation ? `url(${bgImage})` : "none",
        backgroundPosition: bgPopulation
          ? "0% 0%"
          : `${bgPositionX}% ${bgPositionY}%`
      },
      "> .brz-bg-media > .brz-bg-color": {
        backgroundColor: hexToRgba(bgColorHex, bgColorOpacity)
      },
      "@media (max-width: 767px)": {
        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage:
            mobileBgImageSrc || bgPopulation ? `url(${bgImage})` : "none",
          backgroundPosition: bgPopulation
            ? "0% 0%"
            : `${mobileBgPositionX}% ${mobileBgPositionY}%`
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: hexToRgba(mobileBgColorHex, mobileBgColorOpacity)
        }
      }
    };
  }
  const glamorClassName = String(css(glamorObj));

  return classnames(glamorClassName);
}

export function bgStyleCSSVars(v) {
  if (IS_PREVIEW) return null;

  const {
    bgImageSrc,
    bgPositionX,
    bgPositionY,
    bgColorHex,
    bgColorOpacity,
    bgPopulation,
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
    mobileBgImageSrc,
    mobileBgPositionX,
    mobileBgPositionY,
    mobileBgColorHex,
    mobileBgColorOpacity
  } = v;

  return {
    "--backgroundImage":
      bgImageSrc && !bgPopulation ? `url(${imageUrl(bgImageSrc)})` : "none",
    "--backgroundPositionX": bgPopulation ? "0%" : `${bgPositionX}%`,
    "--backgroundPositionY": bgPopulation ? "0%" : `${bgPositionY}%`,
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
    "--mobileBackgroundImage":
      mobileBgImageSrc && !bgPopulation
        ? `url(${imageUrl(mobileBgImageSrc)})`
        : "none",
    "--mobileBackgroundPositionX": bgPopulation
      ? "0%"
      : `${mobileBgPositionX}%`,
    "--mobileBackgroundPositionY": bgPopulation
      ? "0%"
      : `${mobileBgPositionY}%`,
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
      maxWidth: "var(--containerWidth)",
      height: "100%"
    };
  } else {
    const {
      containerType,
      paddingType,
      padding,
      paddingTop,
      paddingBottom,
      mobilePaddingType,
      mobilePadding,
      mobilePaddingTop,
      mobilePaddingBottom
    } = v;

    glamorObj = {
      maxWidth: containerType === "fullWidth" ? "100%" : "1170px",
      paddingTop:
        paddingType === "grouped" ? `${padding}px` : `${paddingTop}px`,
      paddingBottom:
        paddingType === "grouped" ? `${padding}px` : `${paddingBottom}px`,

      "@media (max-width: 767px)": {
        paddingTop:
          mobilePaddingType === "grouped"
            ? `${mobilePadding}px`
            : `${mobilePaddingTop}px`,
        paddingBottom:
          mobilePaddingType === "grouped"
            ? `${mobilePadding}px`
            : `${mobilePaddingBottom}px`
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
