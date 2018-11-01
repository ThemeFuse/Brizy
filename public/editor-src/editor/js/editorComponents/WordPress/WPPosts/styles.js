import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        maxWidth: "var(--width)"
      },
      ".brz-ed--tablet &": {
        maxWidth: "var(--tabletWidth)"
      },
      ".brz-ed--mobile &": {
        maxWidth: "var(--mobileWidth)"
      }
    };
  } else {
    const { width } = v;

    glamorObj = {
      ".brz &": {
        maxWidth: `${width}%`
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          maxWidth: `${tabletSyncOnChange(v, "width")}%`
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          maxWidth: `${mobileSyncOnChange(v, "width")}%`
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames(glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const { width } = v;

  return {
    "--width": `${width}%`,
    "--tabletWidth": `${tabletSyncOnChange(v, "width")}%`,
    "--mobileWidth": `${mobileSyncOnChange(v, "width")}%`
  };
}
