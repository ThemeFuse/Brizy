import classnames from "classnames";
import { css } from "glamor";
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
  styleContainerType,
  styleHoverTransition,
  styleHoverTransitionProperty,
  styleElementSectionContainerSize,
  stylePadding,
  styleShapeType,
  styleShapeTopHeight,
  styleShapeBottomHeight,
  styleShapeTopFlip,
  styleShapeBottomFlip,
  styleShapeTopIndex,
  styleShapeBottomIndex,
  styleShapeTopBackgroundSize,
  styleShapeBottomBackgroundSize,
  styleElementSectionBoxShadow
} from "visual/utils/style";

export function bgStyleClassName(v) {
  let glamorObj;
  if (IS_EDITOR) {
    glamorObj = {
      "> .brz-bg-media": {
        // Shape
        "> .brz-bg-shape__top": {
          transform: "var(--shapeTopFlip)",

          backgroundImage: "var(--shapeTopType)",

          zIndex: "var(--shapeTopIndex)"
        },
        "> .brz-bg-shape__bottom": {
          transform: "var(--shapeBottomFlip)",

          backgroundImage: "var(--shapeBottomType)",

          zIndex: "var(--shapeBottomIndex)"
        }
      },

      ".brz-ed--desktop &": {
        "> .brz-bg-content": {
          boxShadow: "var(--boxShadow)",
          transition: "var(--hoverTransition)",
          transitionProperty: "var(--hoverTransitionProperty)"
        },

        ":hover > .brz-bg-content": { boxShadow: "var(--hoverBoxShadow)" },

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

          borderColor: "var(--hoverBorderColor)"
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
        "> .brz-bg-content": { boxShadow: "var(--tabletBoxShadow)" },

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
        "> .brz-bg-content": { boxShadow: "var(--mobileBoxShadow)" },

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
    glamorObj = {
      "> .brz-bg-content": {
        boxShadow: styleElementSectionBoxShadow({
          v,
          device: "desktop",
          state: "normal"
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

      // Shape
      "> .brz-bg-media > .brz-bg-shape__top": {
        backgroundImage: styleShapeType({ v, prefix: "Top" }),
        backgroundSize: styleShapeTopBackgroundSize({ v, device: "desktop" }),
        transform: styleShapeTopFlip({ v }),
        height: styleShapeTopHeight({ v, device: "desktop" }),
        zIndex: styleShapeTopIndex({ v })
      },
      "> .brz-bg-media > .brz-bg-shape__bottom": {
        backgroundImage: styleShapeType({ v, prefix: "Bottom" }),
        backgroundSize: styleShapeBottomBackgroundSize({
          v,
          device: "desktop"
        }),
        transform: styleShapeBottomFlip({ v }),
        height: styleShapeBottomHeight({ v, device: "desktop" }),
        zIndex: styleShapeBottomIndex({ v })
      },
      "@media (min-width: 991px)": {
        // Transition

        "> .brz-bg-content": {
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
        //Hover
        ":hover > .brz-bg-content": {
          boxShadow: styleElementSectionBoxShadow({
            v,
            device: "desktop",
            state: "hover"
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
          })
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
        "> .brz-bg-content": {
          boxShadow: styleElementSectionBoxShadow({
            v,
            device: "tablet",
            state: "normal"
          })
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
        },

        // Shape
        "> .brz-bg-media > .brz-bg-shape__top": {
          backgroundSize: styleShapeTopBackgroundSize({ v, device: "tablet" }),
          height: styleShapeTopHeight({ v, device: "tablet" })
        },
        "> .brz-bg-media > .brz-bg-shape__bottom": {
          backgroundSize: styleShapeBottomBackgroundSize({
            v,
            device: "tablet"
          }),
          height: styleShapeTopHeight({ v, device: "tablet" })
        }
      },
      "@media (max-width: 767px)": {
        "> .brz-bg-content": {
          boxShadow: styleElementSectionBoxShadow({
            v,
            device: "mobile",
            state: "normal"
          })
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
          })
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

        // Shape
        "> .brz-bg-media > .brz-bg-shape__top": {
          backgroundSize: styleShapeTopBackgroundSize({ v, device: "mobile" }),
          height: styleShapeTopHeight({ v, device: "mobile" })
        },
        "> .brz-bg-media > .brz-bg-shape__bottom": {
          backgroundSize: styleShapeBottomBackgroundSize({
            v,
            device: "mobile"
          }),
          height: styleShapeTopHeight({ v, device: "mobile" })
        }
      }
    };
  }
  const glamorClassName = String(css(glamorObj));

  return classnames(glamorClassName);
}

export function bgStyleCSSVars(v) {
  if (IS_PREVIEW) return null;

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

    // Box Shadow
    "--boxShadow": styleElementSectionBoxShadow({
      v,
      device: "desktop",
      state: "normal"
    }),

    // Shape
    "--shapeTopHeight": styleShapeTopHeight({ v, device: "desktop" }),
    "--shapeTopFlip": styleShapeTopFlip({ v }),
    "--shapeTopIndex": styleShapeTopIndex({ v }),
    "--shapeTopType": styleShapeType({ v, prefix: "Top" }),
    "--shapeTopBackgroundSize": styleShapeTopBackgroundSize({
      v,
      device: "desktop"
    }),

    "--shapeBottomHeight": styleShapeBottomHeight({ v, device: "desktop" }),
    "--shapeBottomFlip": styleShapeBottomFlip({ v }),
    "--shapeBottomIndex": styleShapeBottomIndex({ v }),
    "--shapeBottomType": styleShapeType({ v, prefix: "Bottom" }),
    "--shapeBottomBackgroundSize": styleShapeBottomBackgroundSize({
      v,
      device: "desktop"
    }),

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
    "--hoverBoxShadow": styleElementSectionBoxShadow({
      v,
      device: "desktop",
      state: "hover"
    }),

    // Hover Transition
    "--hoverTransition": styleHoverTransition({ v }),
    "--hoverTransitionProperty": styleHoverTransitionProperty({ v }),

    /* ######### TABLET NORMAL ######### */

    // BG Image
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
    "--tabletBoxShadow": styleElementSectionBoxShadow({
      v,
      device: "tablet",
      state: "normal"
    }),

    // Shape
    "--tabletShapeTopHeight": styleShapeTopHeight({ v, device: "tablet" }),
    "--tabletShapeBottomHeight": styleShapeBottomHeight({
      v,
      device: "tablet"
    }),
    "--tabletShapeTopBackgroundSize": styleShapeTopBackgroundSize({
      v,
      device: "tablet"
    }),
    "--tabletShapeBottomBackgroundSize": styleShapeBottomBackgroundSize({
      v,
      device: "tablet"
    }),

    /* ######### MOBILE NORMAL ######### */

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
    "--mobileBoxShadow": styleElementSectionBoxShadow({
      v,
      device: "mobile",
      state: "normal"
    }),

    // Shape
    "--mobileShapeTopHeight": styleShapeTopHeight({ v, device: "mobile" }),
    "--mobileShapeBottomHeight": styleShapeBottomHeight({
      v,
      device: "mobile"
    }),
    "--mobileShapeTopBackgroundSize": styleShapeTopBackgroundSize({
      v,
      device: "mobile"
    }),
    "--mobileShapeBottomBackgroundSize": styleShapeBottomBackgroundSize({
      v,
      device: "mobile"
    })
  };
}

export function itemsStyleClassName(v) {
  const { containerClassName } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        maxWidth: "var(--maxWidth)",
        // Border Style
        borderStyle: "var(--borderStyle)",

        // Border Width
        borderTopWidth: "var(--borderTopWidth)",
        borderRightWidth: "var(--borderRightWidth)",
        borderBottomWidth: "var(--borderBottomWidth)",
        borderLeftWidth: "var(--borderLeftWidth)",

        // Border Color
        borderColor: "transparent"
      },
      ".brz-ed--tablet &": {
        maxWidth: "var(--maxWidth)",
        // Border Style
        borderStyle: "var(--tabletBorderStyle)",

        // Border Width
        borderTopWidth: "var(--tabletBorderTopWidth)",
        borderRightWidth: "var(--tabletBorderRightWidth)",
        borderBottomWidth: "var(--tabletBorderBottomWidth)",
        borderLeftWidth: "var(--tabletBorderLeftWidth)",

        // Border Color
        borderColor: "transparent"
      },
      ".brz-ed--mobile &": {
        maxWidth: "var(--maxWidth)",
        // Border Style
        borderStyle: "var(--mobileBorderStyle)",

        // Border Width
        borderTopWidth: "var(--mobileBorderTopWidth)",
        borderRightWidth: "var(--mobileBorderRightWidth)",
        borderBottomWidth: "var(--mobileBorderBottomWidth)",
        borderLeftWidth: "var(--mobileBorderLeftWidth)",

        // Border Color
        borderColor: "transparent"
      }
    };
  } else {
    glamorObj = {
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

      "@media (max-width: 992px)": {
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

      "@media (max-width: 767px)": {
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

      "@media (min-width: 992px)": {
        maxWidth: styleElementSectionContainerSize({ v })
      }
    };
  }
  const glamorClassName = String(css(glamorObj));

  return classnames("brz-container", glamorClassName, containerClassName);
}

export function itemsStyleCSSVars(v) {
  if (IS_PREVIEW) return null;

  return {
    //Desktop
    "--maxWidth": styleElementSectionContainerSize({ v }),
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
    //Tablet

    "--maxWidth": styleElementSectionContainerSize({ v }),
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

    //Mobile

    "--maxWidth": styleElementSectionContainerSize({ v }),
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
    })
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
      maxWidth: styleContainerType({ v }),

      // Padding
      paddingTop: stylePadding({
        v,
        device: "desktop",
        state: "normal",
        current: "paddingTop"
      }),
      paddingBottom: stylePadding({
        v,
        device: "desktop",
        state: "normal",
        current: "paddingBottom"
      }),

      "@media (max-width: 991px)": {
        // Padding
        paddingTop: stylePadding({
          v,
          device: "tablet",
          state: "normal",
          current: "paddingTop"
        }),
        paddingBottom: stylePadding({
          v,
          device: "tablet",
          state: "normal",
          current: "paddingBottom"
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
        paddingBottom: stylePadding({
          v,
          device: "mobile",
          state: "normal",
          current: "paddingBottom"
        })
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-container__wrap", glamorClassName);
}

export function containerStyleCSSVars(v) {
  if (IS_PREVIEW) return null;

  return {
    "--containerWidth": styleContainerType({ v })
  };
}
