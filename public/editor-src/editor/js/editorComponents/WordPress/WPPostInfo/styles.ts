import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { Value } from "./toolbar";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz && .brz-wp__postinfo .brz-li": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms",
        "cssStyleElementPostInfoSpacing"
      ]
    },
    ".brz &&:hover .brz-wp__postinfo .brz-li": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover .brz-wp__postinfo .brz-icon-svg": {
      standart: ["cssStyleElementPostInfoColorIcons"]
    }
  };

  return renderStyles({ ...data, styles });
}
