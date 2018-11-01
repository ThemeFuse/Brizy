import classnames from "classnames";
import { css } from "glamor";
import { imageUrl, imagePopulationUrl } from "visual/utils/image";
import { hexToRgba } from "visual/utils/color";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

export function sectionStyleClassName(v, state) {
  const { className, customClassName } = v;

  let objClassNames;
  let glamorObj;

  if (IS_EDITOR) {
    objClassNames = [
      "brz-popup__editor",
      {
        "brz-popup--opened": state.isOpened
      }
    ];
    glamorObj = {
      "> .brz-popup__close": {
        color: "var(--color)"
      }
    };
  } else {
    const { colorHex, colorOpacity } = v;
    objClassNames = ["brz-popup__preview"];
    glamorObj = {
      "> .brz-popup__close": {
        color: hexToRgba(colorHex, colorOpacity)
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames(
    "brz-popup",
    ...objClassNames,
    className,
    customClassName,
    glamorClassName
  );
}

export function sectionStyleCSSVars(v) {
  if (IS_PREVIEW) return;

  const { colorHex, colorOpacity } = v;

  return {
    "--color": hexToRgba(colorHex, colorOpacity)
  };
}

export function bgStyleClassName(v) {
  let glamorObj;
  if (IS_EDITOR) {
    glamorObj = {
      height: "100%",

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
      ".brz-ed--tablet &": {
        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--tabletBackgroundImage)",
          backgroundPositionX: "var(--tabletBackgroundPositionX)",
          backgroundPositionY: "var(--tabletBackgroundPositionY)"
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--tabletBackgroundColor)"
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
      borderBottomRightRadius
    } = v;
    const bgImage = bgPopulation
      ? imagePopulationUrl(bgPopulation)
      : imageUrl(bgImageSrc);

    const tabletBgImage = bgPopulation
      ? imagePopulationUrl(bgPopulation)
      : imageUrl(tabletSyncOnChange(v, "bgImageSrc"));

    const mobileBgImage = bgPopulation
      ? imagePopulationUrl(bgPopulation)
      : imageUrl(mobileSyncOnChange(v, "bgImageSrc"));

    glamorObj = {
      height: "100%",

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
      "@media (max-width: 991px)": {
        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage:
            tabletSyncOnChange(v, "bgImageSrc") || bgPopulation
              ? `url(${tabletBgImage})`
              : "none",
          backgroundPosition: bgPopulation
            ? "0% 0%"
            : `${tabletSyncOnChange(v, "bgPositionX")}% ${tabletSyncOnChange(
                v,
                "bgPositionY"
              )}%`
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: hexToRgba(
            tabletSyncOnChange(v, "bgColorHex"),
            tabletSyncOnChange(v, "bgColorOpacity")
          )
        }
      },
      "@media (max-width: 767px)": {
        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage:
            mobileSyncOnChange(v, "bgImageSrc") || bgPopulation
              ? `url(${mobileBgImage})`
              : "none",
          backgroundPosition: bgPopulation
            ? "0% 0%"
            : `${mobileSyncOnChange(v, "bgPositionX")}% ${mobileSyncOnChange(
                v,
                "bgPositionY"
              )}%`
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: hexToRgba(
            mobileSyncOnChange(v, "bgColorHex"),
            mobileSyncOnChange(v, "bgColorOpacity")
          )
        }
      }
    };
  }
  const glamorClassName = String(css(glamorObj));

  return classnames(
    "brz-popup__inner",
    "brz-d-xs-flex",
    "brz-flex-xs-wrap",
    "brz-align-items-xs-center",
    glamorClassName
  );
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
    borderBottomRightRadius
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

    // Tablet
    "--tabletBackgroundImage":
      tabletSyncOnChange(v, "bgImageSrc") && !bgPopulation
        ? `url(${imageUrl(tabletSyncOnChange(v, "bgImageSrc"))})`
        : "none",
    "--tabletBackgroundPositionX": bgPopulation
      ? "0%"
      : `${tabletSyncOnChange(v, "bgPositionX")}%`,
    "--tabletBackgroundPositionY": bgPopulation
      ? "0%"
      : `${tabletSyncOnChange(v, "bgPositionY")}%`,
    "--tabletBackgroundColor": hexToRgba(
      tabletSyncOnChange(v, "bgColorHex"),
      tabletSyncOnChange(v, "bgColorOpacity")
    ),

    // Mobile
    "--mobileBackgroundImage":
      mobileSyncOnChange(v, "bgImageSrc") && !bgPopulation
        ? `url(${imageUrl(mobileSyncOnChange(v, "bgImageSrc"))})`
        : "none",
    "--mobileBackgroundPositionX": bgPopulation
      ? "0%"
      : `${mobileSyncOnChange(v, "bgPositionX")}%`,
    "--mobileBackgroundPositionY": bgPopulation
      ? "0%"
      : `${mobileSyncOnChange(v, "bgPositionY")}%`,
    "--mobileBackgroundColor": hexToRgba(
      mobileSyncOnChange(v, "bgColorHex"),
      mobileSyncOnChange(v, "bgColorOpacity")
    )
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

      "@media (min-width: 992px)": {
        maxWidth: `${containerSize}%`
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
    borderWidthType,
    borderWidth,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth
  } = v;

  return {
    "--maxWidth": `${containerSize}%`,
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
    glamorObj = {
      maxWidth: "1170px"
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-container__wrap", glamorClassName);
}

export function containerStyleCSSVars(v) {
  if (IS_PREVIEW) return null;

  return {
    "--containerWidth": "1170px"
  };
}
