import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";

export function styleClassName(v) {
  const { className, gridColumn } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz & ul.page-numbers": {
        color: "var(--color)"
      },
      ".brz-ed--desktop &": {
        gridTemplateColumns: "var(--gridTemplateColumn)",
        gridGap: "var(--gridGap)",

        "& ul.page-numbers": {
          marginTop: "var(--marginTop)"
        }
      },
      ".brz-ed--mobile &": {
        gridGap: "var(--mobileGridGap)",

        "& ul.page-numbers": {
          marginTop: "var(--mobileMarginTop)"
        }
      }
    };
  } else {
    const {
      padding,
      paginationSpacing,
      paginationColorHex,
      paginationColorOpacity,
      mobilePadding: _mobilePadding,
      mobilePaginationSpacing: _mobilePaginationSpacing
    } = v;
    const mobilePadding = _mobilePadding === null ? padding : _mobilePadding;
    const columnWidth = gridColumn === 1 ? "100%" : `${100 / gridColumn}%`;
    const mobilePaginationSpacing =
      _mobilePaginationSpacing === null
        ? paginationSpacing
        : _mobilePaginationSpacing;

    glamorObj = {
      ".brz &": {
        gridTemplateColumns: `repeat(${gridColumn}, minmax(0, ${columnWidth}))`,
        gridGap: `${padding}px`
      },
      ".brz & ul.page-numbers": {
        color: hexToRgba(paginationColorHex, paginationColorOpacity),
        marginTop: `${paginationSpacing}px`
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          gridTemplateRows: `repeat(1, 1fr)`,
          gridTemplateColumns: `repeat(1, 100%)`,
          gridGap: `${mobilePadding}px 0`
        },
        ".brz & ul.page-numbers": {
          marginTop: `${mobilePaginationSpacing}px`
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

  const {
    gridColumn,
    padding,
    paginationSpacing,
    paginationColorHex,
    paginationColorOpacity,
    mobilePadding: _mobilePadding,
    mobilePaginationSpacing: _mobilePaginationSpacing
  } = v;
  const mobilePadding = _mobilePadding === null ? padding : _mobilePadding;
  const columnWidth = gridColumn === 1 ? "100%" : `${100 / gridColumn}%`;
  const mobilePaginationSpacing =
    _mobilePaginationSpacing === null
      ? paginationSpacing
      : _mobilePaginationSpacing;

  return {
    "--gridTemplateColumn": `repeat(${gridColumn}, minmax(0, ${columnWidth}))`,
    "--gridGap": `${padding}px`,
    "--color": hexToRgba(paginationColorHex, paginationColorOpacity),
    "--marginTop": `${paginationSpacing}px`,
    "--mobileGridGap": `${mobilePadding}px 0`,
    "--mobileMarginTop": `${mobilePaginationSpacing}px`
  };
}
