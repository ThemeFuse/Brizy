import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export const style = (data: DynamicStylesProps<Value>): OutputStyle => {
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
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms",
        "cssStyleColor",
        "cssStyleElementPostInfoSpacingCloud"
      ]
    },
    ".brz && .brz-ui-ed-list-items .brz-ui-ed-list-item svg": {
      standart: ["cssStyleElementPostInfoColorIcons"]
    }
  };

  return renderStyles({ ...data, styles });
};
