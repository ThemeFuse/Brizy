import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./index";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": { standart: ["cssStyleSizeWidth"] },
    ".brz &&:hover .brz-hr": {
      standart: ["cssStyleElementLineBorder", "cssStyleBorderRadius"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-line-container:before": {
      standart: [
        "cssStyleElementLineContentAlignBefore",
        "cssStyleCustomLineBgColor",
        "cssStyleCustomLineSize",
        "cssStyleCustomLineAmount",
        "cssStyleElementLineBorder",
        "cssStyleElementLineStyledLineType",
        "cssStyleBorderRadius"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-line-container:after": {
      standart: [
        "cssStyleElementLineDisableAfter",
        "cssStyleElementLineContentAlignAfter",
        "cssStyleCustomLineBgColor",
        "cssStyleCustomLineSize",
        "cssStyleCustomLineAmount",
        "cssStyleElementLineBorder",
        "cssStyleElementLineStyledLineType",
        "cssStyleBorderRadius"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-line-content": {
      standart: ["cssStyleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover.brz-line-text .brz-line-content": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleElementLineSpacing",
        "cssStyleTextShadow"
      ]
    },
    ".brz &&:hover.brz-line-icon .brz-line-content": {
      standart: ["cssStyleElementLineIconSize", "cssStyleElementLineIconRotate"]
    },
    ".brz &&:hover .brz-line-icon-wrapper": {
      standart: [
        "cssStyleBoxShadow",
        "cssStyleBorderRadius",
        "cssStyleElementLineSpacing",
        "cssStyleElementLineIconBgColor",
        "cssStyleElementLineIconBorder",
        "cssStyleElementLineIconPadding"
      ],
      interval: ["cssStyleHoverTransition"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
