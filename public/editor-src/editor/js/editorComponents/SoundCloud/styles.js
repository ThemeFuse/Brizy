import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import { styleSizeWidthPercent, styleSizeHeightPx } from "visual/utils/style";
import {
  styleBorderStyle,
  styleBorderWidth,
  styleBorderRadius,
  styleBorderColor,
  styleBoxShadow,
  styleHoverTransition,
  styleHoverTransitionProperty
} from "visual/utils/style";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz &": {
        "& .brz-soundCloud-content": {
          overflow: "hidden",
          position: "relative",

          height: "100%",
          width: "100%"
        },

        "& iframe": {
          width: `100%`,
          height: "var(--height)"
        }
      },
      ".brz-ed--desktop &": {
        width: "var(--width)",
        minHeight: "var(--height)",

        "& .brz-soundCloud-content": {
          borderStyle: "var(--borderStyle)",

          borderTopLeftRadius: "var(--borderTopLeftRadius)",
          borderTopRightRadius: "var(--borderTopRightRadius)",
          borderBottomLeftRadius: "var(--borderBottomLeftRadius)",
          borderBottomRightRadius: "var(--borderBottomRightRadius)",

          borderTopWidth: "var(--borderTopWidth)",
          borderRightWidth: "var(--borderRightWidth)",
          borderBottomWidth: "var(--borderBottomWidth)",
          borderLeftWidth: "var(--borderLeftWidth)",

          borderColor: "var(--borderColor)",

          boxShadow: "var(--boxShadow)",

          transition: "var(--hoverTransition)",
          transitionProperty: "var(--hoverTransitionProperty)",

          ":hover": {
            borderStyle: "var(--hoverBorderStyle)",

            borderTopLeftRadius: "var(--hoverBorderTopLeftRadius)",
            borderTopRightRadius: "var(--hoverBorderTopRightRadius)",
            borderBottomLeftRadius: "var(--hoverBorderBottomLeftRadius)",
            borderBottomRightRadius: "var(--hoverBorderBottomRightRadius)",

            borderTopWidth: "var(--hoverBorderTopWidth)",
            borderRightWidth: "var(--hoverBorderRightWidth)",
            borderBottomWidth: "var(--hoverBorderBottomWidth)",
            borderLeftWidth: "var(--hoverBorderLeftWidth)",

            borderColor: "var(--hoverBorderColor)",

            boxShadow: "var(--hoverBoxShadow)"
          }
        }
      },
      ".brz-ed--tablet &": {
        width: "var(--tabletWidth)",
        minHeight: "var(--tabletHeight)",

        "& .brz-soundCloud-content": {
          borderStyle: "var(--tabletBorderStyle)",

          borderTopLeftRadius: "var(--tabletBorderTopLeftRadius)",
          borderTopRightRadius: "var(--tabletBorderTopRightRadius)",
          borderBottomLeftRadius: "var(--tabletBorderBottomLeftRadius)",
          borderBottomRightRadius: "var(--tabletBorderBottomRightRadius)",

          borderTopWidth: "var(--tabletBorderTopWidth)",
          borderRightWidth: "var(--tabletBorderRightWidth)",
          borderBottomWidth: "var(--tabletBorderBottomWidth)",
          borderLeftWidth: "var(--tabletBorderLeftWidth)",

          borderColor: "var(--tabletBorderColor)",
          boxShadow: "var(--tabletBoxShadow)"
        },

        "& iframe": {
          height: "var(--tabletHeight)"
        }
      },
      ".brz-ed--mobile &": {
        width: "var(--mobileWidth)",
        minHeight: "var(--mobileHeight)",

        "& .brz-soundCloud-content": {
          borderStyle: "var(--mobileBorderStyle)",

          borderTopLeftRadius: "var(--mobileBorderTopLeftRadius)",
          borderTopRightRadius: "var(--mobileBorderTopRightRadius)",
          borderBottomLeftRadius: "var(--mobileBorderBottomLeftRadius)",
          borderBottomRightRadius: "var(--mobileBorderBottomRightRadius)",

          borderTopWidth: "var(--mobileBorderTopWidth)",
          borderRightWidth: "var(--mobileBorderRightWidth)",
          borderBottomWidth: "var(--mobileBorderBottomWidth)",
          borderLeftWidth: "var(--mobileBorderLeftWidth)",

          borderColor: "var(--mobileBorderColor)",

          boxShadow: "var(--mobileBoxShadow)"
        },

        "& iframe": {
          height: "var(--mobileHeight)"
        }
      }
    };
  } else {
    const { url, width, height } = v;

    glamorObj = {
      ".brz &": {
        width: `${width}%`,
        minHeight: !url ? `${height}px` : null,

        "& .brz-soundCloud-content": {
          overflow: "hidden",

          position: "relative",

          height: "100%",
          width: "100%",

          borderStyle: styleBorderStyle({ v, device: "desktop" }),

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

          borderColor: styleBorderColor({
            v,
            device: "desktop",
            state: "normal"
          }),

          boxShadow: styleBoxShadow({ v, device: "desktop", state: "normal" })
        },

        "@media (min-width: 991px)": {
          "& .brz-soundCloud-content": {
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
              borderColor: styleBorderColor({
                v,
                device: "desktop",
                state: "hover"
              }),
              boxShadow: styleBoxShadow({
                v,
                device: "desktop",
                state: "hover"
              })
            }
          }
        },

        "& iframe": {
          width: `100%`,
          height: `${height}px`
        }
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          width: `${tabletSyncOnChange(v, "width")}%`,
          minHeight: !url ? `${tabletSyncOnChange(v, "height")}px` : null,

          "& .brz-soundCloud-content": {
            borderStyle: styleBorderStyle({ v, device: "tablet" }),

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

            borderColor: styleBorderColor({
              v,
              device: "tablet",
              state: "normal"
            }),
            boxShadow: styleBoxShadow({ v, device: "tablet", state: "normal" })
          },

          "& iframe": {
            height: `${tabletSyncOnChange(v, "height")}px`
          }
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          width: `${mobileSyncOnChange(v, "width")}%`,
          minHeight: !url ? `${mobileSyncOnChange(v, "height")}px` : null,

          "& .brz-soundCloud-content": {
            borderStyle: styleBorderStyle({ v, device: "mobile" }),

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

            borderColor: styleBorderColor({
              v,
              device: "mobile",
              state: "normal"
            }),

            boxShadow: styleBoxShadow({ v, device: "mobile", state: "normal" })
          },

          "& iframe": {
            height: `${mobileSyncOnChange(v, "height")}px`
          }
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-soundcloud", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  return {
    /* ######### DESKTOP NORMAL ######### */

    "--width": styleSizeWidthPercent({ v, device: "desktop" }),
    "--height": styleSizeHeightPx({ v, device: "desktop" }),

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

    // Box Shadow
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

    /* ######### TABLET NORMAL ######### */

    "--tabletWidth": styleSizeWidthPercent({ v, device: "tablet" }),
    "--tabletHeight": styleSizeHeightPx({ v, device: "tablet" }),

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

    // Box Shadow
    "--tabletBoxShadow": styleBoxShadow({
      v,
      device: "tablet",
      state: "normal"
    }),

    /* ######### MOBILE NORMAL ######### */

    "--mobileWidth": styleSizeWidthPercent({ v, device: "mobile" }),
    "--mobileHeight": styleSizeHeightPx({ v, device: "mobile" }),

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

    // Box Shadow
    "--mobileBoxShadow": styleBoxShadow({
      v,
      device: "mobile",
      state: "normal"
    })
  };
}
