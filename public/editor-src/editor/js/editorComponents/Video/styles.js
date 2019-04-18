import classnames from "classnames";
import { css } from "glamor";
import { imageUrl } from "visual/utils/image";
import { videoData as getVideoData } from "visual/utils/video";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

import {
  styleBorderStyle,
  styleBorderWidth,
  styleBorderRadius,
  styleBorderColor,
  styleHoverTransition,
  styleHoverTransitionProperty,
  styleBoxShadow,
  styleBgColor
} from "visual/utils/style";

export function styleClassName(v, props) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz &": {
        backgroundColor: "var(--backgroundColor)",

        "& .brz-video-content": {
          overflow: "hidden",
          position: "relative",
          width: "100%",
          height: "100%"
        },

        "& .brz-iframe, & .brz-video__cover::before": {
          filter: "var(--videoFilter)"
        }
      },
      ".brz-ed--desktop &": {
        maxWidth: "var(--maxWidth)",
        height: "var(--height)",

        "& .brz-video-content": {
          borderStyle: "var(--borderStyle)",

          borderTopWidth: "var(--borderTopWidth)",
          borderRightWidth: "var(--borderRightWidth)",
          borderBottomWidth: "var(--borderBottomWidth)",
          borderLeftWidth: "var(--borderLeftWidth)",

          borderTopLeftRadius: "var(--borderTopLeftRadius)",
          borderTopRightRadius: "var(--borderTopRightRadius)",
          borderBottomLeftRadius: "var(--borderBottomLeftRadius)",
          borderBottomRightRadius: "var(--borderBottomRightRadius)",

          borderColor: "var(--borderColor)",
          boxShadow: "var(--boxShadow)",

          transition: "var(--hoverTransition)",
          transitionProperty: "var(--hoverTransitionProperty)",

          ":hover": {
            borderStyle: "var(--hoverBorderStyle)",

            borderTopWidth: "var(--hoverBorderTopWidth)",
            borderRightWidth: "var(--hoverBorderRightWidth)",
            borderBottomWidth: "var(--hoverBorderBottomWidth)",
            borderLeftWidth: "var(--hoverBorderLeftWidth)",

            borderTopLeftRadius: "var(--hoverBorderTopLeftRadius)",
            borderTopRightRadius: "var(--hoverBorderTopRightRadius)",
            borderBottomLeftRadius: "var(--hoverBorderBottomLeftRadius)",
            borderBottomRightRadius: "var(--hoverBorderBottomRightRadius)",

            borderColor: "var(--hoverBorderColor)",
            boxShadow: "var(--hoverBoxShadow)"
          }
        }
      },
      ".brz-ed--tablet &": {
        maxWidth: "var(--tabletMaxWidth)",
        height: "var(--tabletHeight)",

        "& .brz-video-content": {
          borderStyle: "var(--tabletBorderStyle)",

          borderTopWidth: "var(--tabletBorderTopWidth)",
          borderRightWidth: "var(--tabletBorderRightWidth)",
          borderBottomWidth: "var(--tabletBorderBottomWidth)",
          borderLeftWidth: "var(--tabletBorderLeftWidth)",

          borderTopLeftRadius: "var(--tabletBorderTopLeftRadius)",
          borderTopRightRadius: "var(--tabletBorderTopRightRadius)",
          borderBottomLeftRadius: "var(--tabletBorderBottomLeftRadius)",
          borderBottomRightRadius: "var(--tabletBorderBottomRightRadius)",

          borderColor: "var(--tabletBorderColor)",

          boxShadow: "var(--tabletBoxShadow)"
        }
      },
      ".brz-ed--mobile &": {
        maxWidth: "var(--mobileMaxWidth)",
        height: "var(--mobileHeight)",

        "& .brz-video-content": {
          borderStyle: "var(--mobileBorderStyle)",

          borderTopWidth: "var(--mobileBorderTopWidth)",
          borderRightWidth: "var(--mobileBorderRightWidth)",
          borderBottomWidth: "var(--mobileBorderBottomWidth)",
          borderLeftWidth: "var(--mobileBorderLeftWidth)",

          borderTopLeftRadius: "var(--mobileBorderTopLeftRadius)",
          borderTopRightRadius: "var(--mobileBorderTopRightRadius)",
          borderBottomLeftRadius: "var(--mobileBorderBottomLeftRadius)",
          borderBottomRightRadius: "var(--mobileBorderBottomRightRadius)",

          borderColor: "var(--mobileBorderColor)",

          boxShadow: "var(--mobileBoxShadow)"
        }
      }
    };
  } else {
    const { size, video, ratio, brightness, hue, contrast, saturation } = v;
    const {
      meta: { desktopW, tabletW, mobileW }
    } = props;
    const src = getVideoData(video);

    const height =
      ratio === "16:9"
        ? Math.round((((desktopW / 16) * 9) / 100) * size)
        : Math.round((((desktopW / 4) * 3) / 100) * size);

    const tabletSize = tabletSyncOnChange(v, "size");
    const tabletHeight =
      ratio === "16:9"
        ? Math.round((((tabletW / 16) * 9) / 100) * tabletSize)
        : Math.round((((tabletW / 4) * 3) / 100) * tabletSize);

    const mobileSize = mobileSyncOnChange(v, "size");
    const mobileHeight =
      ratio === "16:9"
        ? Math.round((((mobileW / 16) * 9) / 100) * mobileSize)
        : Math.round((((mobileW / 4) * 3) / 100) * mobileSize);

    glamorObj = {
      ".brz &": {
        backgroundColor: ratio === "4:3" ? "#000" : null,
        maxWidth: `${size}%`,
        height: !src ? `${height}px` : null,

        "& .brz-video-content": {
          overflow: "hidden",

          position: "relative",

          borderStyle: styleBorderStyle({
            v,
            device: "desktop",
            state: "normal"
          }),

          borderTopWidth: styleBorderWidth({
            v,
            device: "desktop",
            state: "normal",
            current: "borderTopWidth"
          }),
          borderRightWidth: styleBorderWidth({
            v,
            device: "desktop",
            state: "normal",
            current: "borderRightWidth"
          }),
          borderBottomWidth: styleBorderWidth({
            v,
            device: "desktop",
            state: "normal",
            current: "borderBottomWidth"
          }),
          borderLeftWidth: styleBorderWidth({
            v,
            device: "desktop",
            state: "normal",
            current: "borderLeftWidth"
          }),

          borderTopLeftRadius: styleBorderRadius({
            v,
            device: "desktop",
            state: "normal",
            current: "borderTopLeftRadius"
          }),
          borderTopRightRadius: styleBorderRadius({
            v,
            device: "desktop",
            state: "normal",
            current: "borderTopRightRadius"
          }),
          borderBottomLeftRadius: styleBorderRadius({
            v,
            device: "desktop",
            state: "normal",
            current: "borderBottomLeftRadius"
          }),
          borderBottomRightRadius: styleBorderRadius({
            v,
            device: "desktop",
            state: "normal",
            current: "borderBottomRightRadius"
          }),

          borderColor: `${styleBorderColor({
            v,
            device: "desktop",
            state: "normal"
          })}`,

          boxShadow: styleBoxShadow({ v, device: "desktop", state: "normal" }),

          "@media (min-width: 991px)": {
            // Hover Transition
            transition: styleHoverTransition({ v }),
            transitionProperty: styleHoverTransitionProperty(),

            ":hover": {
              borderStyle: styleBorderStyle({
                v,
                device: "desktop",
                state: "hover"
              }),

              borderTopWidth: styleBorderWidth({
                v,
                device: "desktop",
                state: "hover",
                current: "borderTopWidth"
              }),
              borderRightWidth: styleBorderWidth({
                v,
                device: "desktop",
                state: "hover",
                current: "borderRightWidth"
              }),
              borderBottomWidth: styleBorderWidth({
                v,
                device: "desktop",
                state: "hover",
                current: "borderBottomWidth"
              }),
              borderLeftWidth: styleBorderWidth({
                v,
                device: "desktop",
                state: "hover",
                current: "borderLeftWidth"
              }),

              borderTopLeftRadius: styleBorderRadius({
                v,
                device: "desktop",
                state: "hover",
                current: "borderTopLeftRadius"
              }),
              borderTopRightRadius: styleBorderRadius({
                v,
                device: "desktop",
                state: "hover",
                current: "borderTopRightRadius"
              }),
              borderBottomLeftRadius: styleBorderRadius({
                v,
                device: "desktop",
                state: "hover",
                current: "borderBottomLeftRadius"
              }),
              borderBottomRightRadius: styleBorderRadius({
                v,
                device: "desktop",
                state: "hover",
                current: "borderBottomRightRadius"
              }),

              borderColor: `${styleBorderColor({
                v,
                device: "desktop",
                state: "hover"
              })}`,

              boxShadow: styleBoxShadow({
                v,
                device: "desktop",
                state: "hover"
              })
            }
          }
        },

        "& .brz-iframe, & .brz-video__cover::before": {
          filter: `brightness(${brightness}%) hue-rotate(${hue}deg) saturate(${saturation}%) contrast(${contrast}%)`
        }
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          maxWidth: `${tabletSize}%`,
          height: !src ? `${tabletHeight}px` : null,

          "& .brz-video-content": {
            borderStyle: styleBorderStyle({
              v,
              device: "tablet",
              state: "normal"
            }),

            borderTopWidth: styleBorderWidth({
              v,
              device: "tablet",
              state: "normal",
              current: "borderTopWidth"
            }),
            borderRightWidth: styleBorderWidth({
              v,
              device: "tablet",
              state: "normal",
              current: "borderRightWidth"
            }),
            borderBottomWidth: styleBorderWidth({
              v,
              device: "tablet",
              state: "normal",
              current: "borderBottomWidth"
            }),
            borderLeftWidth: styleBorderWidth({
              v,
              device: "tablet",
              state: "normal",
              current: "borderLeftWidth"
            }),

            borderTopLeftRadius: styleBorderRadius({
              v,
              device: "tablet",
              state: "normal",
              current: "borderTopLeftRadius"
            }),
            borderTopRightRadius: styleBorderRadius({
              v,
              device: "tablet",
              state: "normal",
              current: "borderTopRightRadius"
            }),
            borderBottomLeftRadius: styleBorderRadius({
              v,
              device: "tablet",
              state: "normal",
              current: "borderBottomLeftRadius"
            }),
            borderBottomRightRadius: styleBorderRadius({
              v,
              device: "tablet",
              state: "normal",
              current: "borderBottomRightRadius"
            }),

            borderColor: `${styleBorderColor({
              v,
              device: "tablet",
              state: "normal"
            })}`,

            boxShadow: styleBoxShadow({ v, device: "tablet", state: "normal" })
          }
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          maxWidth: `${mobileSize}%`,
          height: !src ? `${mobileHeight}px` : null,

          "& .brz-video-content": {
            borderStyle: styleBorderStyle({
              v,
              device: "mobile",
              state: "normal"
            }),
            borderTopWidth: styleBorderWidth({
              v,
              device: "mobile",
              state: "normal",
              current: "borderTopWidth"
            }),
            borderRightWidth: styleBorderWidth({
              v,
              device: "mobile",
              state: "normal",
              current: "borderRightWidth"
            }),
            borderBottomWidth: styleBorderWidth({
              v,
              device: "mobile",
              state: "normal",
              current: "borderBottomWidth"
            }),
            borderLeftWidth: styleBorderWidth({
              v,
              device: "mobile",
              state: "normal",
              current: "borderLeftWidth"
            }),

            borderTopLeftRadius: styleBorderRadius({
              v,
              device: "mobile",
              state: "normal",
              current: "borderTopLeftRadius"
            }),
            borderTopRightRadius: styleBorderRadius({
              v,
              device: "mobile",
              state: "normal",
              current: "borderTopRightRadius"
            }),
            borderBottomLeftRadius: styleBorderRadius({
              v,
              device: "mobile",
              state: "normal",
              current: "borderBottomLeftRadius"
            }),
            borderBottomRightRadius: styleBorderRadius({
              v,
              device: "mobile",
              state: "normal",
              current: "borderBottomRightRadius"
            }),

            borderColor: `${styleBorderColor({
              v,
              device: "mobile",
              state: "normal"
            })}`,

            boxShadow: styleBoxShadow({ v, device: "mobile", state: "normal" })
          }
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-video", glamorClassName, className);
}

export function styleCSSVars(v, props) {
  if (IS_PREVIEW) return;

  const { size, video, ratio, brightness, hue, contrast, saturation } = v;

  const {
    meta: { desktopW, tabletW, mobileW }
  } = props;
  const src = getVideoData(video);

  const height =
    ratio === "16:9"
      ? Math.round((((desktopW / 16) * 9) / 100) * size)
      : Math.round((((desktopW / 4) * 3) / 100) * size);

  const tabletSize = tabletSyncOnChange(v, "size");
  const tabletHeight =
    ratio === "16:9"
      ? Math.round((((tabletW / 16) * 9) / 100) * tabletSize)
      : Math.round((((tabletW / 4) * 3) / 100) * tabletSize);

  const mobileSize = mobileSyncOnChange(v, "size");
  const mobileHeight =
    ratio === "16:9"
      ? Math.round((((mobileW / 16) * 9) / 100) * mobileSize)
      : Math.round((((mobileW / 4) * 3) / 100) * mobileSize);

  return {
    "--backgroundColor": ratio === "4:3" ? "#000" : "transparent",
    "--maxWidth": `${size}%`,
    "--height": !src ? `${height}px` : "auto",

    // Border Style
    "--borderStyle": styleBorderStyle({
      v,
      device: "desktop",
      state: "normal"
    }),

    // Border Width
    "--borderTopWidth": styleBorderWidth({
      v,
      device: "desktop",
      state: "normal",
      current: "borderTopWidth"
    }),
    "--borderRightWidth": styleBorderWidth({
      v,
      device: "desktop",
      state: "normal",
      current: "borderRightWidth"
    }),
    "--borderBottomWidth": styleBorderWidth({
      v,
      device: "desktop",
      state: "normal",
      current: "borderBottomWidth"
    }),
    "--borderLeftWidth": styleBorderWidth({
      v,
      device: "desktop",
      state: "normal",
      current: "borderLeftWidth"
    }),

    // Border Radius
    "--borderTopLeftRadius": styleBorderRadius({
      v,
      device: "desktop",
      state: "normal",
      current: "borderTopLeftRadius"
    }),
    "--borderTopRightRadius": styleBorderRadius({
      v,
      device: "desktop",
      state: "normal",
      current: "borderTopRightRadius"
    }),
    "--borderBottomLeftRadius": styleBorderRadius({
      v,
      device: "desktop",
      state: "normal",
      current: "borderBottomLeftRadius"
    }),
    "--borderBottomRightRadius": styleBorderRadius({
      v,
      device: "desktop",
      state: "normal",
      current: "borderBottomRightRadius"
    }),

    // Border Color
    "--borderColor": styleBorderColor({
      v,
      device: "desktop",
      state: "normal"
    }),

    "--boxShadow": styleBoxShadow({ v, device: "desktop", state: "normal" }),

    //######---Hover---######//

    // Border Style
    "--hoverBorderStyle": styleBorderStyle({
      v,
      device: "desktop",
      state: "hover"
    }),

    // Border Width
    "--hoverBorderTopWidth": styleBorderWidth({
      v,
      device: "desktop",
      state: "hover",
      current: "borderTopWidth"
    }),
    "--hoverBorderRightWidth": styleBorderWidth({
      v,
      device: "desktop",
      state: "hover",
      current: "borderRightWidth"
    }),
    "--hoverBorderBottomWidth": styleBorderWidth({
      v,
      device: "desktop",
      state: "hover",
      current: "borderBottomWidth"
    }),
    "--hoverBorderLeftWidth": styleBorderWidth({
      v,
      device: "desktop",
      state: "hover",
      current: "borderLeftWidth"
    }),

    // Border Radius
    "--hoverBorderTopLeftRadius": styleBorderRadius({
      v,
      device: "desktop",
      state: "hover",
      current: "borderTopLeftRadius"
    }),
    "--hoverBorderTopRightRadius": styleBorderRadius({
      v,
      device: "desktop",
      state: "hover",
      current: "borderTopRightRadius"
    }),
    "--hoverBorderBottomLeftRadius": styleBorderRadius({
      v,
      device: "desktop",
      state: "hover",
      current: "borderBottomLeftRadius"
    }),
    "--hoverBorderBottomRightRadius": styleBorderRadius({
      v,
      device: "desktop",
      state: "hover",
      current: "borderBottomRightRadius"
    }),

    // Border Color
    "--hoverBorderColor": styleBorderColor({
      v,
      device: "desktop",
      state: "hover"
    }),

    // Box Shadow
    "--hoverBoxShadow": styleBoxShadow({
      v,
      device: "desktop",
      state: "hover"
    }),

    // Hover Transition
    "--hoverTransition": styleHoverTransition({ v }),
    "--hoverTransitionProperty": styleHoverTransitionProperty({ v }),

    //####--- Tablet ---####//

    "--tabletMaxWidth": `${tabletSize}%`,
    "--tabletHeight": !src ? `${tabletHeight}px` : "auto",

    // Border Style
    "--tabletBorderStyle": styleBorderStyle({
      v,
      device: "tablet",
      state: "normal"
    }),

    // Border Width
    "--tabletBorderTopWidth": styleBorderWidth({
      v,
      device: "tablet",
      state: "normal",
      current: "borderTopWidth"
    }),
    "--tabletBorderRightWidth": styleBorderWidth({
      v,
      device: "tablet",
      state: "normal",
      current: "borderRightWidth"
    }),
    "--tabletBorderBottomWidth": styleBorderWidth({
      v,
      device: "tablet",
      state: "normal",
      current: "borderBottomWidth"
    }),
    "--tabletBorderLeftWidth": styleBorderWidth({
      v,
      device: "tablet",
      state: "normal",
      current: "borderLeftWidth"
    }),

    // Border Radius
    "--tabletBorderTopLeftRadius": styleBorderRadius({
      v,
      device: "tablet",
      state: "normal",
      current: "borderTopLeftRadius"
    }),
    "--tabletBorderTopRightRadius": styleBorderRadius({
      v,
      device: "tablet",
      state: "normal",
      current: "borderTopRightRadius"
    }),
    "--tabletBorderBottomLeftRadius": styleBorderRadius({
      v,
      device: "tablet",
      state: "normal",
      current: "borderBottomLeftRadius"
    }),
    "--tabletBorderBottomRightRadius": styleBorderRadius({
      v,
      device: "tablet",
      state: "normal",
      current: "borderBottomRightRadius"
    }),

    // Border Color
    "--tabletBorderColor": styleBorderColor({
      v,
      device: "tablet",
      state: "normal"
    }),

    "--tabletBoxShadow": styleBoxShadow({
      v,
      device: "tablet",
      state: "normal"
    }),

    //####--- Mobile ---####//

    "--mobileMaxWidth": `${mobileSize}%`,
    "--mobileHeight": !src ? `${mobileHeight}px` : "auto",

    // Border Style
    "--mobileBorderStyle": styleBorderStyle({
      v,
      device: "mobile",
      state: "normal"
    }),

    // Border Width
    "--mobileBorderTopWidth": styleBorderWidth({
      v,
      device: "mobile",
      state: "normal",
      current: "borderTopWidth"
    }),
    "--mobileBorderRightWidth": styleBorderWidth({
      v,
      device: "mobile",
      state: "normal",
      current: "borderRightWidth"
    }),
    "--mobileBorderBottomWidth": styleBorderWidth({
      v,
      device: "mobile",
      state: "normal",
      current: "borderBottomWidth"
    }),
    "--mobileBorderLeftWidth": styleBorderWidth({
      v,
      device: "mobile",
      state: "normal",
      current: "borderLeftWidth"
    }),

    // Border Radius
    "--mobileBorderTopLeftRadius": styleBorderRadius({
      v,
      device: "mobile",
      state: "normal",
      current: "borderTopLeftRadius"
    }),
    "--mobileBorderTopRightRadius": styleBorderRadius({
      v,
      device: "mobile",
      state: "normal",
      current: "borderTopRightRadius"
    }),
    "--mobileBorderBottomLeftRadius": styleBorderRadius({
      v,
      device: "mobile",
      state: "normal",
      current: "borderBottomLeftRadius"
    }),
    "--mobileBorderBottomRightRadius": styleBorderRadius({
      v,
      device: "mobile",
      state: "normal",
      current: "borderBottomRightRadius"
    }),

    // Border Color
    "--mobileBorderColor": styleBorderColor({
      v,
      device: "mobile",
      state: "normal"
    }),

    "--mobileBoxShadow": styleBoxShadow({
      v,
      device: "mobile",
      state: "normal"
    }),

    "--videoFilter": `brightness(${brightness}%) hue-rotate(${hue}deg) saturate(${saturation}%) contrast(${contrast}%)`
  };
}

export function wrapperStyleClassName(v) {
  const { ratio } = v;
  let glamorObj;

  if (IS_EDITOR) {
    return css({
      paddingTop: "var(--paddingTop)",
      pointerEvents: "var(--pointerEvents)",

      "& .brz-video__cover::before": {
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
      hoverBgColorOpacity
    } = v;

    const videoCoverCss = coverImageSrc
      ? {
          "& .brz-video__cover::before": {
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
          backgroundColor: styleBgColor({
            v,
            device: "desktop",
            state: "normal"
          })
        },
        "& .brz-video__cover:hover .brz-video__cover-icon": {
          backgroundColor: styleBgColor({
            v,
            device: "desktop",
            state: "hover"
          })
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
    iconSizeHeight
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
    "--iconBgColor": styleBgColor({
      v,
      device: "desktop",
      state: "normal"
    }),
    "--hoverIconBgColor": styleBgColor({
      v,
      device: "desktop",
      state: "hover"
    }),
    "--pointerEvents": "none",
    ...imgSrcCSS
  };
}
