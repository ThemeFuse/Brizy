import classnames from "classnames";
import { css } from "glamor";
import {
  styleMediaBg,
  styleBgImage,
  styleExportBgImage,
  styleBgPositionX,
  styleBgPositionY,
  styleBorderStyle,
  styleBorderWidth,
  styleBorderRadius,
  styleBgColor,
  styleBgGradient,
  styleBorderColor,
  styleHoverTransition,
  styleHoverTransitionProperty,
  styleSizeSizePercent,
  styleElementColumnMinHeight,
  styleAlignVerticalAlign,
  stylePadding,
  styleMargin,
  styleBoxShadow,
  styleShowOnDesktopFilter,
  styleShowOnDesktopOpacity,
  styleShowOnTabletFilter,
  styleShowOnTabletOpacity,
  styleShowOnMobileFilter,
  styleShowOnMobileOpacity,
  styleDisplayShowOnDesktop,
  styleDisplayShowOnTablet,
  styleDisplayShowOnMobile,
  styleReverseColumnsRow,
  styleReverseColumnsWrap,
  styleReverseColumnsJustify,
  styleZIndex
} from "visual/utils/style";

export function bgStyleClassName(v) {
  const { customClassName } = v;

  let glamorObj;
  if (IS_EDITOR) {
    glamorObj = {
      zIndex: "var(--zIndex)",

      ".brz-ed--desktop &": {
        alignItems: "var(--verticalAlign)",

        maxWidth: "var(--maxWidth)",

        minHeight: "var(--minHeight) !important",

        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "var(--marginTop)",
        marginBottom: "var(--marginBottom)",

        filter: "var(--filter)",
        opacity: "var(--opacity)",

        "> .brz-bg-media": {
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
          transitionProperty: "var(--hoverTransitionProperty)"
        },
        ":hover > .brz-bg-media": {
          borderStyle: "var(--hoverBorderStyle)",

          borderTopWidth: "var(--hoverBorderTopWidth)",
          borderRightWidth: "var(--hoverBorderRightWidth)",
          borderBottomWidth: "var(--hoverBorderBottomWidth)",
          borderLeftWidth: "var(--hoverBorderLeftWidth)",

          borderTopLeftRadius: "var(--hoverBorderTopLeftRadius)",
          borderTopRightRadius: "var(--hoverBorderTopRightRadius)",
          borderBottomLeftRadius: "var(--hoverBorderBottomLeftRadius)",
          borderBottomRightRadius: "var(--hoverBorderBottomRightRadius)",

          boxShadow: "var(--hoverBoxShadow)",

          borderColor: "var(--hoverBorderColor)"
        },
        "> .brz-bg-content": {
          borderStyle: "solid",

          borderTopWidth: "var(--borderTopWidth)",
          borderRightWidth: "var(--borderRightWidth)",
          borderBottomWidth: "var(--borderBottomWidth)",
          borderLeftWidth: "var(--borderLeftWidth)",

          borderColor: "transparent",

          transition: "var(--hoverTransition)",
          transitionProperty: "var(--hoverTransitionProperty)"
        },
        ":hover > .brz-bg-content": {
          borderTopWidth: "var(--hoverBorderTopWidth)",
          borderRightWidth: "var(--hoverBorderRightWidth)",
          borderBottomWidth: "var(--hoverBorderBottomWidth)",
          borderLeftWidth: "var(--hoverBorderLeftWidth)"
        },

        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--backgroundImage)",
          backgroundPositionX: "var(--backgroundPositionX)",
          backgroundPositionY: "var(--backgroundPositionY)",

          transition: "var(--hoverTransition)",
          transitionProperty: "var(--hoverTransitionProperty)"
        },
        ":hover > .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--hoverBackgroundImage)",
          backgroundPositionX: "var(--hoverBackgroundPositionX)",
          backgroundPositionY: "var(--hoverBackgroundPositionY)"
        },

        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--backgroundColor)",

          backgroundImage: "var(--backgroundGradient)",

          transition: "var(--hoverTransition)",
          transitionProperty: "var(--hoverTransitionProperty)"
        },
        ":hover > .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--hoverBackgroundColor)",

          backgroundImage: "var(--hoverBackgroundGradient)"
        },

        "> .brz-bg-media > .brz-bg-map": {
          display: "var(--mediaBg)"
        }
      },
      ".brz-ed--tablet &": {
        filter: "var(--tabletFilter)",
        opacity: "var(--tabletOpacity)",

        marginTop: "var(--tabletMarginTop)",
        marginBottom: "var(--tabletMarginBottom)",

        "> .brz-bg-content": {
          borderStyle: "var(--tabletBorderStyle)",

          borderTopWidth: "var(--tabletBorderTopWidth)",
          borderRightWidth: "var(--tabletBorderRightWidth)",
          borderBottomWidth: "var(--tabletBorderBottomWidth)",
          borderLeftWidth: "var(--tabletBorderLeftWidth)",

          borderColor: "transparent"
        },

        "> .brz-bg-media": {
          borderStyle: "var(--tabletBorderStyle)",

          borderTopWidth: "var(--tabletBorderTopWidth)",
          borderRightWidth: "var(--tabletBorderRightWidth)",
          borderBottomWidth: "var(--tabletBorderBottomWidth)",
          borderLeftWidth: "var(--tabletBorderLeftWidth)",

          borderTopLeftRadius: "var(--tabletBorderTopLeftRadius)",
          borderTopRightRadius: "var(--tabletBorderTopRightRadius)",
          borderBottomLeftRadius: "var(--tabletBorderBottomLeftRadius)",
          borderBottomRightRadius: "var(--tabletBorderBottomRightRadius)",

          boxShadow: "var(--tabletBoxShadow)",

          borderColor: "var(--tabletBorderColor)"
        },

        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--tabletBackgroundImage)",
          backgroundPositionX: "var(--tabletBackgroundPositionX)",
          backgroundPositionY: "var(--tabletBackgroundPositionY)"
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--tabletBackgroundColor)",

          backgroundImage: "var(--tabletBackgroundGradient)"
        },
        "> .brz-bg-media > .brz-bg-map": {
          display: "var(--tabletMediaBg)"
        },
        "> .brz-bg-content > .brz-row": {
          flexDirection: "var(--tabletReverseColumns)",
          flexWrap: "var(--tabletReverseColumnsWrap)",
          justifyContent: "var(--tabletReverseColumnsJustify)"
        }
      },
      ".brz-ed--mobile &": {
        filter: "var(--mobileFilter)",
        opacity: "var(--mobileOpacity)",

        marginTop: "var(--mobileMarginTop)",
        marginBottom: "var(--mobileMarginBottom)",

        "> .brz-bg-content": {
          borderStyle: "var(--mobileBorderStyle)",

          borderTopWidth: "var(--mobileBorderTopWidth)",
          borderRightWidth: "var(--mobileBorderRightWidth)",
          borderBottomWidth: "var(--mobileBorderBottomWidth)",
          borderLeftWidth: "var(--mobileBorderLeftWidth)",

          borderColor: "transparent"
        },

        "> .brz-bg-media": {
          borderStyle: "var(--mobileBorderStyle)",

          borderTopWidth: "var(--mobileBorderTopWidth)",
          borderRightWidth: "var(--mobileBorderRightWidth)",
          borderBottomWidth: "var(--mobileBorderBottomWidth)",
          borderLeftWidth: "var(--mobileBorderLeftWidth)",

          borderTopLeftRadius: "var(--mobileBorderTopLeftRadius)",
          borderTopRightRadius: "var(--mobileBorderTopRightRadius)",
          borderBottomLeftRadius: "var(--mobileBorderBottomLeftRadius)",
          borderBottomRightRadius: "var(--mobileBorderBottomRightRadius)",

          boxShadow: "var(--mobileBoxShadow)",

          borderColor: "var(--mobileBorderColor)"
        },

        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--mobileBackgroundImage)",
          backgroundPositionX: "var(--mobileBackgroundPositionX)",
          backgroundPositionY: "var(--mobileBackgroundPositionY)"
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--mobileBackgroundColor)",

          backgroundImage: "var(--mobileBackgroundGradient)"
        },
        "> .brz-bg-media > .brz-bg-map": {
          display: "var(--mobileMediaBg)"
        },
        "> .brz-bg-content > .brz-row": {
          flexDirection: "var(--mobileReverseColumns)",
          flexWrap: "var(--mobileReverseColumnsWrap)",
          justifyContent: "var(--mobileReverseColumnsJustify)"
        }
      }
    };
  } else {
    glamorObj = {
      // zIndex
      zIndex: styleZIndex({ v }),

      // Margin
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: styleMargin({
        v,
        device: "desktop",
        state: "normal",
        current: "marginTop"
      }),
      marginBottom: styleMargin({
        v,
        device: "desktop",
        state: "normal",
        current: "marginBottom"
      }),
      "> .brz-bg-content": {
        // Border Style
        borderStyle: styleBorderStyle({
          v,
          device: "desktop",
          state: "normal"
        }),

        // Border Width
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

        // Border Color
        borderColor: "transparent"
      },
      "> .brz-bg-media": {
        // Border Style
        borderStyle: styleBorderStyle({
          v,
          device: "desktop",
          state: "normal"
        }),

        // Border Width
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

        // Border Radius
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

        // Border Color
        borderColor: styleBorderColor({
          v,
          device: "desktop",
          state: "normal"
        }),

        // Box Shadow
        boxShadow: styleBoxShadow({ v, device: "desktop", state: "normal" })
      },
      "> .brz-bg-media > .brz-bg-image": {
        // BG Image
        backgroundImage: styleExportBgImage({
          v,
          device: "desktop",
          state: "normal"
        }),
        backgroundPosition: `${styleBgPositionX({
          v,
          device: "desktop",
          state: "normal"
        })} ${styleBgPositionY({
          v,
          device: "desktop",
          state: "normal"
        })}`
      },
      "> .brz-bg-media > .brz-bg-color": {
        // BG Color
        backgroundColor: styleBgColor({
          v,
          device: "desktop",
          state: "normal"
        }),

        // BG Gradient
        backgroundImage: styleBgGradient({
          v,
          device: "desktop",
          state: "normal"
        })
      },
      "> .brz-bg-media > .brz-bg-map": {
        display: styleMediaBg({ v, device: "mobile" })
      },
      "@media (min-width: 991px)": {
        //Transition
        "> .brz-bg-content": {
          // Hover Transition
          transition: styleHoverTransition({ v }),
          transitionProperty: styleHoverTransitionProperty()
        },
        "> .brz-bg-media": {
          // Hover Transition
          transition: styleHoverTransition({ v }),
          transitionProperty: styleHoverTransitionProperty()
        },
        "> .brz-bg-media > .brz-bg-image": {
          // Hover Transition
          transition: styleHoverTransition({ v }),
          transitionProperty: styleHoverTransitionProperty()
        },
        "> .brz-bg-media > .brz-bg-color": {
          // Hover Transition
          transition: styleHoverTransition({ v }),
          transitionProperty: styleHoverTransitionProperty()
        },
        ":hover > .brz-bg-content": {
          // Border Style
          borderStyle: styleBorderStyle({
            v,
            device: "desktop",
            state: "hover"
          }),

          // Border Width
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
          })
        },
        ":hover > .brz-bg-media": {
          // Border Style
          borderStyle: styleBorderStyle({
            v,
            device: "desktop",
            state: "hover"
          }),

          // Border Width
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

          // Border Radius
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

          // Border Color
          borderColor: styleBorderColor({
            v,
            device: "desktop",
            state: "hover"
          }),

          // Box Shadow
          boxShadow: styleBoxShadow({ v, device: "desktop", state: "hover" })
        },
        ":hover > .brz-bg-media > .brz-bg-image": {
          // BG Image
          backgroundImage: styleExportBgImage({
            v,
            device: "desktop",
            state: "hover"
          }),
          backgroundPosition: `${styleBgPositionX({
            v,
            device: "desktop",
            state: "hover"
          })} ${styleBgPositionY({
            v,
            device: "desktop",
            state: "hover"
          })}`
        },
        ":hover > .brz-bg-media > .brz-bg-color": {
          // BG Color
          backgroundColor: styleBgColor({
            v,
            device: "desktop",
            state: "hover"
          }),

          // BG Gradient
          backgroundImage: styleBgGradient({
            v,
            device: "desktop",
            state: "hover"
          })
        }
      },
      "@media (max-width: 991px)": {
        // Margin
        marginTop: styleMargin({
          v,
          device: "tablet",
          state: "normal",
          current: "marginTop"
        }),
        marginBottom: styleMargin({
          v,
          device: "tablet",
          state: "normal",
          current: "marginBottom"
        }),
        "> .brz-bg-content": {
          // Border Style
          borderStyle: styleBorderStyle({
            v,
            device: "tablet",
            state: "normal"
          }),

          // Border Width
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

          // Border Color
          borderColor: "transparent"
        },
        "> .brz-bg-media": {
          // Border Style
          borderStyle: styleBorderStyle({
            v,
            device: "tablet",
            state: "normal"
          }),

          // Border Width
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

          // Border Radius
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

          // Border Color
          borderColor: styleBorderColor({
            v,
            device: "tablet",
            state: "normal"
          }),

          // Box Shadow
          boxShadow: styleBoxShadow({ v, device: "tablet", state: "normal" })
        },
        "> .brz-bg-media > .brz-bg-image": {
          // BG Image
          backgroundImage: styleExportBgImage({
            v,
            device: "tablet",
            state: "normal"
          }),
          backgroundPosition: `${styleBgPositionX({
            v,
            device: "tablet",
            state: "normal"
          })} ${styleBgPositionY({
            v,
            device: "tablet",
            state: "normal"
          })}`
        },
        "> .brz-bg-media > .brz-bg-color": {
          // BG Color
          backgroundColor: styleBgColor({
            v,
            device: "tablet",
            state: "normal"
          }),

          // BG Gradient
          backgroundImage: styleBgGradient({
            v,
            device: "tablet",
            state: "normal"
          })
        },
        "> .brz-bg-media > .brz-bg-map": {
          display: styleMediaBg({ v, device: "tablet" })
        }
      },
      "@media (max-width: 991px) and (min-width: 768px)": {
        ".brz &": {
          // Display
          display: styleDisplayShowOnTablet({ v })
        },
        "> .brz-bg-content > .brz-row": {
          flexDirection: styleReverseColumnsRow({ v, device: "tablet" }),
          flexWrap: styleReverseColumnsWrap({
            v,
            device: "tablet"
          }),
          justifyContent: styleReverseColumnsJustify({
            v,
            device: "tablet"
          })
        }
      },
      "@media (max-width: 767px)": {
        // Margin
        marginTop: styleMargin({
          v,
          device: "mobile",
          state: "normal",
          current: "marginTop"
        }),
        marginBottom: styleMargin({
          v,
          device: "mobile",
          state: "normal",
          current: "marginBottom"
        }),

        ".brz &": {
          // Display
          display: styleDisplayShowOnMobile({ v })
        },

        "> .brz-bg-content": {
          // Border Style
          borderStyle: styleBorderStyle({
            v,
            device: "mobile",
            state: "normal"
          }),

          // Border Width
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

          // Border Color
          borderColor: "transparent"
        },
        "> .brz-bg-media": {
          // Border Style
          borderStyle: styleBorderStyle({
            v,
            device: "mobile",
            state: "normal"
          }),

          // Border Width
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

          // Border Radius
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

          // Border Color
          borderColor: styleBorderColor({
            v,
            device: "mobile",
            state: "normal"
          }),

          // Box Shadow
          boxShadow: styleBoxShadow({ v, device: "mobile", state: "normal" })
        },
        "> .brz-bg-media > .brz-bg-image": {
          // BG Image
          backgroundImage: styleExportBgImage({
            v,
            device: "mobile",
            state: "normal"
          }),

          backgroundPosition: `${styleBgPositionX({
            v,
            device: "mobile",
            state: "normal"
          })} ${styleBgPositionY({
            v,
            device: "mobile",
            state: "normal"
          })}`
        },
        "> .brz-bg-media > .brz-bg-color": {
          // BG Color
          backgroundColor: styleBgColor({
            v,
            device: "mobile",
            state: "normal"
          }),

          // BG Gradient
          backgroundImage: styleBgGradient({
            v,
            device: "mobile",
            state: "normal"
          })
        },
        "> .brz-bg-media > .brz-bg-map": {
          display: styleMediaBg({ v, device: "mobile" })
        },
        "> .brz-bg-content > .brz-row": {
          flexDirection: styleReverseColumnsRow({ v, device: "mobile" }),
          flexWrap: styleReverseColumnsWrap({
            v,
            device: "mobile"
          }),
          justifyContent: styleReverseColumnsJustify({
            v,
            device: "mobile"
          })
        }
      },
      "@media (min-width: 992px)": {
        ".brz &": {
          // Max Width
          maxWidth: styleSizeSizePercent({ v, device: "desktop" }),

          // Min Height
          minHeight: styleElementColumnMinHeight({ v, device: "desktop" }),

          // Vertical Align
          alignItems: styleAlignVerticalAlign({ v, device: "desktop" }),

          // Display
          display: styleDisplayShowOnDesktop({ v })
        }
      }
    };
  }
  const glamorClassName = String(css(glamorObj));
  return classnames(
    "brz-d-xs-flex",
    "brz-flex-xs-wrap",
    customClassName,
    glamorClassName
  );
}

export function bgStyleCSSVars(v) {
  if (IS_PREVIEW) return null;

  return {
    /* ######### DESKTOP NORMAL ######### */

    // Media BG
    "--mediaBg": styleMediaBg({ v, device: "desktop" }),

    // BG Image
    "--backgroundImage": styleBgImage({
      v,
      device: "desktop",
      state: "normal"
    }),
    "--backgroundPositionX": styleBgPositionX({
      v,
      device: "desktop",
      state: "normal"
    }),
    "--backgroundPositionY": styleBgPositionY({
      v,
      device: "desktop",
      state: "normal"
    }),

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

    // BG Color
    "--backgroundColor": styleBgColor({
      v,
      device: "desktop",
      state: "normal"
    }),

    // BG Gradient
    "--backgroundGradient": styleBgGradient({
      v,
      device: "desktop",
      state: "normal"
    }),

    // Border Color
    "--borderColor": styleBorderColor({
      v,
      device: "desktop",
      state: "normal"
    }),

    // Max Width
    "--maxWidth": styleSizeSizePercent({ v, device: "desktop" }),

    // Min Height
    "--minHeight": styleElementColumnMinHeight({ v, device: "desktop" }),

    // Vertical Align
    "--verticalAlign": styleAlignVerticalAlign({ v, device: "desktop" }),

    // Margin
    "--marginTop": styleMargin({
      v,
      device: "desktop",
      state: "normal",
      current: "marginTop"
    }),
    "--marginBottom": styleMargin({
      v,
      device: "desktop",
      state: "normal",
      current: "marginBottom"
    }),

    // Box Shadow
    "--boxShadow": styleBoxShadow({ v, device: "desktop", state: "normal" }),

    // Display on Devices
    "--filter": styleShowOnDesktopFilter({ v }),
    "--opacity": styleShowOnDesktopOpacity({ v }),

    // z Index
    "--zIndex": styleZIndex({ v }),

    /* ######### DESKTOP HOVER ######### */

    // BG Image
    "--hoverBackgroundImage": styleBgImage({
      v,
      device: "desktop",
      state: "hover"
    }),
    "--hoverBackgroundPositionX": styleBgPositionX({
      v,
      device: "desktop",
      state: "hover"
    }),
    "--hoverBackgroundPositionY": styleBgPositionY({
      v,
      device: "desktop",
      state: "hover"
    }),

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

    // BG Color
    "--hoverBackgroundColor": styleBgColor({
      v,
      device: "desktop",
      state: "hover"
    }),

    // BG Gradient
    "--hoverBackgroundGradient": styleBgGradient({
      v,
      device: "desktop",
      state: "hover"
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

    // Display on Devices
    "--tabletFilter": styleShowOnTabletFilter({ v }),
    "--tabletOpacity": styleShowOnTabletOpacity({ v }),

    // Media BG
    "--tabletMediaBg": styleMediaBg({ v, device: "tablet" }),

    // BG Image
    "--tabletBackgroundImage": styleBgImage({
      v,
      device: "tablet",
      state: "normal"
    }),

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

    "--tabletBackgroundPositionX": styleBgPositionX({
      v,
      device: "tablet",
      state: "normal"
    }),
    "--tabletBackgroundPositionY": styleBgPositionY({
      v,
      device: "tablet",
      state: "normal"
    }),

    // BG Color
    "--tabletBackgroundColor": styleBgColor({
      v,
      device: "tablet",
      state: "normal"
    }),

    // BG Gradient
    "--tabletBackgroundGradient": styleBgGradient({
      v,
      device: "tablet",
      state: "normal"
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

    // Margin
    "--tabletMarginTop": styleMargin({
      v,
      device: "tablet",
      state: "normal",
      current: "marginTop"
    }),
    "--tabletMarginBottom": styleMargin({
      v,
      device: "tablet",
      state: "normal",
      current: "marginBottom"
    }),

    /* ######### MOBILE NORMAL ######### */

    // Display on Devices
    "--mobileFilter": styleShowOnMobileFilter({ v }),
    "--mobileOpacity": styleShowOnMobileOpacity({ v }),

    // Media BG
    "--mobileMediaBg": styleMediaBg({ v, device: "mobile" }),

    // BG Image
    "--mobileBackgroundImage": styleBgImage({
      v,
      device: "mobile",
      state: "normal"
    }),
    "--mobileBackgroundPositionX": styleBgPositionX({
      v,
      device: "mobile",
      state: "normal"
    }),
    "--mobileBackgroundPositionY": styleBgPositionY({
      v,
      device: "mobile",
      state: "normal"
    }),

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

    // BG Color
    "--mobileBackgroundColor": styleBgColor({
      v,
      device: "mobile",
      state: "normal"
    }),

    // BG Gradient
    "--mobileBackgroundGradient": styleBgGradient({
      v,
      device: "mobile",
      state: "normal"
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
    }),

    // Margin
    "--mobileMarginTop": styleMargin({
      v,
      device: "mobile",
      state: "normal",
      current: "marginTop"
    }),
    "--mobileMarginBottom": styleMargin({
      v,
      device: "mobile",
      state: "normal",
      current: "marginBottom"
    })
  };
}

export function containerStyleClassName(v, isInnerRow) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        paddingTop: "var(--paddingTop)",
        paddingRight: "var(--paddingRight)",
        paddingBottom: "var(--paddingBottom)",
        paddingLeft: "var(--paddingLeft)"
      },
      ".brz-ed--tablet &": {
        paddingTop: "var(--tabletPaddingTop)",
        paddingRight: "var(--tabletPaddingRight)",
        paddingBottom: "var(--tabletPaddingBottom)",
        paddingLeft: "var(--tabletPaddingLeft)"
      },
      ".brz-ed--mobile &": {
        paddingTop: "var(--mobilePaddingTop)",
        paddingRight: "var(--mobilePaddingRight)",
        paddingBottom: "var(--mobilePaddingBottom)",
        paddingLeft: "var(--mobilePaddingLeft)"
      }
    };
  } else {
    glamorObj = {
      // Padding
      paddingTop: stylePadding({
        v,
        device: "desktop",
        state: "normal",
        current: "paddingTop"
      }),
      paddingRight: stylePadding({
        v,
        device: "desktop",
        state: "normal",
        current: "paddingRight"
      }),
      paddingBottom: stylePadding({
        v,
        device: "desktop",
        state: "normal",
        current: "paddingBottom"
      }),
      paddingLeft: stylePadding({
        v,
        device: "desktop",
        state: "normal",
        current: "paddingLeft"
      }),

      "@media (max-width: 991px)": {
        // Padding
        paddingTop: stylePadding({
          v,
          device: "tablet",
          state: "normal",
          current: "paddingTop"
        }),
        paddingRight: stylePadding({
          v,
          device: "tablet",
          state: "normal",
          current: "paddingRight"
        }),
        paddingBottom: stylePadding({
          v,
          device: "tablet",
          state: "normal",
          current: "paddingBottom"
        }),
        paddingLeft: stylePadding({
          v,
          device: "tablet",
          state: "normal",
          current: "paddingLeft"
        })
      },

      "@media (max-width: 767px)": {
        // Padding
        paddingTop: stylePadding({
          v,
          device: "mobile",
          state: "normal",
          current: "paddingTop"
        }),
        paddingRight: stylePadding({
          v,
          device: "mobile",
          state: "normal",
          current: "paddingRight"
        }),
        paddingBottom: stylePadding({
          v,
          device: "mobile",
          state: "normal",
          current: "paddingBottom"
        }),
        paddingLeft: stylePadding({
          v,
          device: "mobile",
          state: "normal",
          current: "paddingLeft"
        })
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames(
    "brz-row",
    { "brz-row--inner": isInnerRow },
    className,
    glamorClassName
  );
}

export function containerStyleCSSVars(v, isInnerRow) {
  if (IS_PREVIEW) return;

  return {
    "--paddingTop": stylePadding({
      v,
      device: "desktop",
      state: "normal",
      current: "paddingTop"
    }),
    "--paddingRight": stylePadding({
      v,
      device: "desktop",
      state: "normal",
      current: "paddingRight"
    }),
    "--paddingBottom": stylePadding({
      v,
      device: "desktop",
      state: "normal",
      current: "paddingBottom"
    }),
    "--paddingLeft": stylePadding({
      v,
      device: "desktop",
      state: "normal",
      current: "paddingLeft"
    }),

    // Tablet
    "--tabletReverseColumns": styleReverseColumnsRow({ v, device: "tablet" }),
    "--tabletReverseColumnsWrap": styleReverseColumnsWrap({
      v,
      device: "tablet"
    }),
    "--tabletReverseColumnsJustify": styleReverseColumnsJustify({
      v,
      device: "tablet"
    }),
    "--tabletPaddingTop": stylePadding({
      v,
      device: "tablet",
      state: "normal",
      current: "paddingTop"
    }),
    "--tabletPaddingRight": stylePadding({
      v,
      device: "tablet",
      state: "normal",
      current: "paddingRight"
    }),
    "--tabletPaddingBottom": stylePadding({
      v,
      device: "tablet",
      state: "normal",
      current: "paddingBottom"
    }),
    "--tabletPaddingLeft": stylePadding({
      v,
      device: "tablet",
      state: "normal",
      current: "paddingLeft"
    }),

    // Mobile
    "--mobileReverseColumns": styleReverseColumnsRow({ v, device: "mobile" }),
    "--mobileReverseColumnsWrap": styleReverseColumnsWrap({
      v,
      device: "mobile"
    }),
    "--mobileReverseColumnsJustify": styleReverseColumnsJustify({
      v,
      device: "mobile"
    }),
    "--mobilePaddingTop": stylePadding({
      v,
      device: "mobile",
      state: "normal",
      current: "paddingTop"
    }),
    "--mobilePaddingRight": stylePadding({
      v,
      device: "mobile",
      state: "normal",
      current: "paddingRight"
    }),
    "--mobilePaddingBottom": stylePadding({
      v,
      device: "mobile",
      state: "normal",
      current: "paddingBottom"
    }),
    "--mobilePaddingLeft": stylePadding({
      v,
      device: "mobile",
      state: "normal",
      current: "paddingLeft"
    })
  };
}

export function styleClassName(v) {
  const { className } = v;

  let glamorObj;

  if (!IS_EDITOR) {
    glamorObj = {
      position: "relative",

      "& .brz-link-container": {
        position: "absolute",
        height: "100%",
        width: "100%",
        top: "0",
        left: "0"
      }
    };
  }

  const glamorClassName = String(css(glamorObj || {}));

  return classnames("brz-row__container", glamorClassName, className);
}
