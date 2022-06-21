import { renderStyles } from "visual/utils/cssStyle";
import { ElementModel } from "visual/component/Elements/Types";

export function style(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): [string, string, string] {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": { standart: ["cssStyleSizeWidth"] },
    ".brz &&:hover .brz-hr": { standart: ["cssStyleElementLineBorder"] },

    ".brz &&:hover .brz-line-container:before": {
      standart: [
        "cssStyleElementLineBorder",
        "cssStyleElementLineContentAlignBefore"
      ]
    },
    ".brz &&:hover .brz-line-container:after": {
      standart: [
        "cssStyleElementLineBorder",
        "cssStyleElementLineContentAlignAfter"
      ]
    },
    ".brz &&:hover .brz-line-content": {
      standart: ["cssStyleColor", "cssStyleElementLineSpacing"]
    },
    ".brz &&:hover.brz-line-text .brz-line-content": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing"
      ]
    },
    ".brz &&:hover.brz-line-icon .brz-line-content": {
      standart: ["cssStyleElementLineIconSize"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
