import classnames from "classnames";
import { css } from "glamor";
import { styleColor } from "visual/utils/style";

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

      ".brz & .brz-slick-slider__dots:hover": {
        color: "var(--hoverColorDots)"
      },
      ".brz & .brz-slick-slider__arrow:hover": {
        color: "var(--hoverColorArrows)"
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
    const { fullHeight, zIndex } = v;

    glamorObj = {
      zIndex: zIndex === 0 ? "auto" : zIndex,

      ".brz &": {
        display: showOnDesktop === "on" ? "block" : "none"
      },
      ".brz & .brz-section__content": {
        [`${sliderFullHeight}`]: fullHeight === "on" ? "100vh" : "100%"
      },
      ".brz & .brz-slick-slider__dots": {
        color: styleColor({
          v,
          device: "desktop",
          state: "normal",
          prefix: "sliderDotsColor"
        })
      },

      ".brz & .brz-slick-slider__arrow": {
        color: styleColor({
          v,
          device: "desktop",
          state: "normal",
          prefix: "sliderArrowsColor"
        })
      },

      ".brz & .brz-slick-slider__dots:hover": {
        color: styleColor({
          v,
          device: "desktop",
          state: "hover",
          prefix: "sliderDotsColor"
        })
      },

      ".brz & .brz-slick-slider__arrow:hover": {
        color: styleColor({
          v,
          device: "desktop",
          state: "hover",
          prefix: "sliderArrowsColor"
        })
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

  const { fullHeight, zIndex } = v;

  return {
    "--fullHeight100vh": fullHeight === "on" ? "100vh" : "100%",
    "--colorDots": styleColor({
      v,
      device: "desktop",
      state: "normal",
      prefix: "sliderDotsColor"
    }),

    "--hoverColorDots": styleColor({
      v,
      device: "desktop",
      state: "hover",
      prefix: "sliderDotsColor"
    }),

    "--colorArrows": styleColor({
      v,
      device: "desktop",
      state: "normal",
      prefix: "sliderArrowsColor"
    }),

    "--hoverColorArrows": styleColor({
      v,
      device: "desktop",
      state: "hover",
      prefix: "sliderArrowsColor"
    }),
    "--zIndex": zIndex === 0 ? "auto" : zIndex
  };
}
