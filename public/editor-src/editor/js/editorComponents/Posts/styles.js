import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import { styleColor } from "visual/utils/style";

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
      ".brz-ed--tablet &": {
        gridTemplateColumns: "var(--tabletGridTemplateColumn)",
        gridGap: "var(--tabletGridGap)",

        "& ul.page-numbers": {
          marginTop: "var(--tabletMarginTop)"
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
    const { padding, paginationSpacing, tabletGridColumn } = v;

    const columnWidth = gridColumn === 1 ? "100%" : `${100 / gridColumn}%`;

    const tabletColumnWidth =
      tabletGridColumn === 1 ? "100%" : `${100 / tabletGridColumn}%`;
    const tabletPadding = tabletSyncOnChange(v, "padding");
    const tabletPaginationSpacing = tabletSyncOnChange(v, "paginationSpacing");

    const mobilePadding = mobileSyncOnChange(v, "padding");
    const mobilePaginationSpacing = mobileSyncOnChange(v, "paginationSpacing");

    glamorObj = {
      ".brz &": {
        gridTemplateColumns: `repeat(${gridColumn}, minmax(0, ${columnWidth}))`,
        gridGap: `${padding}px`
      },
      ".brz & ul.page-numbers": {
        color: styleColor({
          v,
          device: "desktop",
          state: "normal",
          prefix: "paginationColor"
        }),
        marginTop: `${paginationSpacing}px`
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          gridTemplateColumns: `repeat(${tabletGridColumn}, minmax(0, ${tabletColumnWidth}))`,
          gridGap: `${tabletPadding}px`
        },
        ".brz & ul.page-numbers": {
          marginTop: `${tabletPaginationSpacing}px`
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          gridTemplateRows: "repeat(1, 1fr)",
          gridTemplateColumns: "repeat(1, 100%)",
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

  const { gridColumn, padding, paginationSpacing, tabletGridColumn } = v;

  const columnWidth = gridColumn === 1 ? "100%" : `${100 / gridColumn}%`;

  const tabletColumnWidth =
    tabletGridColumn === 1 ? "100%" : `${100 / tabletGridColumn}%`;
  const tabletPadding = tabletSyncOnChange(v, "padding");
  const tabletPaginationSpacing = tabletSyncOnChange(v, "paginationSpacing");

  const mobilePadding = mobileSyncOnChange(v, "padding");
  const mobilePaginationSpacing = mobileSyncOnChange(v, "paginationSpacing");

  return {
    "--gridTemplateColumn": `repeat(${gridColumn}, minmax(0, ${columnWidth}))`,
    "--gridGap": `${padding}px`,
    "--color": styleColor({
      v,
      device: "desktop",
      state: "normal",
      prefix: "paginationColor"
    }),
    "--marginTop": `${paginationSpacing}px`,
    "--tabletGridTemplateColumn": `repeat(${tabletGridColumn}, minmax(0, ${tabletColumnWidth}))`,
    "--tabletGridGap": `${tabletPadding}px`,
    "--tabletMarginTop": `${tabletPaginationSpacing}px`,
    "--mobileGridGap": `${mobilePadding}px 0`,
    "--mobileMarginTop": `${mobilePaginationSpacing}px`
  };
}
