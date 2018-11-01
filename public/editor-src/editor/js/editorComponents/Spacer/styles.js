import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        height: "var(--height)"
      },
      ".brz-ed--tablet &": {
        height: "var(--tabletHeight)"
      },
      ".brz-ed--mobile &": {
        height: "var(--mobileHeight)"
      }
    };
  } else {
    const { height } = v;

    glamorObj = {
      ".brz &": {
        height: `${height}px`
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          height: `${tabletSyncOnChange(v, "height")}px`
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          height: `${mobileSyncOnChange(v, "height")}px`
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-spacer", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const { height } = v;

  return {
    "--height": `${height}px`,
    "--tabletHeight": `${tabletSyncOnChange(v, "height")}px`,
    "--mobileHeight": `${mobileSyncOnChange(v, "height")}px`
  };
}
