import classnames from "classnames";
import { css } from "glamor";

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
    const { gridColumn, spacing, mobileSpacing: _mobileSpacing } = v;
    const mobileSpacing = _mobileSpacing === null ? spacing : _mobileSpacing;

    glamorObj = {
      ".brz &": {
        width: `calc(100% + ${spacing}px)`,
        margin: `${-(spacing / 2)}px`,

        "& .brz-image__gallery-item": {
          width: `${gridColumn > 1 ? 100 / gridColumn : 100}%`,
          padding: `${spacing / 2}px`
        }
      },
      "@media (max-width: 768px)": {
        ".brz &": {
          width: `calc(100% + ${mobileSpacing}px)`,
          margin: `${-(mobileSpacing / 2)}px`,

          "& .brz-image__gallery-item": {
            width: "100%",
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

  const { gridColumn, spacing, mobileSpacing: _mobileSpacing } = v;
  const mobileSpacing = _mobileSpacing === null ? spacing : _mobileSpacing;

  return {
    "--width": `calc(100% + ${spacing}px)`,
    "--itemWidth": `${gridColumn > 1 ? 100 / gridColumn : 100}%`,
    "--padding": `${spacing / 2}px`,
    "--margin": `${-(spacing / 2)}px`,
    "--mobileItemWidth": "100%",
    "--mobileWidth": `calc(100% + ${mobileSpacing}px)`,
    "--mobilePadding": `${mobileSpacing / 2}px`,
    "--mobileMargin": `${-(mobileSpacing / 2)}px`
  };
}
