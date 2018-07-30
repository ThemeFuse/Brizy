import classnames from "classnames";
import { css } from "glamor";

/// Form Field
export function fieldStyleClassName(v) {
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        maxWidth: "var(--width)",
        flexBasis: "var(--width)",

        "& .brz-textarea": {
          height: "var(--height)",
        }
      },
      ".brz-ed--mobile &": {
        maxWidth: "var(--mobileWidth)",
        flexBasis: "var(--mobileWidth)",

        "& .brz-textarea": {
          height: "var(--mobileHeight)",
        }
      }
    };
  } else {
    const {
      type,
      width,
      height,
      mobileWidth,
      mobileHeight
    } = v;

    glamorObj = {
      ".brz &": {
        maxWidth: `${width}%`,
        flexBasis: `${width}%`,

        "& .brz-textarea": {
          height: type === "Paragraph" ? `${height}px` : null,
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          maxWidth: `${mobileWidth}%`,
          flexBasis: `${mobileWidth}%`,

          "& .brz-textarea": {
            height: type === "Paragraph" ? `${mobileHeight}px` : null,
          }
        },
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-form__item", glamorClassName);
}

export function fieldStyleCSSVars(v) {
  if (IS_PREVIEW) return null;

  const {
    type,
    width,
    height,
    mobileWidth,
    mobileHeight
  } = v;

  return {
    "--width": `${width}%`,
    "--height": type === "Paragraph" ? `${height}px` : "auto",
    "--mobileWidth": `${mobileWidth}%`,
    "--mobileHeight": type === "Paragraph" ? `${mobileHeight}px` : "auto"
  };
}
