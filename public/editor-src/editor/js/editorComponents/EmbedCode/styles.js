import classnames from "classnames";
import { css } from "glamor";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        width: "var(--width)"
      },
      ".brz-ed--mobile &": {
        width: "var(--mobileWidth)"
      }
    };
  } else {
    const { width, mobileWidth } = v;

    glamorObj = {
      ".brz &": {
        width: `${width}%`
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          width: `${mobileWidth}%`
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-embed-code", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const { width, mobileWidth } = v;

  return {
    "--width": `${width}%`,
    "--mobileWidth": `${mobileWidth}%`
  };
}
