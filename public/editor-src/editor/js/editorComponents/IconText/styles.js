import classnames from "classnames";
import { css } from "glamor";

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if(IS_EDITOR) {
    glamorObj = {
      ".brz &": {
        flexDirection: "var(--iconPosition)",

        "& .brz-icon__container": {
          marginLeft: "var(--iconSpacingLeft)",
          marginRight: "var(--iconSpacingRight)",
        }
      },
    }
  } else {
    const {
      iconPosition,
      iconSpacing
    } = v;

    const marginColumn = iconPosition === "right" ? "marginLeft" : "marginRight";

    glamorObj = {
      ".brz &": {
        flexDirection: iconPosition === "right" ? "row-reverse" : "row",

        "& .brz-icon__container": {
          [marginColumn]: `${iconSpacing}px`,
        }
      },
    }
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-icon-text", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    iconPosition,
    iconSpacing
  } = v;

  return {
    "--iconPosition": iconPosition === "right" ? "row-reverse" : "row",
    "--iconSpacingLeft": iconPosition === "right" ? `${iconSpacing}px` : "auto",
    "--iconSpacingRight": iconPosition === "left" ? `${iconSpacing}px` : "auto"
  };
}
