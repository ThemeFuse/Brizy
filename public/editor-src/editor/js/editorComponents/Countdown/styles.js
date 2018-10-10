import classnames from "classnames";
import { css } from "glamor";
import { hexToRgba } from "visual/utils/color";
import { getFontById } from "visual/utils/fonts";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

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
        fontFamily: "var(--fontFamily)",
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
      colorHex,
      colorOpacity,
      mobileFontSize,
      mobileLineHeight,
      mobileFontWeight,
      mobileLetterSpacing
    } = v;

    const labelFontSize = getLabelSize(fontSize);
    const mobileLabelFontSize = getLabelSize(mobileFontSize);

    glamorObj = {
      ".brz &": {
        width: `${width}%`,
        color: hexToRgba(colorHex, colorOpacity),
        fontSize: fontSize,
        lineHeight: lineHeight,
        fontFamily: getFontById(fontFamily).family,
        fontWeight: fontWeight,
        letterSpacing: letterSpacing,

        "& .brz-countdown__label": {
          fontSize: `calc(${fontSize}px - ${labelFontSize}%)`
        }
      },
      "@media (max-width: 767px)": {
        ".brz &": {
          width: `${mobileSyncOnChange(v, "width")}%`,
          fontSize: mobileFontSize,
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
    colorHex,
    colorOpacity,
    mobileFontSize,
    mobileLineHeight,
    mobileFontWeight,
    mobileLetterSpacing
  } = v;

  const labelFontSize = getLabelSize(fontSize);
  const mobileLabelFontSize = getLabelSize(mobileFontSize);

  return {
    "--fontSize": `${fontSize}px`,
    "--labelFontSize": `calc(${fontSize}px - ${labelFontSize}%)`,
    "--fontFamily": getFontById(fontFamily).family,
    "--fontWeight": fontWeight,
    "--lineHeight": lineHeight,
    "--letterSpacing": `${letterSpacing}px`,
    "--mobileFontSize": `${mobileFontSize}px`,
    "--mobileLabelFontSize": `calc(${mobileFontSize}px - ${mobileLabelFontSize}%)`,
    "--mobileLineHeight": mobileLineHeight,
    "--mobileFontWeight": mobileFontWeight,
    "--mobileLetterSpacing": `${mobileLetterSpacing}px`,
    "--width": `${width}%`,
    "--mobileWidth": `${mobileSyncOnChange(v, "width")}%`,
    "--color": hexToRgba(colorHex, colorOpacity)
  };
}
