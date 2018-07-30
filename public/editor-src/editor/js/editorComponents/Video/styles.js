import classnames from "classnames";
import { css } from "glamor";
import { imageUrl } from "visual/utils/image";
import { videoData as getVideoData } from "visual/utils/video";
import { hexToRgba } from "visual/utils/color";

export function styleClassName(v, props) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz &": {
        backgroundColor: "var(--backgroundColor)",
        boxShadow: "var(--boxShadow)"
      },
      ".brz-ed--desktop &": {
        maxWidth: "var(--maxWidth)",
        height: "var(--height)"
      },
      ".brz-ed--mobile &": {
        maxWidth: "var(--mobileMaxWidth)",
        height: "var(--mobileHeight)"
      }
    };
  } else {
    const {
      size,
      video,
      ratio,
      mobileSize,
      boxShadow,
      boxShadowColorHex,
      boxShadowColorOpacity,
      boxShadowBlur,
      boxShadowSpread,
      boxShadowVertical,
      boxShadowHorizontal
    } = v;
    const {
      meta: { desktopW }
    } = props;
    const src = getVideoData(video);

    const height =
      ratio === "16:9"
        ? Math.round((((desktopW / 16) * 9) / 100) * size)
        : Math.round((((desktopW / 4) * 3) / 100) * size);

    const mobileHeight =
      ratio === "16:9"
        ? Math.round((((370 / 16) * 9) / 100) * mobileSize)
        : Math.round((((370 / 4) * 3) / 100) * mobileSize);

    const boxShadowStyle =
      boxShadow === "on"
        ? `${boxShadowHorizontal}px ${boxShadowVertical}px ${boxShadowBlur}px ${boxShadowSpread}px ${hexToRgba(
            boxShadowColorHex,
            boxShadowColorOpacity
          )}`
        : "none";

    glamorObj = {
      ".brz &": {
        backgroundColor: ratio === "4:3" ? "#000" : null,
        maxWidth: `${size}%`,
        height: !src ? `${height}px` : null,
        boxShadow: boxShadowStyle
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          maxWidth: `${mobileSize}%`,
          height: !src ? `${mobileHeight}px` : null
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-video", glamorClassName, className);
}

export function styleCSSVars(v, props) {
  if (IS_PREVIEW) return;

  const {
    size,
    video,
    ratio,
    mobileSize,
    boxShadow,
    boxShadowColorHex,
    boxShadowColorOpacity,
    boxShadowBlur,
    boxShadowSpread,
    boxShadowVertical,
    boxShadowHorizontal
  } = v;

  const {
    meta: { desktopW }
  } = props;
  const src = getVideoData(video);

  const height =
    ratio === "16:9"
      ? Math.round((((desktopW / 16) * 9) / 100) * size)
      : Math.round((((desktopW / 4) * 3) / 100) * size);

  const mobileHeight =
    ratio === "16:9"
      ? Math.round((((370 / 16) * 9) / 100) * mobileSize)
      : Math.round((((370 / 4) * 3) / 100) * mobileSize);

  const boxShadowStyle =
    boxShadow === "on"
      ? `${boxShadowHorizontal}px ${boxShadowVertical}px ${boxShadowBlur}px ${boxShadowSpread}px ${hexToRgba(
          boxShadowColorHex,
          boxShadowColorOpacity
        )}`
      : "none";

  return {
    "--backgroundColor": ratio === "4:3" ? "#000" : "transparent",
    "--maxWidth": `${size}%`,
    "--height": !src ? `${height}px` : "auto",
    "--boxShadow": boxShadowStyle,
    "--mobileMaxWidth": `${mobileSize}%`,
    "--mobileHeight": !src ? `${mobileHeight}px` : "auto"
  };
}

export function wrapperStyleClassName(v) {
  const { ratio } = v;
  let glamorObj;

  if (IS_EDITOR) {
    return css({
      paddingTop: "var(--paddingTop)",
      pointerEvents: "var(--pointerEvents)",

      "& .brz-video__cover": {
        backgroundImage: "var(--imageSrc)",
        backgroundPositionX: "var(--coverPositionX)",
        backgroundPositionY: "var(--coverPositionY)",
        backgroundSize: "var(--coverZoom)"
      },
      "& .brz-video__cover .brz-video__cover-icon": {
        fontSize: "var(--iconFontSize)",
        width: "var(--iconSizeWidth)",
        height: "var(--iconSizeHeight)",
        backgroundColor: "var(--iconBgColor)"
      },
      "& .brz-video__cover:hover .brz-video__cover-icon": {
        backgroundColor: "var(--hoverIconBgColor)"
      }
    });
  } else {
    const {
      coverImageSrc,
      coverPositionX,
      coverPositionY,
      coverZoom,
      iconSizeWidth,
      iconSizeHeight,
      bgColorHex,
      bgColorOpacity,
      hoverBgColorHex,
      hoverBgColorOpacity,
      video
    } = v;

    const videoCoverCss = coverImageSrc
      ? {
          "& .brz-video__cover": {
            backgroundImage: `url(${imageUrl(coverImageSrc)})`,
            backgroundPositionX: `${coverPositionX}%`,
            backgroundPositionY: `${coverPositionY}%`,
            backgroundSize: `${coverZoom}%`
          }
        }
      : {};

    const iconFontSize = Math.round(v.iconSize * 0.35);

    const glamourClassName = String(
      css({
        ...videoCoverCss,
        "& .brz-video__cover .brz-video__cover-icon": {
          fontSize: `${iconFontSize}px`,
          width: `${iconSizeWidth}px`,
          height: `${iconSizeHeight}px`,
          backgroundColor: hexToRgba(bgColorHex, bgColorOpacity)
        },
        "& .brz-video__cover:hover .brz-video__cover-icon": {
          backgroundColor: hexToRgba(hoverBgColorHex, hoverBgColorOpacity)
        }
      })
    );

    return classnames(
      `brz-image-fix-${ratio.replace(":", "-")}`,
      glamourClassName
    );
  }
}

export function wrapperStyleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    ratio,
    coverImageSrc,
    coverPositionX,
    coverPositionY,
    coverZoom,
    iconSizeWidth,
    iconSizeHeight,
    bgColorHex,
    bgColorOpacity,
    hoverBgColorHex,
    hoverBgColorOpacity
  } = v;

  const iconFontSize = Math.round(v.iconSize * 0.35);

  const paddingRatio = {
    "1:1": "100%",
    "2:1": "50%",
    "2:3": "150%",
    "3:4": "125%",
    "4:3": "75%",
    "9:16": "177.8%",
    "16:9": "56.25%"
  };

  const imgSrcCSS = coverImageSrc
    ? { "--imageSrc": `url(${imageUrl(coverImageSrc)})` }
    : {};

  return {
    "--paddingTop": paddingRatio[ratio],
    "--coverPositionX": `${coverPositionX}%`,
    "--coverPositionY": `${coverPositionY}%`,
    "--coverZoom": `${coverZoom}%`,
    "--iconSizeWidth": `${iconSizeWidth}px`,
    "--iconSizeHeight": `${iconSizeHeight}px`,
    "--iconFontSize": `${iconFontSize}px`,
    "--iconBgColor": hexToRgba(bgColorHex, bgColorOpacity),
    "--hoverIconBgColor": hexToRgba(hoverBgColorHex, hoverBgColorOpacity),
    "--pointerEvents": "none",
    ...imgSrcCSS
  };
}
