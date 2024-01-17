import type { Value } from "./types";
import { renderStyles } from "visual/utils/cssStyle";

export const style = (
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] => {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&": {
      standart: ["cssStyleElementPostInfoAlign"]
    },
    ".brz && .brz-ui-ed-list-items": {
      standart: ["cssStyleElementPostInfoDirection"]
    },
    ".brz && .brz-ui-ed-list-items .brz-ui-ed-list-item": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleColor",
        "cssStyleElementPostInfoSpacingCloud"
      ]
    },
    ".brz && .brz-ui-ed-list-items .brz-ui-ed-list-item svg": {
      standart: ["cssStyleElementPostInfoColorIcons"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
};
