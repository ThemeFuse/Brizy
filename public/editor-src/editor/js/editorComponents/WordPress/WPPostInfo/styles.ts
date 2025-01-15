import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./toolbar";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz &&:hover .brz-wp__postinfo .brz-li": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms",
        "cssStyleColor",
        "cssStyleElementPostInfoSpacing"
      ]
    },
    ".brz &&:hover .brz-wp__postinfo .brz-icon-svg": {
      standart: ["cssStyleElementPostInfoColorIcons"]
    }
  };

  return renderStyles({ ...data, styles });
}
