import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if(IS_EDITOR) {
    glamorObj = {
      ".brz & .brz-hr": {
        borderTopStyle: "var(--borderTopStyle)",
        borderTopColor: "var(--borderTopColor)"
      },
      ".brz-ed--desktop &": {
        width: "var(--width)",

        "& .brz-hr": {
          borderTopWidth: "var(--borderWidth)",
        }
      },
      ".brz-ed--mobile &": {
        width: "var(--mobileWidth)",

        "& .brz-hr": {
          borderTopWidth: "var(--mobileBorderWidth)",
        }
      }
    }
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
      "@media (max-width: 767px)": {
        ".brz &": {
          width: `${mobileSyncOnChange(v, "width")}%`,

          "& .brz-hr": {
            borderTopWidth: `${mobileSyncOnChange(v, "borderWidth")}px`
          }
        }
      }
    }
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-line", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    width,
    borderWidth,
    borderColorHex,
    borderColorOpacity,
    borderStyle
  } = v;

  return {
    "--width": `${width}%`,
    "--mobileWidth": `${mobileSyncOnChange(v, "width")}%`,
    "--borderWidth": `${borderWidth}px`,
    "--mobileBorderWidth": `${mobileSyncOnChange(v, "borderWidth")}px`,
    "--borderTopStyle": borderStyle,
    "--borderTopColor": hexToRgba(borderColorHex, borderColorOpacity)
  };
}
