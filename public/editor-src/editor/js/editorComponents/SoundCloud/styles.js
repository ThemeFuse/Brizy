import classnames from "classnames";
import { css } from "glamor";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz & iframe": {
        width: `100%`,
      },
      ".brz-ed--desktop &": {
        width: "var(--width)",
        height: "var(--height)",

        "& iframe": {
          height: "var(--height)",
        }
      },
      ".brz-ed--mobile &": {
        width: "var(--mobileWidth)",
        height: "var(--mobileHeight)",

        "& iframe": {
          height: "var(--mobileHeight)",
        }
      }
    };
  } else {
    const {
      url,
      width,
      height,
      mobileWidth,
      mobileHeight
    } = v;

    glamorObj = {
      ".brz &": {
        width: `${width}%`,
        height: !url ? `${height}px` : null,

        "& iframe": {
          width: `100%`,
          height: `${height}px`
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          width: `${mobileWidth}%`,
          height: !url ? `${mobileHeight}px` : null,

          "& iframe": {
            height: `${mobileHeight}px`
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

  const {
    width,
    height,
    mobileWidth,
    mobileHeight
  } = v;

  return {
    "--width": `${width}%`,
    "--height": `${height}px`,
    "--mobileWidth": `${mobileWidth}%`,
    "--mobileHeight": `${mobileHeight}px`
  };
}
