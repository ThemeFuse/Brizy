import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

export function styleClassName(v) {
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        textAlign: "var(--horizontalAlign)"
      },
      ".brz-ed--tablet &": {
        textAlign: "var(--tabletHorizontalAlign)"
      },
      ".brz-ed--mobile &": {
        textAlign: "var(--mobileHorizontalAlign)"
      }
    };
  } else {
    const { horizontalAlign } = v;

    glamorObj = {
      textAlign: horizontalAlign,

      "@media (max-width: 991px)": {
        textAlign: tabletSyncOnChange(v, "horizontalAlign")
      },
      "@media (max-width: 767px)": {
        textAlign: mobileSyncOnChange(v, "horizontalAlign")
      }
    };
  }

  const glamorClassName = String(css(glamorObj));
  return classnames("brz-forms", glamorClassName);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const { horizontalAlign } = v;

  return {
    "--horizontalAlign": horizontalAlign,
    "--tabletHorizontalAlign": tabletSyncOnChange(v, "horizontalAlign"),
    "--mobileHorizontalAlign": mobileSyncOnChange(v, "horizontalAlign")
  };
}
