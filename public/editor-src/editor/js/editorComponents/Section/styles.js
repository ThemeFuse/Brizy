import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";

export function sectionStyleClassName(v) {
  const {
    showOnDesktop,
    showOnTablet,
    showOnMobile,
    className,
    customClassName,
    slider
  } = v;
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
      ".brz-ed--tablet & .brz-container__wrap": {
        ...(showOnTablet === "on" ? null : blurred)
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

      // Tablet
      "@media (max-width: 991px) and (min-width: 768px)": {
        ".brz &": {
          display: showOnTablet === "on" ? "block" : "none"
        }
      },

      // Mobile
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
