import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

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
    const { width } = v;

    glamorObj = {
      ".brz &": {
        maxWidth: `${width}%`,
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          maxWidth: `${mobileSyncOnChange(v, "width")}%`,
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-wp__sidebar", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const { width } = v;

  return {
    "--maxWidth": `${width}%`,
    "--mobileMaxWidth": `${mobileSyncOnChange(v, "width")}%`,
  };
}
