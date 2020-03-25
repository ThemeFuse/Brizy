import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

/// Form Field
export function fieldStyleClassName(v) {
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        maxWidth: "var(--width)",
        flexBasis: "var(--width)",

        "& .brz-textarea": {
          height: "var(--height)"
        }
      },
      ".brz-ed--tablet &": {
        maxWidth: "var(--tabletWidth)",
        flexBasis: "var(--tabletWidth)",

        "& .brz-textarea": {
          height: "var(--tabletHeight)"
        }
      },
      ".brz-ed--mobile &": {
        maxWidth: "var(--mobileWidth)",
        flexBasis: "var(--mobileWidth)",

        "& .brz-textarea": {
          height: "var(--mobileHeight)"
        }
      }
    };
  } else {
    const { type, width, height } = v;

    glamorObj = {
      ".brz &": {
        maxWidth: `${width}%`,
        flexBasis: `${width}%`,

        "& .brz-textarea": {
          height: type === "Paragraph" ? `${height}px` : null
        }
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          maxWidth: `${tabletSyncOnChange(v, "width")}%`,
          flexBasis: `${tabletSyncOnChange(v, "width")}%`,

          "& .brz-textarea": {
            height:
              type === "Paragraph"
                ? `${tabletSyncOnChange(v, "height")}px`
                : null
          }
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          maxWidth: `${mobileSyncOnChange(v, "width")}%`,
          flexBasis: `${mobileSyncOnChange(v, "width")}%`,

          "& .brz-textarea": {
            height:
              type === "Paragraph"
                ? `${mobileSyncOnChange(v, "height")}px`
                : null
          }
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-forms__item", glamorClassName);
}

export function fieldStyleCSSVars(v) {
  if (IS_PREVIEW) return null;

  const { type, width, height } = v;

  return {
    "--width": `${width}%`,
    "--height": type === "Paragraph" ? `${height}px` : "auto",

    // Tablet
    "--tabletWidth": `${tabletSyncOnChange(v, "width")}%`,
    "--tabletHeight":
      type === "Paragraph" ? `${tabletSyncOnChange(v, "height")}px` : "auto",

    // Mobile
    "--mobileWidth": `${mobileSyncOnChange(v, "width")}%`,
    "--mobileHeight":
      type === "Paragraph" ? `${mobileSyncOnChange(v, "height")}px` : "auto"
  };
}
