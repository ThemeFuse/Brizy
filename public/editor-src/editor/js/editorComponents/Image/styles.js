import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";

export function imageStylesClassName(v, sizes, props) {
  const { className, borderRadius, imageSrc, linkLightBox } = v;
  const {
    meta: { desktopW, mobileW, inGallery }
  } = props;
  let glamorObj = {};

  if (IS_PREVIEW) {
    const {
      desktop: { width: dW, height: dH },
      mobile: { width: mW, height: mH }
    } = sizes;
    const maxBorderRadius = Math.round(Math.min(dW, dH) / 2);
    const maxMobileBorderRadius = Math.round(Math.min(mW, mH) / 2);
    const {
      imagePopulation,
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
      "@media (max-width: 768px)": {
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
      "brz-image__lightbox": imageSrc && linkLightBox === "on" && !inGallery
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
    mobile: { width: mW, height: mH }
  } = sizes;
  const maxBorderRadius = Math.round(Math.min(dW, dH) / 2);
  const maxMobileBorderRadius = Math.round(Math.min(mW, mH) / 2);

  return {
    "--borderRadius": `${Math.min(borderRadius, maxBorderRadius)}px`,
    "--mobileBorderRadius": `${Math.min(
      borderRadius,
      maxMobileBorderRadius
    )}px`,
    "--maxWidth": `${dW}px`,
    "--height": `${dH}px`,
    "--mobileMaxWidth": `${mW}px`,
    "--mobileHeight": `${mH}px`
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
    mobile: { width: mW, height: mH, marginLeft: mML, marginTop: mMT }
  } = sizes;

  return {
    "--width": `${dW}px`,
    "--height": `${dH}px`,
    "--marginLeft": `${dML}px`,
    "--marginTop": `${dMT}px`,
    "--mobileWidth": `${mW}px`,
    "--mobileHeight": `${mH}px`,
    "--mobileMarginLeft": `${mML}px`,
    "--mobileMarginTop": `${mMT}px`
  };
}
