import classnames from "classnames";
import { css } from "glamor";
import { roundTo } from "visual/utils/math";
import {
  styleHoverTransition,
  styleHoverTransitionPropertyImage
} from "visual/utils/style";

import {
  cssStyleBoxShadowSuffixForGlamour,
  cssStyleFilterSuffixForGlamour
} from "visual/utils/cssStyle";

export function imageStylesClassName(v, sizes, props) {
  const {
    className,
    borderRadius,
    imageSrc,
    imagePopulation,
    linkLightBox
  } = v;
  const {
    meta: { desktopW, tabletW, mobileW, gallery = {} }
  } = props;
  const { inGallery } = gallery;

  let glamorObj;

  if (IS_PREVIEW) {
    const {
      desktop: { width: dW, height: dH },
      tablet: { width: tW, height: tH },
      mobile: { width: mW, height: mH }
    } = sizes;
    const maxBorderRadius = Math.round(Math.min(dW, dH) / 2);
    const maxTabletBorderRadius = Math.round(Math.min(tW, tH) / 2);
    const maxMobileBorderRadius = Math.round(Math.min(mW, mH) / 2);

    const shadowDesktopNormal = cssStyleBoxShadowSuffixForGlamour({
      v,
      device: "desktop",
      state: "normal"
    });
    const shadowDesktopHover = cssStyleBoxShadowSuffixForGlamour({
      v,
      device: "desktop",
      state: "hover"
    });
    const shadowDesktopTablet = cssStyleBoxShadowSuffixForGlamour({
      v,
      device: "tablet",
      state: "normal"
    });
    const shadowDesktopMobile = cssStyleBoxShadowSuffixForGlamour({
      v,
      device: "mobile",
      state: "normal"
    });

    const filterNormal = cssStyleFilterSuffixForGlamour({
      v,
      device: "desktop",
      state: "normal",
      prefix: "image"
    });

    glamorObj = {
      ".brz &": {
        maxWidth: `${Math.round(Math.abs((dW * 100) / desktopW))}%`,
        height: !imageSrc && !imagePopulation ? `${dH}px` : "auto",
        borderRadius: `${Math.min(borderRadius, maxBorderRadius)}px`,
        boxShadow: shadowDesktopNormal !== "" ? shadowDesktopNormal : null,
        filter: filterNormal !== "" ? filterNormal : null
      },

      ":after": {
        boxShadow: shadowDesktopNormal !== "" ? shadowDesktopNormal : null
      },

      "@media (min-width: 992px)": {
        transition: styleHoverTransition({ v }),
        transitionProperty: styleHoverTransitionPropertyImage(),

        ":after": {
          transition: styleHoverTransition({ v }),
          transitionProperty: styleHoverTransitionPropertyImage()
        },

        ":hover:after": {
          boxShadow: shadowDesktopHover !== "" ? shadowDesktopHover : null
        },
        ".brz &:hover": {
          boxShadow: shadowDesktopHover !== "" ? shadowDesktopHover : null
        }
      },

      "@media (max-width: 991px)": {
        ".brz &": {
          maxWidth: `${Math.round(Math.abs((tW * 100) / tabletW))}%`,
          height: !imageSrc && !imagePopulation ? `${tH}px` : "auto",
          borderRadius: `${Math.min(borderRadius, maxTabletBorderRadius)}px`,
          boxShadow: shadowDesktopTablet !== "" ? shadowDesktopTablet : null
        }
      },

      "@media (max-width: 767px)": {
        ".brz &": {
          maxWidth: `${Math.round(Math.abs((mW * 100) / mobileW))}%`,
          height: !imageSrc && !imagePopulation ? `${mH}px` : "auto",
          borderRadius: `${Math.min(borderRadius, maxMobileBorderRadius)}px`,
          boxShadow: shadowDesktopMobile !== "" ? shadowDesktopMobile : null
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
  const filterNormal = cssStyleFilterSuffixForGlamour({
    v,
    device: "desktop",
    state: "normal",
    prefix: "image"
  });

  return {
    "--imageFilter": filterNormal !== "" ? filterNormal : null
  };
}

export function contentStyleClassName() {
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
    ".brz-ed--desktop &": {
      width: "var(--width)",
      height: "var(--height)",
      borderRadius: "var(--borderRadius)",
      boxShadow: "var(--boxShadow)",

      transition: "var(--hoverTransition)",
      transitionProperty: "var(--hoverTransitionProperty)",

      ":after": {
        boxShadow: "var(--boxShadow)",

        transition: "var(--hoverTransition)",
        transitionProperty: "var(--hoverTransitionProperty)"
      },
      ":hover:after": {
        boxShadow: "var(--hoverBoxShadow)"
      },
      ":hover": {
        boxShadow: "var(--hoverBoxShadow)"
      }
    },
    ".brz-ed--tablet &": {
      width: "var(--tabletWidth)",
      height: "var(--tabletHeight)",
      borderRadius: "var(--tabletBorderRadius)",
      boxShadow: "var(--tabletBoxShadow)",

      ":after": {
        boxShadow: "var(--tabletBoxShadow)"
      }
    },
    ".brz-ed--mobile &": {
      width: "var(--mobileWidth)",
      height: "var(--mobileHeight)",
      borderRadius: "var(--mobileBorderRadius)",
      boxShadow: "var(--mobileBoxShadow)",

      ":after": {
        boxShadow: "var(--mobileBoxShadow)"
      }
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

  const shadowDesktopNormal = cssStyleBoxShadowSuffixForGlamour({
    v,
    device: "desktop",
    state: "normal"
  }).replace(";", "");

  const shadowDesktopHover = cssStyleBoxShadowSuffixForGlamour({
    v,
    device: "desktop",
    state: "hover"
  }).replace(";", "");

  const shadowDesktopTablet = cssStyleBoxShadowSuffixForGlamour({
    v,
    device: "tablet",
    state: "normal"
  }).replace(";", "");

  const shadowDesktopMobile = cssStyleBoxShadowSuffixForGlamour({
    v,
    device: "mobile",
    state: "normal"
  }).replace(";", "");

  return {
    //####--- Normal ---####//

    "--width": `${dW}px`,
    "--height": `${dH}px`,
    "--boxShadow": shadowDesktopNormal !== "" ? shadowDesktopNormal : null,

    //####--- Hover ---####//

    // Box Shadow
    "--hoverBoxShadow": shadowDesktopHover !== "" ? shadowDesktopHover : null,

    // Hover Transition
    "--hoverTransition": styleHoverTransition({ v }),
    "--hoverTransitionProperty": styleHoverTransitionPropertyImage({ v }),

    //####--- Tablet ---####//

    "--tabletWidth": `${tW}px`,
    "--tabletHeight": `${tH}px`,
    "--tabletBoxShadow":
      shadowDesktopTablet !== "" ? shadowDesktopTablet : null,

    //####--- Mobile ---####//

    "--mobileWidth": `${mW}px`,
    "--mobileHeight": `${mH}px`,
    "--mobileBoxShadow": shadowDesktopMobile !== "" ? shadowDesktopMobile : null
  };
}

export function pictureStyleClassName(sizes) {
  const {
    desktop: { width: dW, height: dH },
    tablet: { width: tW, height: tH },
    mobile: { width: mW, height: mH }
  } = sizes;

  const glamorObj = {
    "@media (min-width: 992px)": {
      ".brz &": {
        paddingTop: `${roundTo((dH / dW) * 100, 4)}%`
      }
    },
    "@media (max-width: 991px)": {
      ".brz &": {
        paddingTop: `${roundTo((tH / tW) * 100, 4)}%`
      }
    },
    "@media (max-width: 767px)": {
      ".brz &": {
        paddingTop: `${roundTo((mH / mW) * 100, 4)}%`
      }
    }
  };

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-picture brz-d-block brz-p-relative", glamorClassName);
}

export function imgStyleClassName(v) {
  const { className } = v;

  const filterNormal = cssStyleFilterSuffixForGlamour({
    v,
    device: "desktop",
    state: "normal",
    prefix: "image"
  });

  const glamorObj = {
    filter: filterNormal !== "" ? "var(--imageFilter)" : null,

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
