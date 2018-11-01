import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";

export function imageStylesClassName(v, sizes, props) {
  const {
    className,
    borderRadius,
    imageSrc,
    imagePopulation,
    linkLightBox
  } = v;
  const {
    meta: { desktopW, tabletW, mobileW, inGallery }
  } = props;
  let glamorObj = {};

  if (IS_PREVIEW) {
    const {
      desktop: { width: dW, height: dH },
      tablet: { width: tW, height: tH },
      mobile: { width: mW, height: mH }
    } = sizes;
    const maxBorderRadius = Math.round(Math.min(dW, dH) / 2);
    const maxTabletBorderRadius = Math.round(Math.min(tW, tH) / 2);
    const maxMobileBorderRadius = Math.round(Math.min(mW, mH) / 2);
    const {
      imageBrightness,
      imageHue,
      imageContrast,
      imageSaturation,
      boxShadow,
      boxShadowColorHex,
      boxShadowColorOpacity,
      boxShadowBlur,
      boxShadowSpread,
      boxShadowVertical,
      boxShadowHorizontal
    } = v;

    const boxShadowStyle =
      boxShadow === "on"
        ? `${boxShadowHorizontal}px ${boxShadowVertical}px ${boxShadowBlur}px ${boxShadowSpread}px ${hexToRgba(
            boxShadowColorHex,
            boxShadowColorOpacity
          )}`
        : "none";

    glamorObj = {
      ".brz &": {
        maxWidth: `${Math.round(Math.abs((dW * 100) / desktopW))}%`,
        height: !imageSrc && !imagePopulation ? `${dH}px` : "auto",
        borderRadius: `${Math.min(borderRadius, maxBorderRadius)}px`,
        filter: `brightness(${imageBrightness}%) hue-rotate(${imageHue}deg) saturate(${imageSaturation}%) contrast(${imageContrast}%)`,
        boxShadow: boxShadowStyle
      },

      "@media (max-width: 991px)": {
        ".brz &": {
          maxWidth: `${Math.round(Math.abs((tW * 100) / tabletW))}%`,
          height: !imageSrc && !imagePopulation ? `${tH}px` : "auto",
          borderRadius: `${Math.min(borderRadius, maxTabletBorderRadius)}px`
        }
      },

      "@media (max-width: 767px)": {
        ".brz &": {
          maxWidth: `${Math.round(Math.abs((mW * 100) / mobileW))}%`,
          height: !imageSrc && !imagePopulation ? `${mH}px` : "auto",
          borderRadius: `${Math.min(borderRadius, maxMobileBorderRadius)}px`
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames(
    "brz-image",
    {
      "brz-image__lightbox":
        (imageSrc || imagePopulation) && linkLightBox === "on" && !inGallery
    },
    className,
    glamorClassName
  );
}

export function imageStylesCSSVars(v) {
  const {
    imageOpacity,
    imageBrightness,
    imageHue,
    imageSaturation,
    imageContrast
  } = v;

  return {
    "--imageFilter": `brightness(${imageBrightness}%) hue-rotate(${imageHue}deg) saturate(${imageSaturation}%) contrast(${imageContrast}%)`
  };
}

export function contentStyleClassName(v) {
  const glamorObj = {
    ".brz-ed--desktop &": {
      maxWidth: "var(--maxWidth)",
      height: "var(--height)"
    },
    ".brz-ed--tablet &": {
      maxWidth: "var(--tabletMaxWidth)",
      height: "var(--tabletHeight)"
    },
    ".brz-ed--mobile &": {
      maxWidth: "var(--mobileMaxWidth)",
      height: "var(--mobileHeight)"
    }
  };
  const glamorClassName = String(css(glamorObj));

  return classnames("brz-ed-image__content", glamorClassName);
}

export function contentStyleCSSVars(v, sizes) {
  const { borderRadius } = v;
  const {
    desktop: { width: dW, height: dH },
    tablet: { width: tW, height: tH },
    mobile: { width: mW, height: mH }
  } = sizes;
  const maxBorderRadius = Math.round(Math.min(dW, dH) / 2);
  const maxTabletBorderRadius = Math.round(Math.min(tW, tH) / 2);
  const maxMobileBorderRadius = Math.round(Math.min(mW, mH) / 2);

  return {
    "--maxWidth": `${dW}px`,
    "--height": `${dH}px`,
    "--borderRadius": `${Math.min(borderRadius, maxBorderRadius)}px`,

    // Tablet
    "--tabletMaxWidth": `${tW}px`,
    "--tabletHeight": `${tH}px`,
    "--tabletBorderRadius": `${Math.min(
      borderRadius,
      maxTabletBorderRadius
    )}px`,

    // Mobile
    "--mobileMaxWidth": `${mW}px`,
    "--mobileHeight": `${mH}px`,
    "--mobileBorderRadius": `${Math.min(borderRadius, maxMobileBorderRadius)}px`
  };
}

export function wrapperStyleClassName(v) {
  const { className } = v;
  const glamorObj = {
    ".brz &": {
      boxShadow: "var(--boxShadow)"
    },
    ".brz-ed--desktop &": {
      width: "var(--width)",
      height: "var(--height)",
      borderRadius: "var(--borderRadius)"
    },
    ".brz-ed--tablet &": {
      width: "var(--tabletWidth)",
      height: "var(--tabletHeight)",
      borderRadius: "var(--tabletBorderRadius)"
    },
    ".brz-ed--mobile &": {
      width: "var(--mobileWidth)",
      height: "var(--mobileHeight)",
      borderRadius: "var(--mobileBorderRadius)"
    }
  };
  const glamorClassName = String(css(glamorObj));

  return classnames("brz-ed-image__wrapper", glamorClassName, className);
}

export function wrapperStyleCSSVars(v, sizes) {
  const {
    desktop: { width: dW, height: dH },
    tablet: { width: tW, height: tH },
    mobile: { width: mW, height: mH }
  } = sizes;

  const {
    boxShadow,
    boxShadowColorHex,
    boxShadowColorOpacity,
    boxShadowBlur,
    boxShadowSpread,
    boxShadowVertical,
    boxShadowHorizontal
  } = v;

  const boxShadowStyle =
    boxShadow === "on"
      ? `${boxShadowHorizontal}px ${boxShadowVertical}px ${boxShadowBlur}px ${boxShadowSpread}px ${hexToRgba(
          boxShadowColorHex,
          boxShadowColorOpacity
        )}`
      : "none";

  return {
    "--width": `${dW}px`,
    "--height": `${dH}px`,
    "--boxShadow": boxShadowStyle,

    // Tablet
    "--tabletWidth": `${tW}px`,
    "--tabletHeight": `${tH}px`,

    // Mobile
    "--mobileWidth": `${mW}px`,
    "--mobileHeight": `${mH}px`
  };
}

export function imgStyleClassName(v) {
  const { className } = v;
  const glamorObj = {
    filter: "var(--imageFilter)",

    ".brz-ed--desktop &": {
      width: "var(--width)",
      height: "var(--height)",
      marginLeft: "var(--marginLeft)",
      marginTop: "var(--marginTop)"
    },
    ".brz-ed--tablet &": {
      width: "var(--tabletWidth)",
      height: "var(--tabletHeight)",
      marginLeft: "var(--tabletMarginLeft)",
      marginTop: "var(--tabletMarginTop)"
    },
    ".brz-ed--mobile &": {
      width: "var(--mobileWidth)",
      height: "var(--mobileHeight)",
      marginLeft: "var(--mobileMarginLeft)",
      marginTop: "var(--mobileMarginTop)"
    }
  };
  const glamorClassName = String(css(glamorObj));

  return classnames("brz-img", glamorClassName, className);
}

export function imgStyleCSSVars(v, sizes) {
  const {
    desktop: { width: dW, height: dH, marginLeft: dML, marginTop: dMT },
    tablet: { width: tW, height: tH, marginLeft: tML, marginTop: tMT },
    mobile: { width: mW, height: mH, marginLeft: mML, marginTop: mMT }
  } = sizes;

  return {
    "--width": `${dW}px`,
    "--height": `${dH}px`,
    "--marginLeft": `${dML}px`,
    "--marginTop": `${dMT}px`,

    // Tablet
    "--tabletWidth": `${tW}px`,
    "--tabletHeight": `${tH}px`,
    "--tabletMarginLeft": `${tML}px`,
    "--tabletMarginTop": `${tMT}px`,

    // Mobile
    "--mobileWidth": `${mW}px`,
    "--mobileHeight": `${mH}px`,
    "--mobileMarginLeft": `${mML}px`,
    "--mobileMarginTop": `${mMT}px`
  };
}
