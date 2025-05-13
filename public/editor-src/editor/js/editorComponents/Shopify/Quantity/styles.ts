import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms",
        "cssStyleElementShopifyQuantityLineHeight",
        "cssStyleBorderRadius",
        "cssStyleSizeWidth"
      ]
    },
    ".brz &&:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleBorder",
        "cssStyleBgColor",
        "cssStyleBoxShadow",
        "cssStyleColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
