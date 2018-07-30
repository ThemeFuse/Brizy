import classnames from "classnames";
import { css } from "glamor";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if(IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        height: "var(--height)",
      },
      ".brz-ed--mobile &": {
        height: "var(--mobileHeight)",
      }
    }
  } else {
    const {
      height,
      mobileHeight
    } = v;

    glamorObj = {
      ".brz &": {
        height: `${height}px`,
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          height: `${mobileHeight}px`
        }
      }
    }
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-spacer", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    height,
    mobileHeight
  } = v;

  return {
    "--height": `${height}px`,
    "--mobileHeight": `${mobileHeight}px`,
  };
}
