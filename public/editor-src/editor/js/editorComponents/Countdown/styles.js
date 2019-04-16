import classnames from "classnames";
import { css } from "glamor";
import { getFontById } from "visual/utils/fonts";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import { styleColor } from "visual/utils/style";

const getLabelSize = fontSize => {
  return fontSize <= 24 ? 20 : fontSize > 24 && fontSize <= 32 ? 40 : 60;
};

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz &": {
        color: "var(--color)",
        fontFamily: "var(--fontFamily)"
      },
      ".brz-ed--desktop &": {
        width: "var(--width)",
        fontSize: "var(--fontSize)",
        lineHeight: "var(--lineHeight)",
        fontWeight: "var(--fontWeight)",
        letterSpacing: "var(--letterSpacing)",

        "& .brz-countdown__label": {
          fontSize: "var(--labelFontSize)"
        }
      },
      ".brz-ed--tablet &": {
        width: "var(--tabletWidth)",
        fontSize: "var(--tabletFontSize)",
        lineHeight: "var(--tabletLineHeight)",
        fontWeight: "var(--tabletFontWeight)",
        letterSpacing: "var(--tabletLetterSpacing)",

        "& .brz-countdown__label": {
          fontSize: "var(--tabletLabelFontSize)"
        }
      },
      ".brz-ed--mobile &": {
        width: "var(--mobileWidth)",
        fontSize: "var(--mobileFontSize)",
        lineHeight: "var(--mobileLineHeight)",
        fontWeight: "var(--mobileFontWeight)",
        letterSpacing: "var(--mobileLetterSpacing)",

        "& .brz-countdown__label": {
          fontSize: "var(--mobileLabelFontSize)"
        }
      }
    };
  } else {
    const {
      fontSize,
      fontFamily,
      lineHeight,
      fontWeight,
      letterSpacing,
      width,

      // Tablet
      tabletFontSize,
      tabletLineHeight,
      tabletFontWeight,
      tabletLetterSpacing,

      // Mobile
      mobileFontSize,
      mobileLineHeight,
      mobileFontWeight,
      mobileLetterSpacing
    } = v;

    const labelFontSize = getLabelSize(fontSize);
    const tabletLabelFontSize = getLabelSize(tabletFontSize);
    const mobileLabelFontSize = getLabelSize(mobileFontSize);

    glamorObj = {
      ".brz &": {
        width: `${width}%`,
        color: styleColor({ v, device: "desktop", state: "normal" }),
        fontFamily: getFontById(fontFamily).family,
        fontSize,
        lineHeight,
        fontWeight,
        letterSpacing,

        "& .brz-countdown__label": {
          fontSize: `calc(${fontSize}px - ${labelFontSize}%)`
        }
      },
      "@media (max-width: 991px)": {
        ".brz &": {
          width: `${tabletSyncOnChange(v, "width")}%`,
          fontSize: `${tabletFontSize}px`,
          lineHeight: tabletLineHeight,
          fontWeight: tabletFontWeight,
          letterSpacing: `${tabletLetterSpacing}px`,

          "& .brz-countdown__label": {
            fontSize: `calc(${tabletFontSize}px - ${tabletLabelFontSize}%)`
          }
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          width: `${mobileSyncOnChange(v, "width")}%`,
          fontSize: `${mobileFontSize}px`,
          lineHeight: mobileLineHeight,
          fontWeight: mobileFontWeight,
          letterSpacing: `${mobileLetterSpacing}px`,

          "& .brz-countdown__label": {
            fontSize: `calc(${mobileFontSize}px - ${mobileLabelFontSize}%)`
          }
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-countdown", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const {
    fontSize,
    fontFamily,
    lineHeight,
    fontWeight,
    letterSpacing,
    width,


    // Tablet
    tabletFontSize,
    tabletLineHeight,
    tabletFontWeight,
    tabletLetterSpacing,

    // Mobile
    mobileFontSize,
    mobileLineHeight,
    mobileFontWeight,
    mobileLetterSpacing
  } = v;

  const labelFontSize = getLabelSize(fontSize);
  const tabletLabelFontSize = getLabelSize(tabletFontSize);
  const mobileLabelFontSize = getLabelSize(mobileFontSize);

  return {
    "--width": `${width}%`,
    "--fontSize": `${fontSize}px`,
    "--labelFontSize": `calc(${fontSize}px - ${labelFontSize}%)`,
    "--fontFamily": getFontById(fontFamily).family,
    "--fontWeight": fontWeight,
    "--lineHeight": lineHeight,
    "--letterSpacing": `${letterSpacing}px`,
    "--color": styleColor({ v, device: "desktop", state: "normal" }),

    // Tablet
    "--tabletWidth": `${tabletSyncOnChange(v, "width")}%`,
    "--tabletFontSize": `${tabletFontSize}px`,
    "--tabletLabelFontSize": `calc(${tabletFontSize}px - ${tabletLabelFontSize}%)`,
    "--tabletLineHeight": tabletLineHeight,
    "--tabletFontWeight": tabletFontWeight,
    "--tabletLetterSpacing": `${tabletLetterSpacing}px`,

    // Mobile
    "--mobileWidth": `${mobileSyncOnChange(v, "width")}%`,
    "--mobileFontSize": `${mobileFontSize}px`,
    "--mobileLabelFontSize": `calc(${mobileFontSize}px - ${mobileLabelFontSize}%)`,
    "--mobileLineHeight": mobileLineHeight,
    "--mobileFontWeight": mobileFontWeight,
    "--mobileLetterSpacing": `${mobileLetterSpacing}px`
  };
}
