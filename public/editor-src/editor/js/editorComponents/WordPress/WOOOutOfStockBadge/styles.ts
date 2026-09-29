import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz && .brz-woo-out-of-stock-badge__container": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-woo-out-of-stock-badge__container": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"]
    },
    ".brz && .brz-woo-out-of-stock-badge__label": {
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
    ".brz &&:hover .brz-woo-out-of-stock-badge__label": {
      standart: ["cssStyleColor"]
    }
  };

  return renderStyles({ ...data, styles });
}
