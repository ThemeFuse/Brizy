import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import { styleColor } from "visual/utils/style";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      "& > .brz-carousel__slider > .brz-slick-slider__dots": {
        color: "var(--colorDots)"
      },
      "& > .brz-carousel__slider > .brz-slick-slider__arrow": {
        color: "var(--colorArrows)"
      },

      ".brz-ed--desktop &": {
        "& > .brz-carousel__slider": {
          paddingLeft: "var(--paddingLeft)",
          paddingRight: "var(--paddingRight)"
        },
        "& > .brz-carousel__slider > .slick-list": {
          marginLeft: "var(--sliderMargin)",
          marginRight: "var(--sliderMargin)",
          paddingTop: "var(--paddingTop)",
          paddingBottom: "var(--paddingBottom)"
        },
        "& > .brz-carousel__slider > .slick-list > .slick-track > .slick-slide": {
          paddingLeft: "var(--spacing)",
          paddingRight: "var(--spacing)"
        },
        "& > .brz-carousel__slider > .brz-slick-slider__arrow-prev": {
          left: "var(--arrowsSpacing)"
        },
        "& > .brz-carousel__slider > .brz-slick-slider__arrow-next": {
          right: "var(--arrowsSpacing)"
        }
      },
      ".brz-ed--tablet &": {
        "& > .brz-carousel__slider": {
          paddingLeft: "var(--tabletPaddingLeft)",
          paddingRight: "var(--tabletPaddingRight)"
        },
        "& > .brz-carousel__slider > .slick-list": {
          paddingTop: "var(--tabletPaddingTop)",
          paddingBottom: "var(--tabletPaddingBottom)"
        },
        "& > .brz-carousel__slider > .brz-slick-slider__arrow-prev": {
          left: "var(--tabletArrowsSpacing)"
        },
        "& > .brz-carousel__slider > .brz-slick-slider__arrow-next": {
          right: "var(--tabletArrowsSpacing)"
        }
      },
      ".brz-ed--mobile &": {
        "& > .brz-carousel__slider": {
          paddingLeft: "var(--mobilePaddingLeft)",
          paddingRight: "var(--mobilePaddingRight)"
        },
        "& > .brz-carousel__slider > .slick-list": {
          paddingTop: "var(--mobilePaddingTop)",
          paddingBottom: "var(--mobilePaddingBottom)"
        },
        "& > .brz-carousel__slider > .brz-slick-slider__arrow-prev": {
          left: "var(--mobileArrowsSpacing)"
        },
        "& > .brz-carousel__slider > .brz-slick-slider__arrow-next": {
          right: "var(--mobileArrowsSpacing)"
        }
      }
    };
  } else {
    const {
      spacing,
      slidesToShow,
      sliderArrowsSpacing,
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
      tabletSliderPaddingType,
      tabletSliderPadding,
      tabletSliderPaddingSuffix,
      tabletSliderPaddingTop,
      tabletSliderPaddingTopSuffix,
      tabletSliderPaddingRight,
      tabletSliderPaddingRightSuffix,
      tabletSliderPaddingBottom,
      tabletSliderPaddingBottomSuffix,
      tabletSliderPaddingLeft,
      tabletSliderPaddingLeftSuffix,
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

    const tabletSliderArrowsSpacing = tabletSyncOnChange(
      v,
      "sliderArrowsSpacing"
    );
    const mobileSliderArrowsSpacing = mobileSyncOnChange(
      v,
      "sliderArrowsSpacing"
    );

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
      "& > .brz-carousel__slider": {
        paddingLeft:
          sliderPaddingType === "grouped"
            ? sliderPadding + sliderPaddingSuffix
            : sliderPaddingLeft + sliderPaddingLeftSuffix,
        paddingRight:
          sliderPaddingType === "grouped"
            ? sliderPadding + sliderPaddingSuffix
            : sliderPaddingRight + sliderPaddingRightSuffix
      },
      "& > .brz-carousel__slider > .slick-list": {
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
      "& > .brz-carousel__slider > .slick-list > .slick-track > .slick-slide": {
        paddingLeft: `${spacing / 2}px`,
        paddingRight: `${spacing / 2}px`
      },
      "& > .brz-carousel__slider > .brz-slick-slider__dots": {
        color: styleColor({
          v,
          device: "desktop",
          state: "normal",
          prefix: "sliderDotsColor"
        })
      },
      "& > .brz-carousel__slider > .brz-slick-slider__arrow": {
        color: styleColor({
          v,
          device: "desktop",
          state: "normal",
          prefix: "sliderArrowsColor"
        })
      },
      "& > .brz-carousel__slider > .brz-slick-slider__arrow-prev": {
        left: `${sliderArrowsSpacing}px`
      },
      "& > .brz-carousel__slider > .brz-slick-slider__arrow-next": {
        right: `${sliderArrowsSpacing}px`
      },
      "@media (max-width: 991px)": {
        "& > .brz-carousel__slider": {
          paddingLeft:
            tabletSliderPaddingType === "grouped"
              ? tabletSliderPadding + tabletSliderPaddingSuffix
              : tabletSliderPaddingLeft + tabletSliderPaddingLeftSuffix,
          paddingRight:
            tabletSliderPaddingType === "grouped"
              ? tabletSliderPadding + tabletSliderPaddingSuffix
              : tabletSliderPaddingRight + tabletSliderPaddingRightSuffix
        },
        "& > .brz-carousel__slider > .slick-list": {
          marginLeft: "auto",
          marginRight: "auto",
          paddingTop:
            tabletSliderPaddingType === "grouped"
              ? tabletSliderPadding + tabletSliderPaddingSuffix
              : tabletSliderPaddingTop + tabletSliderPaddingTopSuffix,
          paddingBottom:
            tabletSliderPaddingType === "grouped"
              ? tabletSliderPadding + tabletSliderPaddingSuffix
              : tabletSliderPaddingBottom + tabletSliderPaddingBottomSuffix
        },
        "& > .brz-carousel__slider > .slick-list > .slick-track > .slick-slide": {
          paddingLeft: 0,
          paddingRight: 0
        },
        "& > .brz-carousel__slider > .brz-slick-slider__arrow-prev": {
          left: `${tabletSliderArrowsSpacing}px`
        },
        "& > .brz-carousel__slider > .brz-slick-slider__arrow-next": {
          right: `${tabletSliderArrowsSpacing}px`
        }
      },
      "@media (max-width: 767px)": {
        "& > .brz-carousel__slider": {
          paddingLeft:
            mobileSliderPaddingType === "grouped"
              ? mobileSliderPadding + mobileSliderPaddingSuffix
              : mobileSliderPaddingLeft + mobileSliderPaddingLeftSuffix,
          paddingRight:
            mobileSliderPaddingType === "grouped"
              ? mobileSliderPadding + mobileSliderPaddingSuffix
              : mobileSliderPaddingRight + mobileSliderPaddingRightSuffix
        },
        "& > .brz-carousel__slider > .slick-list": {
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
        "& > .brz-carousel__slider > .slick-list > .slick-track > .slick-slide": {
          paddingLeft: 0,
          paddingRight: 0
        },
        "& > .brz-carousel__slider > .brz-slick-slider__arrow-prev": {
          left: `${mobileSliderArrowsSpacing}px`
        },
        "& > .brz-carousel__slider > .brz-slick-slider__arrow-next": {
          right: `${mobileSliderArrowsSpacing}px`
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
    tabletSliderPaddingType,
    tabletSliderPadding,
    tabletSliderPaddingSuffix,
    tabletSliderPaddingTop,
    tabletSliderPaddingTopSuffix,
    tabletSliderPaddingRight,
    tabletSliderPaddingRightSuffix,
    tabletSliderPaddingBottom,
    tabletSliderPaddingBottomSuffix,
    tabletSliderPaddingLeft,
    tabletSliderPaddingLeftSuffix,
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

  const tabletSliderArrowsSpacing = tabletSyncOnChange(
    v,
    "sliderArrowsSpacing"
  );
  const mobileSliderArrowsSpacing = mobileSyncOnChange(
    v,
    "sliderArrowsSpacing"
  );

  return {
    "--spacing": `${spacing / 2}px`,
    "--sliderMargin": `-${spacing / 2}px`,
    "--arrowsSpacing": `${sliderArrowsSpacing}px`,
    "--colorArrows": styleColor({
      v,
      device: "desktop",
      state: "normal",
      prefix: "sliderArrowsColor"
    }),
    "--colorDots": styleColor({
      v,
      device: "desktop",
      state: "normal",
      prefix: "sliderDotsColor"
    }),
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
    "--tabletArrowsSpacing": `${tabletSliderArrowsSpacing}px`,
    "--tabletPaddingTop":
      tabletSliderPaddingType === "grouped"
        ? tabletSliderPadding + tabletSliderPaddingSuffix
        : tabletSliderPaddingTop + tabletSliderPaddingTopSuffix,
    "--tabletPaddingRight":
      tabletSliderPaddingType === "grouped"
        ? tabletSliderPadding + tabletSliderPaddingSuffix
        : tabletSliderPaddingRight + tabletSliderPaddingRightSuffix,
    "--tabletPaddingBottom":
      tabletSliderPaddingType === "grouped"
        ? tabletSliderPadding + tabletSliderPaddingSuffix
        : tabletSliderPaddingBottom + tabletSliderPaddingBottomSuffix,
    "--tabletPaddingLeft":
      tabletSliderPaddingType === "grouped"
        ? tabletSliderPadding + tabletSliderPaddingSuffix
        : tabletSliderPaddingLeft + tabletSliderPaddingLeftSuffix,
    "--mobileArrowsSpacing": `${mobileSliderArrowsSpacing}px`,
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
