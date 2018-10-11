import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz &": {
        boxShadow: "var(--boxShadow)",
      },
      ".brz-ed--desktop &": {
        width: "var(--width)",
        height: "var(--height)",
      },

      ".brz-ed--mobile &": {
        width: "var(--mobileWidth)",
        height: "var(--mobileHeight)"
      }
    };
  } else {
    const {
      size,
      height,
      boxShadow,
      boxShadowColorHex,
      boxShadowColorOpacity,
      boxShadowBlur,
      boxShadowSpread,
      boxShadowVertical,
      boxShadowHorizontal
    } = v;

    const boxShadowStyle =
      boxShadow === "on"
        ? `${boxShadowHorizontal}px ${boxShadowVertical}px ${boxShadowBlur}px ${boxShadowSpread}px ${hexToRgba(
          boxShadowColorHex,
          boxShadowColorOpacity
        )}`
        : "none";

    glamorObj = {
      ".brz &": {
        width: `${size}%`,
        height: `${height}px`,
        boxShadow: boxShadowStyle,
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          width: `${mobileSyncOnChange(v, "size")}%`,
          height: `${mobileSyncOnChange(v, "height")}px`
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-map", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    size,
    height,
    boxShadow,
    boxShadowColorHex,
    boxShadowColorOpacity,
    boxShadowBlur,
    boxShadowSpread,
    boxShadowVertical,
    boxShadowHorizontal
  } = v;

  const boxShadowStyle =
    boxShadow === "on"
      ? `${boxShadowHorizontal}px ${boxShadowVertical}px ${boxShadowBlur}px ${boxShadowSpread}px ${hexToRgba(
        boxShadowColorHex,
        boxShadowColorOpacity
      )}`
      : "none";

  return {
    "--width": `${size}%`,
    "--height": `${height}px`,
    "--boxShadow": boxShadowStyle,
    "--mobileWidth": `${mobileSyncOnChange(v, "size")}%`,
    "--mobileHeight": `${mobileSyncOnChange(v, "height")}px`
  };
}
