import classnames from "classnames";
import { css } from "glamor";
import { imageUrl, imagePopulationUrl } from "visual/utils/image";
import { hexToRgba } from "visual/utils/color";
import { svgToUri } from "visual/utils/icons";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

const backgroundAttachment = {
  none: "scroll",
  fixed: "fixed",
  animated: "scroll"
};

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
        borderBottomRightRadius: "var(--borderBottomRightRadius)",

        // Shape
        "& > .brz-bg-shape__top": {
          transform: "var(--shapeTopFlip)",
          backgroundImage: "var(--shapeTopType)",
          zIndex: "var(--shapeTopIndex)"
        },
        "& > .brz-bg-shape__bottom": {
          transform: "var(--shapeBottomFlip)",
          backgroundImage: "var(--shapeBottomType)",
          zIndex: "var(--shapeBottomIndex)"
        }
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
        },

        // Shape
        "> .brz-bg-media > .brz-bg-shape__top": {
          backgroundSize: "var(--shapeTopBackgroundSize)",
          height: "var(--shapeTopHeight)"
        },
        "> .brz-bg-media > .brz-bg-shape__bottom": {
          backgroundSize: "var(--shapeBottomBackgroundSize)",
          height: "var(--shapeBottomHeight)"
        }
      },
      ".brz-ed--tablet &": {
        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--tabletBackgroundImage)",
          backgroundPositionX: "var(--tabletBackgroundPositionX)",
          backgroundPositionY: "var(--tabletBackgroundPositionY)",
          backgroundAttachment: "var(--tabletBackgroundAttachment)"
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--tabletBackgroundColor)"
        },
        "> .brz-bg-media > .brz-bg-map": {
          display: "var(--tabletMediaBg)"
        },

        // Shape
        "> .brz-bg-media > .brz-bg-shape__top": {
          backgroundSize: "var(--tabletShapeTopBackgroundSize)",
          height: "var(--tabletShapeTopHeight)"
        },
        "> .brz-bg-media > .brz-bg-shape__bottom": {
          backgroundSize: "var(--tabletShapeBottomBackgroundSize)",
          height: "var(--tabletShapeBottomHeight)"
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
        },

        // Shape
        "> .brz-bg-media > .brz-bg-shape__top": {
          backgroundSize: "var(--mobileShapeTopBackgroundSize)",
          height: "var(--mobileShapeTopHeight)"
        },
        "> .brz-bg-media > .brz-bg-shape__bottom": {
          backgroundSize: "var(--mobileShapeBottomBackgroundSize)",
          height: "var(--mobileShapeBottomHeight)"
        }
      }
    };
  } else {
    const {
      media,
      bgImageSrc,
      bgPopulation,
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
      shapeTopHorizontal,
      shapeBottomHorizontal,
      shapeTopHeight,
      shapeBottomHeight,
      shapeTopHeightSuffix,
      shapeBottomHeightSuffix,
      shapeTopColorHex,
      shapeTopColorOpacity,
      shapeBottomColorHex,
      shapeBottomColorOpacity,
      shapeTopIndex,
      shapeBottomIndex,
      shapeTopType,
      shapeBottomType
    } = v;
    const { showSlider } = props.meta;

    const bgImage = bgPopulation
      ? imagePopulationUrl(bgPopulation)
      : imageUrl(bgImageSrc);

    const tabletBgImage = bgPopulation
      ? imagePopulationUrl(bgPopulation)
      : imageUrl(tabletSyncOnChange(v, "bgImageSrc"));

    const mobileBgImage = bgPopulation
      ? imagePopulationUrl(bgPopulation)
      : imageUrl(mobileSyncOnChange(v, "bgImageSrc"));

    // Tablet Shape
    const tabletShapeTopHeight = tabletSyncOnChange(v, "shapeTopHeight");
    const tabletShapeBottomHeight = tabletSyncOnChange(v, "shapeBottomHeight");

    const tabletShapeTopHeightSuffix = tabletSyncOnChange(
      v,
      "shapeTopHeightSuffix"
    );
    const tabletShapeBottomHeightSuffix = tabletSyncOnChange(
      v,
      "shapeBottomHeightSuffix"
    );

    // Mobile Shape
    const mobileShapeTopHeight = mobileSyncOnChange(v, "shapeTopHeight");
    const mobileShapeBottomHeight = mobileSyncOnChange(v, "shapeBottomHeight");

    const mobileShapeTopHeightSuffix = mobileSyncOnChange(
      v,
      "shapeTopHeightSuffix"
    );
    const mobileShapeBottomHeightSuffix = mobileSyncOnChange(
      v,
      "shapeBottomHeightSuffix"
    );

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
          media === "image" && (bgImageSrc || bgPopulation)
            ? `url(${bgImage})`
            : "none",
        backgroundPosition: bgPopulation
          ? "0% 0%"
          : `${bgPositionX}% ${bgPositionY}%`,
        backgroundAttachment:
          backgroundAttachment[showSlider ? "none" : bgAttachment]
      },
      "> .brz-bg-media > .brz-bg-color": {
        backgroundColor: hexToRgba(bgColorHex, bgColorOpacity)
      },
      "> .brz-bg-media > .brz-bg-map": {
        display: media === "map" ? "block" : "none"
      },
      
      // Shape
      "> .brz-bg-media > .brz-bg-shape__top": {
        backgroundImage:
          shapeTopType === "none"
            ? "none"
            : `url('${svgToUri(
                shapeTopType,
                hexToRgba(shapeTopColorHex, shapeTopColorOpacity)
              )}')`,
        backgroundSize: `100% ${shapeTopHeight + shapeTopHeightSuffix}`,
        transform:
          shapeTopHorizontal === "on"
            ? "rotateX(0deg) rotateY(-180deg)"
            : "rotateX(0deg) rotateY(0deg)",
        height: shapeTopHeight + shapeTopHeightSuffix,
        zIndex: shapeTopIndex
      },
      "> .brz-bg-media > .brz-bg-shape__bottom": {
        backgroundImage:
          shapeBottomType === "none"
            ? "none"
            : `url('${svgToUri(
                shapeBottomType,
                hexToRgba(shapeBottomColorHex, shapeBottomColorOpacity)
              )}')`,
        backgroundSize: `100% ${shapeBottomHeight + shapeBottomHeightSuffix}`,
        transform:
          shapeBottomHorizontal === "on"
            ? "rotateX(-180deg) rotateY(0deg)"
            : "rotateX(-180deg) rotateY(-180deg)",
        height: shapeBottomHeight + shapeBottomHeightSuffix,
        zIndex: shapeBottomIndex
      },
      
      // Tablet
      "@media (max-width: 991px)": {
        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage:
            (tabletSyncOnChange(v, "bgImageSrc") || bgPopulation) &&
            tabletSyncOnChange(v, "media") !== "map"
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
        },
        "> .brz-bg-media > .brz-bg-map": {
          display: tabletSyncOnChange(v, "media") === "map" ? "block" : "none"
        },

        // Shape
        "> .brz-bg-media > .brz-bg-shape__top": {
          backgroundSize: `100% ${tabletShapeTopHeight +
          tabletShapeTopHeightSuffix}`,
          height: tabletShapeTopHeight + tabletShapeTopHeightSuffix
        },
        "> .brz-bg-media > .brz-bg-shape__bottom": {
          backgroundSize: `100% ${tabletShapeBottomHeight +
          tabletShapeBottomHeightSuffix}`,
          height: tabletShapeBottomHeight + tabletShapeBottomHeightSuffix
        }
      },
      // Mobile
      "@media (max-width: 767px)": {
        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage:
            (mobileSyncOnChange(v, "bgImageSrc") || bgPopulation) &&
            mobileSyncOnChange(v, "media") !== "map"
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
        },
        "> .brz-bg-media > .brz-bg-map": {
          display: mobileSyncOnChange(v, "media") === "map" ? "block" : "none"
        },
        
        // Shape
        "> .brz-bg-media > .brz-bg-shape__top": {
          backgroundSize: `100% ${mobileShapeTopHeight +
            mobileShapeTopHeightSuffix}`,
          height: mobileShapeTopHeight + mobileShapeTopHeightSuffix
        },
        "> .brz-bg-media > .brz-bg-shape__bottom": {
          backgroundSize: `100% ${mobileShapeBottomHeight +
            mobileShapeBottomHeightSuffix}`,
          height: mobileShapeBottomHeight + mobileShapeBottomHeightSuffix
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
    bgPopulation,
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
    shapeTopType,
    shapeBottomType,
    shapeTopColorHex,
    shapeTopColorOpacity,
    shapeBottomColorHex,
    shapeBottomColorOpacity,
    shapeTopHeight,
    shapeBottomHeight,
    shapeTopHeightSuffix,
    shapeBottomHeightSuffix,
    shapeTopHorizontal,
    shapeBottomHorizontal,
    shapeTopIndex,
    shapeBottomIndex
  } = v;
  const { showSlider } = props.meta;
  
  // Tablet Shape
  const tabletShapeTopHeight = tabletSyncOnChange(v, "shapeTopHeight");
  const tabletShapeBottomHeight = tabletSyncOnChange(v, "shapeBottomHeight");

  const tabletShapeTopHeightSuffix = tabletSyncOnChange(
    v,
    "shapeTopHeightSuffix"
  );
  const tabletShapeBottomHeightSuffix = tabletSyncOnChange(
    v,
    "shapeBottomHeightSuffix"
  );
  
  // Mobile Shape
  const mobileShapeTopHeight = mobileSyncOnChange(v, "shapeTopHeight");
  const mobileShapeBottomHeight = mobileSyncOnChange(v, "shapeBottomHeight");

  const mobileShapeTopHeightSuffix = mobileSyncOnChange(
    v,
    "shapeTopHeightSuffix"
  );
  const mobileShapeBottomHeightSuffix = mobileSyncOnChange(
    v,
    "shapeBottomHeightSuffix"
  );

  return {
    "--mediaBg": media === "map" ? "block" : "none",
    "--backgroundImage":
      media === "image" && bgImageSrc && !bgPopulation
        ? `url(${imageUrl(bgImageSrc)})`
        : "none",
    "--backgroundPositionX": bgPopulation ? "0%" : `${bgPositionX}%`,
    "--backgroundPositionY": bgPopulation ? "0%" : `${bgPositionY}%`,
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

    // Shape
    "--shapeTopHeight": shapeTopHeight + shapeTopHeightSuffix,
    "--shapeBottomHeight": shapeBottomHeight + shapeBottomHeightSuffix,
    "--shapeTopFlip":
      shapeTopHorizontal === "on"
        ? "rotateX(0deg) rotateY(-180deg)"
        : "rotateX(0deg) rotateY(0deg)",
    "--shapeBottomFlip":
      shapeBottomHorizontal === "on"
        ? "rotateX(-180deg) rotateY(0deg)"
        : "rotateX(-180deg) rotateY(-180deg)",
    "--shapeTopIndex": shapeTopIndex,
    "--shapeBottomIndex": shapeBottomIndex,
    "--shapeTopType":
      shapeTopType === "none"
        ? "none"
        : `url('${svgToUri(
            shapeTopType,
            hexToRgba(shapeTopColorHex, shapeTopColorOpacity)
          )}')`,
    "--shapeTopBackgroundSize": `100% ${shapeTopHeight + shapeTopHeightSuffix}`,
    "--shapeBottomType":
      shapeBottomType === "none"
        ? "none"
        : `url('${svgToUri(
            shapeBottomType,
            hexToRgba(shapeBottomColorHex, shapeBottomColorOpacity)
          )}')`,
    "--shapeBottomBackgroundSize": `100% ${shapeBottomHeight +
      shapeBottomHeightSuffix}`,

    // Tablet
    "--tabletMediaBg":
      tabletSyncOnChange(v, "media") === "map" ? "block" : "none",
    "--tabletBackgroundImage":
      tabletSyncOnChange(v, "bgImageSrc") &&
      tabletSyncOnChange(v, "media") !== "map" &&
      !bgPopulation
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
    
    // Tablet Shape
    "--tabletShapeTopHeight": tabletShapeTopHeight + tabletShapeTopHeightSuffix,
    "--tabletShapeBottomHeight":
      tabletShapeBottomHeight + tabletShapeBottomHeightSuffix,
    "--tabletShapeTopBackgroundSize": `${100}% ${tabletShapeTopHeight +
    tabletShapeTopHeightSuffix}`,
    "--tabletShapeBottomBackgroundSize": `${100}% ${tabletShapeBottomHeight +
    tabletShapeBottomHeightSuffix}`,

    // Mobile
    "--mobileMediaBg":
      mobileSyncOnChange(v, "media") === "map" ? "block" : "none",
    "--mobileBackgroundImage":
      mobileSyncOnChange(v, "bgImageSrc") &&
      mobileSyncOnChange(v, "media") !== "map" &&
      !bgPopulation
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
    ),
    
    // Mobile Shape
    "--mobileShapeTopHeight": mobileShapeTopHeight + mobileShapeTopHeightSuffix,
    "--mobileShapeBottomHeight":
      mobileShapeBottomHeight + mobileShapeBottomHeightSuffix,
    "--mobileShapeTopBackgroundSize": `${100}% ${mobileShapeTopHeight +
    mobileShapeTopHeightSuffix}`,
    "--mobileShapeBottomBackgroundSize": `${100}% ${mobileShapeBottomHeight +
    mobileShapeBottomHeightSuffix}`,
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

      "@media (min-width: 992px)": {
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

      // Tablet
      tabletPaddingType,
      tabletPadding,
      tabletPaddingSuffix,
      tabletPaddingTop,
      tabletPaddingTopSuffix,
      tabletPaddingBottom,
      tabletPaddingBottomSuffix,

      // Mobile
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

      "@media (max-width: 991px)": {
        paddingTop:
          tabletPaddingType === "grouped"
            ? tabletPadding + tabletPaddingSuffix
            : tabletPaddingTop + tabletPaddingTopSuffix,
        paddingBottom:
          tabletPaddingType === "grouped"
            ? tabletPadding + tabletPaddingSuffix
            : tabletPaddingBottom + tabletPaddingBottomSuffix
      },

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
