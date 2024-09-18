import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { StylesProps } from "./types";

export function style(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel,
  props: StylesProps
): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementForm2MSIndicatorsAlign",
        "cssStyleElementForm2MSIndicatorsSpacing"
      ]
    },
    ".brz &&:hover.brz-form-ms-indicators-progressBar": {
      standart: [
        "cssStyleElementForm2MSProgressBgColor",
        "cssStyleElementForm2MSProgressBoxShadow"
      ]
    },
    ".brz && .brz-form-ms-indicator:not(.brz-form-ms-progress)": {
      standart: ["cssStyleElementForm2MSDividerIndent"]
    },
    ".brz && .brz-form-ms-indicator .brz-form-ms-indicator-number": {
      standart: ["cssStyleElementForm2MSNumberPadding", "cssStyleBorderRadius"]
    },
    ".brz && .brz-form-ms-indicator:not(.brz-form-ms-indicator__active):hover .brz-form-ms-indicator-number":
      {
        standart: [
          "cssStyleBorder",
          "cssStyleBgColor",
          "cssStyleElementForm2MSNumberColor",
          "cssStyleBoxShadow"
        ]
      },
    ".brz && .brz-form-ms-indicator .brz-form-ms-indicator-icon": {
      standart: [
        "cssStyleElementForm2MSNumberPadding",
        "cssStyleBorderRadius",
        "cssStyleIconSize"
      ]
    },
    ".brz && .brz-form-ms-indicator:not(.brz-form-ms-indicator__active):hover .brz-form-ms-indicator-icon":
      {
        standart: [
          "cssStyleBorder",
          "cssStyleBgColor",
          "cssStyleElementForm2MSNumberColor",
          "cssStyleBoxShadow"
        ]
      },
    ".brz && .brz-form-ms-indicator:not(.brz-form-ms-indicator__active):hover .brz-form-ms-indicator-icon .brz-icon-svg-custom":
      {
        standart: ["cssStyleElementForm2MSCustomIconColor"]
      },
    ".brz && .brz-form-ms-indicator .brz-form-ms-indicator-text": {
      standart: ["cssStyleElementForm2MSNumberPadding", "cssStyleBorderRadius"]
    },
    ".brz && .brz-form-ms-indicator:not(.brz-form-ms-indicator__active):hover .brz-form-ms-indicator-text":
      {
        standart: [
          "cssStyleElementForm2MSTextColor",
          "cssStyleBorder",
          "cssStyleBgColor",
          "cssStyleBoxShadow"
        ]
      },
    ".brz && .brz-form-ms-divider": {
      standart: [
        "cssStyleElementFomr2MSDividerMargin",
        "cssStyleElementFomr2MSDivider"
      ]
    },
    ".brz &&:hover .brz-form-ms-progress-bar": {
      standart: [
        "cssStyleElementForm2MSProgressColor",
        "cssStyleElementForm2MSProgressHeight",
        "cssStyleElementForm2MSTextColor"
      ]
    },
    ".brz &&:hover .brz-form-ms-progress-bar-text": {
      standart: ["cssStyleElementForm2MSTextColor"]
    },
    ".brz && .brz-form-ms-indicator-number,.brz && .brz-form-ms-indicator-text,.brz && .brz-form-ms-progress-bar-text,.brz && .brz-form-ms-indicator-text-under":
      {
        standart: [
          "cssStyleTypography2FontFamily",
          "cssStyleTypography2FontSize",
          "cssStyleTypography2FontWeight",
          "cssStyleTypography2LineHeight",
          "cssStyleTypography2LetterSpacing",
          "cssStyleTypography2FontVariation",
          "cssStyleTextTransforms"
        ]
      },
    ".brz && .brz-form-ms-indicator .brz-form-ms-indicator-text-under": {
      standart: ["cssStyleElementsForm2MSTextSpacing"]
    },
    ".brz && .brz-form-ms-indicator:not(.brz-form-ms-indicator__active):hover .brz-form-ms-indicator-text-under":
      { standart: ["cssStyleElementForm2MSTextColor"] },
    ".brz && .brz-form-ms-indicator__active .brz-form-ms-indicator-text ": {
      standart: [
        "cssStyleElementForm2MSActiveTextColor",
        "cssStyleElementForm2MSActiveBorder",
        "cssStyleElementForm2MSActiveBg",
        "cssStyleElementForm2MSActiveBoxShadow"
      ]
    },
    ".brz && .brz-form-ms-indicator__active .brz-form-ms-indicator-number": {
      standart: [
        "cssStyleElementForm2MSActiveNumberColor",
        "cssStyleElementForm2MSActiveBorder",
        "cssStyleElementForm2MSActiveBg",
        "cssStyleElementForm2MSActiveBoxShadow"
      ]
    },
    ".brz && .brz-form-ms-indicator__active .brz-form-ms-indicator-icon": {
      standart: [
        "cssStyleElementForm2MSActiveNumberColor",
        "cssStyleElementForm2MSActiveBorder",
        "cssStyleElementForm2MSActiveBg",
        "cssStyleElementForm2MSActiveBoxShadow"
      ]
    },
    ".brz && .brz-form-ms-indicator__active .brz-form-ms-indicator-text-under":
      { standart: ["cssStyleElementForm2MSActiveTextColor"] },
    ".brz && .brz-form-ms-indicator__active .brz-form-ms-indicator-icon .brz-icon-svg-custom":
      {
        standart: ["cssStyleElementForm2MSActiveCustomIconColor"]
      }
  };

  return renderStyles({ v, vs, vd, styles, props });
}
