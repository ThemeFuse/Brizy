import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange } from "visual/utils/onChange";
import {
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
  styleAlignVerticalAlign,
  stylePadding,
  styleMargin,
  styleBoxShadow,
  styleSizeWidthPercent,
  styleShowOnDesktopFilter,
  styleShowOnDesktopOpacity,
  styleShowOnTabletFilter,
  styleShowOnTabletOpacity,
  styleShowOnMobileFilter,
  styleShowOnMobileOpacity,
  styleDisplayShowOnDesktop,
  styleDisplayShowOnTablet,
  styleDisplayShowOnMobile,
  styleZIndex
} from "visual/utils/style";

export function bgStyleClassName(v, props) {
  const { customClassName, items } = v;
  const hasItems = items.length >= 1;

  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      zIndex: "var(--zIndex)",

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
      "&:hover > .brz-bg-media": {
        borderStyle: "var(--hoverBorderStyle)",

        borderTopWidth: "var(--hoverBorderTopWidth)",
        borderRightWidth: "var(--hoverBorderRightWidth)",
        borderBottomWidth: "var(--hoverBorderBottomWidth)",
        borderLeftWidth: "var(--hoverBorderLeftWidth)",

        borderTopLeftRadius: "var(--hoverBorderTopLeftRadius)",
        borderTopRightRadius: "var(--hoverBorderTopRightRadius)",
        borderBottomLeftRadius: "var(--hoverBorderBottomLeftRadius)",
        borderBottomRightRadius: "var(--hoverBorderBottomRightRadius)",

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
      "&:hover > .brz-bg-content": {
        borderTopWidth: "var(--hoverBorderTopWidth)",
        borderRightWidth: "var(--hoverBorderRightWidth)",
        borderBottomWidth: "var(--hoverBorderBottomWidth)",
        borderLeftWidth: "var(--hoverBorderLeftWidth)"
      },

      ".brz-ed--desktop &": {
        alignItems: "var(--verticalAlign)",

        paddingTop: "var(--paddingTop)",
        paddingRight: "var(--paddingRight)",
        paddingBottom: "var(--paddingBottom)",
        paddingLeft: "var(--paddingLeft)",

        marginTop: "var(--marginTop)",
        marginRight: "var(--marginRight)",
        marginBottom: "var(--marginBottom)",
        marginLeft: "var(--marginLeft)",

        filter: "var(--filter)",
        opacity: "var(--opacity)",

        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--backgroundImage)",
          backgroundPositionX: "var(--backgroundPositionX)",
          backgroundPositionY: "var(--backgroundPositionY)",

          transition: "var(--hoverTransition)",
          transitionProperty: "var(--hoverTransitionProperty)"
        },
        "&:hover > .brz-bg-media > .brz-bg-image": {
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
        "&:hover > .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--hoverBackgroundColor)",

          backgroundImage: "var(--hoverBackgroundGradient)"
        }
      },
      ".brz-ed--tablet &": {
        filter: "var(--tabletFilter)",
        opacity: "var(--tabletOpacity)",

        alignItems: "var(--tabletVerticalAlign)",

        marginTop: "var(--tabletMarginTop)",
        marginRight: "var(--tabletMarginRight)",
        marginBottom: "var(--tabletMarginBottom)",
        marginLeft: "var(--tabletMarginLeft)",

        "& > .brz-bg-content": {
          paddingTop: "var(--tabletPaddingTop)",
          paddingRight: "var(--tabletPaddingRight)",
          paddingBottom: "var(--tabletPaddingBottom)",
          paddingLeft: "var(--tabletPaddingLeft)"
        },

        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--tabletBackgroundImage)",
          backgroundPositionX: "var(--tabletBackgroundPositionX)",
          backgroundPositionY: "var(--tabletBackgroundPositionY)"
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--tabletBackgroundColor)",

          backgroundImage: "var(--tabletBackgroundGradient)"
        }
      },
      ".brz-ed--mobile &": {
        filter: "var(--mobileFilter)",
        opacity: "var(--mobileOpacity)",

        marginTop: "var(--mobileMarginTop)",
        marginRight: "var(--mobileMarginRight)",
        marginBottom: "var(--mobileMarginBottom)",
        marginLeft: "var(--mobileMarginLeft)",

        "& > .brz-bg-content": {
          paddingTop: "var(--mobilePaddingTop)",
          paddingRight: "var(--mobilePaddingRight)",
          paddingBottom: "var(--mobilePaddingBottom)",
          paddingLeft: "var(--mobilePaddingLeft)"
        },

        "> .brz-bg-media > .brz-bg-image": {
          backgroundImage: "var(--mobileBackgroundImage)",
          backgroundPositionX: "var(--mobileBackgroundPositionX)",
          backgroundPositionY: "var(--mobileBackgroundPositionY)"
        },
        "> .brz-bg-media > .brz-bg-color": {
          backgroundColor: "var(--mobileBackgroundColor)",

          backgroundImage: "var(--mobileBackgroundGradient)"
        }
      }
    };
  } else {
    glamorObj = {
      // Margin
      marginTop: styleMargin({
        v,
        device: "desktop",
        state: "normal",
        current: "marginTop",
        hasItems
      }),
      marginRight: styleMargin({
        v,
        device: "desktop",
        state: "normal",
        current: "marginRight",
        hasItems
      }),
      marginBottom: styleMargin({
        v,
        device: "desktop",
        state: "normal",
        current: "marginBottom",
        hasItems
      }),
      marginLeft: styleMargin({
        v,
        device: "desktop",
        state: "normal",
        current: "marginLeft",
        hasItems
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
        borderColor: "transparent",

        // Hover Transition
        transition: styleHoverTransition({ v }),
        transitionProperty: styleHoverTransitionProperty(),

        // Padding
        paddingTop: stylePadding({
          v,
          device: "desktop",
          state: "normal",
          current: "paddingTop",
          hasItems
        }),
        paddingRight: stylePadding({
          v,
          device: "desktop",
          state: "normal",
          current: "paddingRight",
          hasItems
        }),
        paddingBottom: stylePadding({
          v,
          device: "desktop",
          state: "normal",
          current: "paddingBottom",
          hasItems
        }),
        paddingLeft: stylePadding({
          v,
          device: "desktop",
          state: "normal",
          current: "paddingLeft",
          hasItems
        })
      },
      "&:hover > .brz-bg-content": {
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

        // Hover Transition
        transition: styleHoverTransition({ v }),
        transitionProperty: styleHoverTransitionProperty(),

        // Box Shadow
        boxShadow: styleBoxShadow({ v, device: "desktop", state: "normal" })
      },
      "&:hover > .brz-bg-media": {
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
        })
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
        })}`,

        // Hover Transition
        transition: styleHoverTransition({ v }),
        transitionProperty: styleHoverTransitionProperty()
      },
      "&:hover > .brz-bg-media > .brz-bg-image": {
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
        }),

        // Hover Transition
        transition: styleHoverTransition({ v }),
        transitionProperty: styleHoverTransitionProperty()
      },
      "&:hover > .brz-bg-media > .brz-bg-color": {
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
      },

      "@media (max-width: 991px)": {
        // Margin
        marginTop: styleMargin({
          v,
          device: "tablet",
          state: "normal",
          current: "marginTop",
          hasItems
        }),
        marginRight: styleMargin({
          v,
          device: "tablet",
          state: "normal",
          current: "marginRight",
          hasItems
        }),
        marginBottom: styleMargin({
          v,
          device: "tablet",
          state: "normal",
          current: "marginBottom",
          hasItems
        }),
        marginLeft: styleMargin({
          v,
          device: "tablet",
          state: "normal",
          current: "marginLeft",
          hasItems
        }),
        "& > .brz-bg-content": {
          // Padding
          paddingTop: stylePadding({
            v,
            device: "tablet",
            state: "normal",
            current: "paddingTop",
            hasItems
          }),
          paddingRight: stylePadding({
            v,
            device: "tablet",
            state: "normal",
            current: "paddingRight",
            hasItems
          }),
          paddingBottom: stylePadding({
            v,
            device: "tablet",
            state: "normal",
            current: "paddingBottom",
            hasItems
          }),
          paddingLeft: stylePadding({
            v,
            device: "tablet",
            state: "normal",
            current: "paddingLeft",
            hasItems
          })
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
        }
      },
      "@media (max-width: 991px) and (min-width: 768px)": {
        ".brz &": {
          // Display
          display: styleDisplayShowOnTablet({ v })
        }
      },
      "@media (max-width: 767px)": {
        // Margin
        marginTop: styleMargin({
          v,
          device: "mobile",
          state: "normal",
          current: "marginTop",
          hasItems
        }),
        marginRight: styleMargin({
          v,
          device: "mobile",
          state: "normal",
          current: "marginRight",
          hasItems
        }),
        marginBottom: styleMargin({
          v,
          device: "mobile",
          state: "normal",
          current: "marginBottom",
          hasItems
        }),
        marginLeft: styleMargin({
          v,
          device: "mobile",
          state: "normal",
          current: "marginLeft",
          hasItems
        }),
        "& > .brz-bg-content": {
          // Padding
          paddingTop: stylePadding({
            v,
            device: "mobile",
            state: "normal",
            current: "paddingTop",
            hasItems
          }),
          paddingRight: stylePadding({
            v,
            device: "mobile",
            state: "normal",
            current: "paddingRight",
            hasItems
          }),
          paddingBottom: stylePadding({
            v,
            device: "mobile",
            state: "normal",
            current: "paddingBottom",
            hasItems
          }),
          paddingLeft: stylePadding({
            v,
            device: "mobile",
            state: "normal",
            current: "paddingLeft",
            hasItems
          })
        },
        ".brz &": {
          // Display
          display: styleDisplayShowOnMobile({ v })
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
        }
      },
      "@media (min-width: 768px)": {
        ".brz &": {
          // Vertical Align
          alignItems: styleAlignVerticalAlign({
            v,
            device: "desktop",
            state: "normal",
            hasItems
          })
        }
      },
      "@media (min-width: 992px)": {
        ".brz &": {
          // Display
          display: styleDisplayShowOnDesktop({ v })
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-d-xs-flex", glamorClassName, customClassName);
}

export function bgStyleCSSVars(v, props) {
  const { items } = v;
  const hasItems = items.length >= 1;

  if (IS_PREVIEW) return;

  return {
    /* ######### DESKTOP NORMAL ######### */

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

    // Vertical Align
    "--verticalAlign": styleAlignVerticalAlign({
      v,
      device: "desktop",
      state: "normal",
      hasItems
    }),

    // Padding
    "--paddingTop": stylePadding({
      v,
      device: "desktop",
      state: "normal",
      current: "paddingTop",
      hasItems
    }),
    "--paddingRight": stylePadding({
      v,
      device: "desktop",
      state: "normal",
      current: "paddingRight",
      hasItems
    }),
    "--paddingBottom": stylePadding({
      v,
      device: "desktop",
      state: "normal",
      current: "paddingBottom",
      hasItems
    }),
    "--paddingLeft": stylePadding({
      v,
      device: "desktop",
      state: "normal",
      current: "paddingLeft",
      hasItems
    }),

    // Margin
    "--marginTop": styleMargin({
      v,
      device: "desktop",
      state: "normal",
      current: "marginTop",
      hasItems
    }),
    "--marginRight": styleMargin({
      v,
      device: "desktop",
      state: "normal",
      current: "marginRight",
      hasItems
    }),
    "--marginBottom": styleMargin({
      v,
      device: "desktop",
      state: "normal",
      current: "marginBottom",
      hasItems
    }),
    "--marginLeft": styleMargin({
      v,
      device: "desktop",
      state: "normal",
      current: "marginLeft",
      hasItems
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

    // Hover Transition
    "--hoverTransition": styleHoverTransition({ v }),
    "--hoverTransitionProperty": styleHoverTransitionProperty({ v }),

    /* ######### TABLET NORMAL ######### */

    "--tabletFilter": styleShowOnTabletFilter({ v }),
    "--tabletOpacity": styleShowOnTabletOpacity({ v }),
    "--tabletBackgroundImage": styleBgImage({
      v,
      device: "tablet",
      state: "normal"
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
    "--tabletBackgroundColor": styleBgColor({
      v,
      device: "tablet",
      state: "normal"
    }),
    "--tabletBackgroundGradient": styleBgGradient({
      v,
      device: "tablet",
      state: "normal"
    }),
    "--tabletPaddingTop": stylePadding({
      v,
      device: "tablet",
      state: "normal",
      current: "paddingTop",
      hasItems
    }),
    "--tabletPaddingRight": stylePadding({
      v,
      device: "tablet",
      state: "normal",
      current: "paddingRight",
      hasItems
    }),
    "--tabletPaddingBottom": stylePadding({
      v,
      device: "tablet",
      state: "normal",
      current: "paddingBottom",
      hasItems
    }),
    "--tabletPaddingLeft": stylePadding({
      v,
      device: "tablet",
      state: "normal",
      current: "paddingLeft",
      hasItems
    }),
    "--tabletMarginTop": styleMargin({
      v,
      device: "tablet",
      state: "normal",
      current: "marginTop",
      hasItems
    }),
    "--tabletMarginBottom": styleMargin({
      v,
      device: "tablet",
      state: "normal",
      current: "marginBottom",
      hasItems
    }),
    "--tabletMarginLeft": styleMargin({
      v,
      device: "tablet",
      state: "normal",
      current: "marginLeft",
      hasItems
    }),
    "--tabletMarginRight": styleMargin({
      v,
      device: "tablet",
      state: "normal",
      current: "marginRight",
      hasItems
    }),
    "--tabletVerticalAlign": styleAlignVerticalAlign({
      v,
      device: "tablet",
      state: "normal",
      hasItems
    }),

    /* ######### MOBILE NORMAL ######### */

    "--mobileFilter": styleShowOnMobileFilter({ v }),
    "--mobileOpacity": styleShowOnMobileOpacity({ v }),

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
    "--mobileBackgroundColor": styleBgColor({
      v,
      device: "mobile",
      state: "normal"
    }),
    "--mobileBackgroundGradient": styleBgGradient({
      v,
      device: "mobile",
      state: "normal"
    }),
    "--mobilePaddingTop": stylePadding({
      v,
      device: "mobile",
      state: "normal",
      current: "paddingTop",
      hasItems
    }),
    "--mobilePaddingRight": stylePadding({
      v,
      device: "mobile",
      state: "normal",
      current: "paddingRight",
      hasItems
    }),
    "--mobilePaddingBottom": stylePadding({
      v,
      device: "mobile",
      state: "normal",
      current: "paddingBottom",
      hasItems
    }),
    "--mobilePaddingLeft": stylePadding({
      v,
      device: "mobile",
      state: "normal",
      current: "paddingLeft",
      hasItems
    }),
    "--mobileMarginTop": styleMargin({
      v,
      device: "mobile",
      state: "normal",
      current: "marginTop",
      hasItems
    }),
    "--mobileMarginBottom": styleMargin({
      v,
      device: "mobile",
      state: "normal",
      current: "marginBottom",
      hasItems
    }),
    "--mobileMarginLeft": styleMargin({
      v,
      device: "mobile",
      state: "normal",
      current: "marginLeft",
      hasItems
    }),
    "--mobileMarginRight": styleMargin({
      v,
      device: "mobile",
      state: "normal",
      current: "marginRight",
      hasItems
    })
  };
}

export function styleClassName(v, props) {
  const { className, items } = v;
  const { meta } = props;

  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        willChange: "flex, max-width",
        flex: "1 1 var(--width)",
        maxWidth: "var(--width)"
      },
      ".brz-ed--tablet &": {
        willChange: "flex, max-width",
        flex: "1 1 var(--tabletWidth)",
        maxWidth: "var(--tabletWidth)"
      },
      ".brz-ed--mobile &": {
        willChange: "flex, max-width",
        flex: "1 1 var(--mobileWidth)",
        maxWidth: "var(--mobileWidth)"
      }
    };
    if (items.length === 0) {
      glamorObj["& > .brz-ed-border"] = {
        flex: 1,
        display: "flex",
        flexDirection: "column"
      };
    }
  } else {
    const { width, mobileWidth, zIndex } = v;

    glamorObj = {
      ".brz &": {
        zIndex: zIndex === 0 ? "auto" : zIndex
      },
      "@media (min-width: 992px)": {
        ".brz &": {
          willChange: "flex, max-width",
          flex: `1 1 ${width}%`,
          maxWidth: `${width}%`
        }
      },
      "@media (max-width: 991px) and (min-width: 768px)": {
        ".brz &": {
          willChange: "flex, max-width",
          flex: `1 1 ${tabletSyncOnChange(v, "width")}%`,
          maxWidth: `${tabletSyncOnChange(v, "width")}%`
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          willChange: "flex, max-width",
          flex: `1 1 ${mobileWidth}%`,
          maxWidth: `${mobileWidth}%`
        }
      }
    };
    if (items.length === 0) {
      glamorObj["& > .brz-ed-border"] = {
        flex: 1,
        display: "flex",
        flexDirection: "column"
      };
    }
  }

  const glamorClassName = String(css(glamorObj));

  return classnames(
    "brz-columns",
    { "brz-columns__posts": IS_EDITOR && meta.posts },
    glamorClassName,
    className
  );
}

export function styleCSSVars(v, props) {
  if (IS_PREVIEW) return;

  return {
    "--width": styleSizeWidthPercent({
      v,
      device: "desktop"
    }),
    "--tabletWidth": styleSizeWidthPercent({
      v,
      device: "tablet"
    }),
    "--mobileWidth": styleSizeWidthPercent({
      v,
      device: "mobile"
    })
  };
}
