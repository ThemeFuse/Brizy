import classnames from "classnames";
import { css } from "glamor";
import {
  styleBoxShadow,
  styleHoverTransition,
  styleHoverTransitionProperty
} from "visual/utils/style";
export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      width: "fit-content",

      ".brz-ed--desktop &": {
        boxShadow: "var(--boxShadow)",

        transition: "var(--hoverTransition)",
        transitionProperty: "var(--hoverTransitionProperty)",

        ":hover": {
          boxShadow: "var(--hoverBoxShadow)"
        }
      },
      ".brz-ed--tablet &": {
        "& .fb-group": {
          boxShadow: "var(--tabletBoxShadow)"
        }
      },
      ".brz-ed--mobile &": {
        "& .fb-group": {
          boxShadow: "var(--mobileBoxShadow)"
        }
      }
    };
  } else {
    glamorObj = {
      ".brz &": {
        width: "fit-content",

        boxShadow: styleBoxShadow({ v, device: "desktop", state: "normal" })
      },
      "@media (min-width: 991px)": {
        transition: styleHoverTransition({ v }),
        transitionProperty: styleHoverTransitionProperty(),

        ".brz &:hover": {
          boxShadow: styleBoxShadow({ v, device: "desktop", state: "hover" })
        }
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          boxShadow: styleBoxShadow({ v, device: "tablet", state: "normal" })
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          boxShadow: styleBoxShadow({ v, device: "mobile", state: "normal" })
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-fb-group", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  return {
    // Box Shadow
    "--boxShadow": styleBoxShadow({ v, device: "desktop", state: "normal" }),

    // Hover
    "--hoverBoxShadow": styleBoxShadow({
      v,
      device: "desktop",
      state: "hover"
    }),
    "--hoverTransition": styleHoverTransition({ v }),
    "--hoverTransitionProperty": styleHoverTransitionProperty({ v }),

    // Tablet
    "--tabletBoxShadow": styleBoxShadow({
      v,
      device: "tablet",
      state: "normal"
    }),

    // Mobile
    "--mobileBoxShadow": styleBoxShadow({
      v,
      device: "mobile",
      state: "normal"
    })
  };
}
