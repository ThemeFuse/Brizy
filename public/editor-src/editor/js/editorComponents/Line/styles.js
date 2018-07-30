import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";

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
      borderStyle,
      mobileWidth,
      mobileBorderWidth,
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
          width: `${mobileWidth}%`,

          "& .brz-hr": {
            borderTopWidth: `${mobileBorderWidth}px`
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
    borderStyle,
    mobileWidth,
    mobileBorderWidth,
  } = v;

  return {
    "--width": `${width}%`,
    "--mobileWidth": `${mobileWidth}%`,
    "--borderWidth": `${borderWidth}px`,
    "--mobileBorderWidth": `${mobileBorderWidth}px`,
    "--borderTopStyle": borderStyle,
    "--borderTopColor": hexToRgba(borderColorHex, borderColorOpacity)
  };
}
