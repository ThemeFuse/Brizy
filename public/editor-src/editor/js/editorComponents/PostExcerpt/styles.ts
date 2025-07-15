import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleContentAlign"]
    },
    ".brz && *": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms"
      ]
    },
    ".brz &&:hover *": {
      standart: ["cssStyleColor"]
    },
    ".brz && > .brz-a.brz-a:not(.brz-btn):hover": {
      standart: ["cssStyleColor"]
    }
  };
  return renderStyles({ ...data, styles });
}
