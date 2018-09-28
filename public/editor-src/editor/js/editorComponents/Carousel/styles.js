import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      "& > .slick-slider > .brz-slick-slider__dots": {
        color: "var(--colorDots)"
      },
      "& > .slick-slider > .brz-slick-slider__arrow": {
        color: "var(--colorArrows)"
      },

      ".brz-ed--desktop &": {
        "& > .slick-slider": {
          paddingLeft: "var(--paddingLeft)",
          paddingRight: "var(--paddingRight)"
        },
        "& > .slick-slider > .slick-list": {
          marginLeft: "var(--sliderMargin)",
          marginRight: "var(--sliderMargin)",
          paddingTop: "var(--paddingTop)",
          paddingBottom: "var(--paddingBottom)"
        },
        "& > .slick-slider > .slick-list > .slick-track > .slick-slide": {
          paddingLeft: "var(--spacing)",
          paddingRight: "var(--spacing)"
        },
        "& > .slick-slider > .brz-slick-slider__arrow-prev": {
          left: "var(--arrowsSpacing)"
        },
        "& > .slick-slider > .brz-slick-slider__arrow-next": {
          right: "var(--arrowsSpacing)"
        }
      },
      ".brz-ed--mobile &": {
        "& > .slick-slider": {
          paddingLeft: "var(--mobilePaddingLeft)",
          paddingRight: "var(--mobilePaddingRight)"
        },
        "& > .slick-slider > .slick-list": {
          paddingTop: "var(--mobilePaddingTop)",
          paddingBottom: "var(--mobilePaddingBottom)"
        },
        "& > .slick-slider > .brz-slick-slider__arrow-prev": {
          left: "var(--mobileArrowsSpacing)"
        },
        "& > .slick-slider > .brz-slick-slider__arrow-next": {
          right: "var(--mobileArrowsSpacing)"
        }
      }
    };
  } else {
    const {
      spacing,
      slidesToShow,
      sliderArrowsSpacing,
      sliderArrowsColorHex,
      sliderArrowsColorOpacity,
      sliderDotsColorHex,
      sliderDotsColorOpacity,
      sliderPaddingType,
      sliderPadding,
      sliderPaddingSuffix,
      sliderPaddingTop,
      sliderPaddingTopSuffix,
      sliderPaddingRight,
      sliderPaddingRightSuffix,
      sliderPaddingBottom,
      sliderPaddingBottomSuffix,
      sliderPaddingLeft,
      sliderPaddingLeftSuffix,
      mobileSliderArrowsSpacing,
      mobileSliderPaddingType,
      mobileSliderPadding,
      mobileSliderPaddingSuffix,
      mobileSliderPaddingTop,
      mobileSliderPaddingTopSuffix,
      mobileSliderPaddingRight,
      mobileSliderPaddingRightSuffix,
      mobileSliderPaddingBottom,
      mobileSliderPaddingBottomSuffix,
      mobileSliderPaddingLeft,
      mobileSliderPaddingLeftSuffix
    } = v;

    glamorObj = {
      // Hide slideItems before slick-slide initialized
      [`& > [data-slides-to-show="${slidesToShow}"]:not(.slick-initialized)`]: {
        "& .brz-carousel__item": {
          flexBasis: `${100 / slidesToShow}%`
        },
        [`& .brz-carousel__item:nth-child(1n+${slidesToShow + 1})`]: {
          display: "none"
        }
      },
      "& > .slick-slider": {
        paddingLeft:
          sliderPaddingType === "grouped"
            ? sliderPadding + sliderPaddingSuffix
            : sliderPaddingLeft + sliderPaddingLeftSuffix,
        paddingRight:
          sliderPaddingType === "grouped"
            ? sliderPadding + sliderPaddingSuffix
            : sliderPaddingRight + sliderPaddingRightSuffix
      },
      "& > .slick-slider > .slick-list": {
        marginLeft: `-${spacing / 2}px`,
        marginRight: `-${spacing / 2}px`,
        paddingTop:
          sliderPaddingType === "grouped"
            ? sliderPadding + sliderPaddingSuffix
            : sliderPaddingTop + sliderPaddingTopSuffix,
        paddingBottom:
          sliderPaddingType === "grouped"
            ? sliderPadding + sliderPaddingSuffix
            : sliderPaddingBottom + sliderPaddingBottomSuffix
      },
      "& > .slick-slider > .slick-list > .slick-track > .slick-slide": {
        paddingLeft: `${spacing / 2}px`,
        paddingRight: `${spacing / 2}px`
      },
      "& > .slick-slider > .brz-slick-slider__dots": {
        color: hexToRgba(sliderDotsColorHex, sliderDotsColorOpacity)
      },
      "& > .slick-slider > .brz-slick-slider__arrow": {
        color: hexToRgba(sliderArrowsColorHex, sliderArrowsColorOpacity)
      },
      "& > .slick-slider > .brz-slick-slider__arrow-prev": {
        left: `${sliderArrowsSpacing}px`
      },
      "& > .slick-slider > .brz-slick-slider__arrow-next": {
        right: `${sliderArrowsSpacing}px`
      },

      "@media (max-width: 767px)": {
        "& > .slick-slider": {
          paddingLeft:
            mobileSliderPaddingType === "grouped"
              ? mobileSliderPadding + mobileSliderPaddingSuffix
              : mobileSliderPaddingLeft + mobileSliderPaddingLeftSuffix,
          paddingRight:
            mobileSliderPaddingType === "grouped"
              ? mobileSliderPadding + mobileSliderPaddingSuffix
              : mobileSliderPaddingRight + mobileSliderPaddingRightSuffix
        },
        "& > .slick-slider > .slick-list": {
          marginLeft: "auto",
          marginRight: "auto",
          paddingTop:
            mobileSliderPaddingType === "grouped"
              ? mobileSliderPadding + mobileSliderPaddingSuffix
              : mobileSliderPaddingTop + mobileSliderPaddingTopSuffix,
          paddingBottom:
            mobileSliderPaddingType === "grouped"
              ? mobileSliderPadding + mobileSliderPaddingSuffix
              : mobileSliderPaddingBottom + mobileSliderPaddingBottomSuffix
        },
        "& > .slick-slider > .slick-list > .slick-track > .slick-slide": {
          paddingLeft: 0,
          paddingRight: 0
        },
        "& > .slick-slider > .brz-slick-slider__arrow-prev": {
          left:
            mobileSliderArrowsSpacing === null
              ? `${sliderArrowsSpacing}px`
              : `${mobileSliderArrowsSpacing}px`
        },
        "& > .slick-slider > .brz-slick-slider__arrow-next": {
          right:
            mobileSliderArrowsSpacing === null
              ? `${sliderArrowsSpacing}px`
              : `${mobileSliderArrowsSpacing}px`
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-carousel", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    spacing,
    sliderArrowsSpacing,
    sliderArrowsColorHex,
    sliderArrowsColorOpacity,
    sliderDotsColorHex,
    sliderDotsColorOpacity,
    sliderPaddingType,
    sliderPadding,
    sliderPaddingSuffix,
    sliderPaddingTop,
    sliderPaddingTopSuffix,
    sliderPaddingRight,
    sliderPaddingRightSuffix,
    sliderPaddingBottom,
    sliderPaddingBottomSuffix,
    sliderPaddingLeft,
    sliderPaddingLeftSuffix,
    mobileSliderArrowsSpacing,
    mobileSliderPaddingType,
    mobileSliderPadding,
    mobileSliderPaddingSuffix,
    mobileSliderPaddingTop,
    mobileSliderPaddingTopSuffix,
    mobileSliderPaddingRight,
    mobileSliderPaddingRightSuffix,
    mobileSliderPaddingBottom,
    mobileSliderPaddingBottomSuffix,
    mobileSliderPaddingLeft,
    mobileSliderPaddingLeftSuffix
  } = v;

  return {
    "--spacing": `${spacing / 2}px`,
    "--sliderMargin": `-${spacing / 2}px`,
    "--arrowsSpacing": `${sliderArrowsSpacing}px`,
    "--colorArrows": hexToRgba(sliderArrowsColorHex, sliderArrowsColorOpacity),
    "--colorDots": hexToRgba(sliderDotsColorHex, sliderDotsColorOpacity),
    "--paddingTop":
      sliderPaddingType === "grouped"
        ? sliderPadding + sliderPaddingSuffix
        : sliderPaddingTop + sliderPaddingTopSuffix,
    "--paddingRight":
      sliderPaddingType === "grouped"
        ? sliderPadding + sliderPaddingSuffix
        : sliderPaddingRight + sliderPaddingRightSuffix,
    "--paddingBottom":
      sliderPaddingType === "grouped"
        ? sliderPadding + sliderPaddingSuffix
        : sliderPaddingBottom + sliderPaddingBottomSuffix,
    "--paddingLeft":
      sliderPaddingType === "grouped"
        ? sliderPadding + sliderPaddingSuffix
        : sliderPaddingLeft + sliderPaddingLeftSuffix,
    "--mobileArrowsSpacing":
      mobileSliderArrowsSpacing === null
        ? `${sliderArrowsSpacing}px`
        : `${mobileSliderArrowsSpacing}px`,
    "--mobilePaddingTop":
      mobileSliderPaddingType === "grouped"
        ? mobileSliderPadding + mobileSliderPaddingSuffix
        : mobileSliderPaddingTop + mobileSliderPaddingTopSuffix,
    "--mobilePaddingRight":
      mobileSliderPaddingType === "grouped"
        ? mobileSliderPadding + mobileSliderPaddingSuffix
        : mobileSliderPaddingRight + mobileSliderPaddingRightSuffix,
    "--mobilePaddingBottom":
      mobileSliderPaddingType === "grouped"
        ? mobileSliderPadding + mobileSliderPaddingSuffix
        : mobileSliderPaddingBottom + mobileSliderPaddingBottomSuffix,
    "--mobilePaddingLeft":
      mobileSliderPaddingType === "grouped"
        ? mobileSliderPadding + mobileSliderPaddingSuffix
        : mobileSliderPaddingLeft + mobileSliderPaddingLeftSuffix
  };
}
