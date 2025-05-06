import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
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
        "cssStyleElementTitleTextShadow",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms"
      ]
    },
    ".brz &&:hover *": {
      standart: ["cssStyleColor", "cssStyleHoverTransition"]
    },
    // :not(.brz-btn) was added to win specificity battle
    // with standard .brz-a styles
    ".brz &&:hover > .brz-a.brz-a:not(.brz-btn)": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover .brz-wp-title-content": {
      standart: ["cssStyleStrokeText"]
    }
  };

  return renderStyles({ ...data, styles });
}
