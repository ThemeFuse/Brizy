import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types";

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
    ".brz &&:hover": {
      standart: [
        "cssStyleContentAlign",
        "cssStyleColor",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleElementTitleTextShadow"
      ]
    },
    ".brz &&:hover > .brz-a.brz-a:not(.brz-btn)": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover .brz-shopify-vendor__title": {
      standart: ["cssStyleStrokeText"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}
