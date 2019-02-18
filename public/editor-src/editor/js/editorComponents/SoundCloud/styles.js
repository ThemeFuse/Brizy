import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

import { styleSizeWidthPercent, styleSizeHeightPx } from "visual/utils/style";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz & iframe": {
        width: `100%`
      },
      ".brz-ed--desktop &": {
        width: "var(--width)",
        height: "var(--height)",

        "& iframe": {
          height: "var(--height)"
        }
      },
      ".brz-ed--tablet &": {
        width: "var(--tabletWidth)",
        height: "var(--tabletHeight)",

        "& iframe": {
          height: "var(--tabletHeight)"
        }
      },
      ".brz-ed--mobile &": {
        width: "var(--mobileWidth)",
        height: "var(--mobileHeight)",

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
        height: !url ? `${height}px` : null,

        "& iframe": {
          width: `100%`,
          height: `${height}px`
        }
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          width: `${tabletSyncOnChange(v, "width")}%`,
          height: !url ? `${tabletSyncOnChange(v, "height")}px` : null,

          "& iframe": {
            height: `${tabletSyncOnChange(v, "height")}px`
          }
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          width: `${mobileSyncOnChange(v, "width")}%`,
          height: !url ? `${mobileSyncOnChange(v, "height")}px` : null,

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

    /* ######### TABLET NORMAL ######### */

    "--tabletWidth": styleSizeWidthPercent({ v, device: "tablet" }),
    "--tabletHeight": styleSizeHeightPx({ v, device: "tablet" }),

    /* ######### MOBILE NORMAL ######### */

    "--mobileWidth": styleSizeWidthPercent({ v, device: "mobile" }),
    "--mobileHeight": styleSizeHeightPx({ v, device: "mobile" })
  };
}
