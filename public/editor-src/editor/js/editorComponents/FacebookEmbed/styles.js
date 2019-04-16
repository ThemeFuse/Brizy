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
      ".brz-ed--desktop &": {
        boxShadow: "var(--boxShadow)",

        transition: "var(--hoverTransition)",
        transitionProperty: "var(--hoverTransitionProperty)",

        ":hover": {
          boxShadow: "var(--hoverBoxShadow)"
        }
      },
      ".brz-ed--tablet &": {
        boxShadow: "var(--tabletBoxShadow)"
      },
      ".brz-ed--mobile &": {
        boxShadow: "var(--mobileBoxShadow)"
      }
    };
  } else {
    glamorObj = {
      ".brz &": {
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

  return classnames("brz-fb-embed", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  return {
    //####--- Normal ---####//

    "--boxShadow": styleBoxShadow({ v, device: "desktop", state: "normal" }),

    //####--- Hover ---####//

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

    "--tabletBoxShadow": styleBoxShadow({
      v,
      device: "tablet",
      state: "normal"
    }),

    //####--- Mobile ---####//

    "--mobileBoxShadow": styleBoxShadow({
      v,
      device: "mobile",
      state: "normal"
    })
  };
}
