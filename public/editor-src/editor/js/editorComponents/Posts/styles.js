import classnames from "classnames";
import { css } from "glamor";

export function styleClassName(v) {
  const { className, gridColumn } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        gridTemplateColumns: "var(--gridTemplateColumn)",
        gridGap: "var(--gridGap)"
      },
      ".brz-ed--mobile &": {
        gridGap: "var(--mobileGridGap)"
      }
    };
  } else {
    const { padding, mobilePadding: _mobilePadding } = v;
    const mobilePadding = _mobilePadding === null ? padding : _mobilePadding;
    const columnWidth = gridColumn === 1 ? "100%" : `${100 / gridColumn}%`;

    glamorObj = {
      ".brz &": {
        gridTemplateColumns: `repeat(${gridColumn}, minmax(0, ${columnWidth}))`,
        gridGap: `${padding}px`
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          gridTemplateRows: `repeat(1, 1fr)`,
          gridTemplateColumns: `repeat(1, 100%)`,
          gridGap: `${mobilePadding}px 0`
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames(
    "brz-posts",
    { [`brz-posts__col-${gridColumn}`]: IS_EDITOR },
    glamorClassName,
    className
  );
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const { gridColumn, padding, mobilePadding: _mobilePadding } = v;
  const mobilePadding = _mobilePadding === null ? padding : _mobilePadding;
  const columnWidth = gridColumn === 1 ? "100%" : `${100 / gridColumn}%`;

  return {
    "--gridTemplateColumn": `repeat(${gridColumn}, minmax(0, ${columnWidth}))`,
    "--gridGap": `${padding}px`,
    "--mobileGridGap": `${mobilePadding}px 0`
  };
}
