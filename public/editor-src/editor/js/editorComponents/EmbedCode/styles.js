import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        width: "var(--width)"
      },
      ".brz-ed--tablet &": {
        width: "var(--tabletWidth)"
      },
      ".brz-ed--mobile &": {
        width: "var(--mobileWidth)"
      }
    };
  } else {
    const { width } = v;

    glamorObj = {
      ".brz &": {
        width: `${width}%`
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          width: `${tabletSyncOnChange(v, "width")}%`
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          width: `${mobileSyncOnChange(v, "width")}%`
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-embed-code", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const { width } = v;

  return {
    "--width": `${width}%`,

    // Tablet
    "--tabletWidth": `${tabletSyncOnChange(v, "width")}%`,

    // Mobile
    "--mobileWidth": `${mobileSyncOnChange(v, "width")}%`
  };
}
