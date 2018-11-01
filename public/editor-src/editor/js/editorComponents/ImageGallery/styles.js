import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

export function styleClassName(v) {
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz-ed--desktop &": {
        width: "var(--width)",
        margin: "var(--margin)",

        "& .brz-image__gallery-item": {
          width: "var(--itemWidth)",
          padding: "var(--padding)"
        }
      },
      ".brz-ed--tablet &": {
        width: "var(--tabletWidth)",
        margin: "var(--tabletMargin)",

        "& .brz-image__gallery-item": {
          width: "var(--tabletItemWidth)",
          padding: "var(--tabletPadding)"
        }
      },
      ".brz-ed--mobile &": {
        width: "var(--mobileWidth)",
        margin: "var(--mobileMargin)",

        "& .brz-image__gallery-item": {
          width: "var(--mobileItemWidth)",
          padding: "var(--mobilePadding)"
        }
      }
    };
  } else {
    const { gridColumn, spacing, tabletGridColumn, mobileGridColumn } = v;
    const mobileSpacing = mobileSyncOnChange(v, "spacing");
    const tabletSpacing = tabletSyncOnChange(v, "spacing");

    glamorObj = {
      ".brz &": {
        width: `calc(100% + ${spacing}px)`,
        margin: `${-(spacing / 2)}px`,

        "& .brz-image__gallery-item": {
          width: `${gridColumn > 1 ? 100 / gridColumn : 100}%`,
          padding: `${spacing / 2}px`
        }
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          width: `calc(100% + ${tabletSpacing}px)`,
          margin: `${-(tabletSpacing / 2)}px`,

          "& .brz-image__gallery-item": {
            width: `${tabletGridColumn > 1 ? 100 / tabletGridColumn : 100}%`,
            padding: `${tabletSpacing / 2}px`
          }
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          width: `calc(100% + ${mobileSpacing}px)`,
          margin: `${-(mobileSpacing / 2)}px`,

          "& .brz-image__gallery-item": {
            width: `${mobileGridColumn > 1 ? 100 / mobileGridColumn : 100}%`,
            padding: `${mobileSpacing / 2}px`
          }
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));
  return classnames(
    "brz-image__gallery",
    { "brz-image__gallery-lightbox": v.lightBox === "on" },
    glamorClassName
  );
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const { gridColumn, spacing, tabletGridColumn, mobileGridColumn } = v;
  const mobileSpacing = mobileSyncOnChange(v, "spacing");
  const tabletSpacing = tabletSyncOnChange(v, "spacing");

  return {
    "--width": `calc(100% + ${spacing}px)`,
    "--itemWidth": `${gridColumn > 1 ? 100 / gridColumn : 100}%`,
    "--padding": `${spacing / 2}px`,
    "--margin": `${-(spacing / 2)}px`,

    // Tablet
    "--tabletItemWidth": `${
      tabletGridColumn > 1 ? 100 / tabletGridColumn : 100
    }%`,
    "--tabletWidth": `calc(100% + ${tabletSpacing}px)`,
    "--tabletPadding": `${tabletSpacing / 2}px`,
    "--tabletMargin": `${-(tabletSpacing / 2)}px`,

    // Mobile
    "--mobileItemWidth": `${
      mobileGridColumn > 1 ? 100 / mobileGridColumn : 100
    }%`,
    "--mobileWidth": `calc(100% + ${mobileSpacing}px)`,
    "--mobilePadding": `${mobileSpacing / 2}px`,
    "--mobileMargin": `${-(mobileSpacing / 2)}px`
  };
}
