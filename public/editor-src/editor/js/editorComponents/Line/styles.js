import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import {
  styleBorderStyle,
  styleBorderColor,
  styleSizeWidthPercent,
  styleElementLineBorderWidth
} from "visual/utils/style";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz & .brz-hr": {
        borderTopStyle: "var(--borderTopStyle)",
        borderTopColor: "var(--borderTopColor)"
      },
      ".brz-ed--desktop &": {
        width: "var(--width)",

        "& .brz-hr": {
          borderTopWidth: "var(--borderWidth)"
        }
      },
      ".brz-ed--tablet &": {
        width: "var(--tabletWidth)",

        "& .brz-hr": {
          borderTopWidth: "var(--tabletBorderWidth)"
        }
      },
      ".brz-ed--mobile &": {
        width: "var(--mobileWidth)",

        "& .brz-hr": {
          borderTopWidth: "var(--mobileBorderWidth)"
        }
      }
    };
  } else {
    const {
      width,
      borderWidth,
      borderColorHex,
      borderColorOpacity,
      borderStyle
    } = v;

    glamorObj = {
      ".brz &": {
        width: `${width}%`,

        "& .brz-hr": {
          borderTopWidth: `${borderWidth}px`,
          borderTopStyle: borderStyle,
          borderTopColor: hexToRgba(borderColorHex, borderColorOpacity)
        }
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          width: `${tabletSyncOnChange(v, "width")}%`,

          "& .brz-hr": {
            borderTopWidth: `${tabletSyncOnChange(v, "borderWidth")}px`
          }
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          width: `${mobileSyncOnChange(v, "width")}%`,

          "& .brz-hr": {
            borderTopWidth: `${mobileSyncOnChange(v, "borderWidth")}px`
          }
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-line", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  return {
    "--width": styleSizeWidthPercent({ v, device: "desktop" }),
    "--borderWidth": styleElementLineBorderWidth({ v, device: "desktop" }),
    "--borderTopStyle": styleBorderStyle({
      v,
      device: "desktop",
      state: "normal"
    }),
    "--borderTopColor": styleBorderColor({
      v,
      device: "desktop",
      state: "normal"
    }),

    // Tablet
    "--tabletWidth": styleSizeWidthPercent({ v, device: "tablet" }),
    "--tabletBorderWidth": styleElementLineBorderWidth({ v, device: "tablet" }),

    // Mobile
    "--mobileWidth": styleSizeWidthPercent({ v, device: "mobile" }),
    "--mobileBorderWidth": styleElementLineBorderWidth({ v, device: "mobile" })
  };
}
