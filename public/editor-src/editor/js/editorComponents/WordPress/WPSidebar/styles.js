import classnames from "classnames";
import { css } from "glamor";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        maxWidth: "var(--maxWidth)",
      },
      ".brz-ed--mobile &": {
        maxWidth: "var(--mobileMaxWidth)",
      }
    };
  } else {
    const { width, mobileWidth } = v;

    glamorObj = {
      ".brz &": {
        maxWidth: `${width}%`,
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          maxWidth: `${mobileWidth}%`,
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-wp__sidebar", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const { width, mobileWidth } = v;

  return {
    "--maxWidth": `${width}%`,
    "--mobileMaxWidth": `${mobileWidth}%`,
  };
}
