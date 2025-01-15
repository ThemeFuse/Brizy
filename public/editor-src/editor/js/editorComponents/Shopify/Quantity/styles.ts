import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms",
        "cssStyleColor",
        "cssStyleBorder",
        "cssStyleBgColor",
        "cssStyleBoxShadow",
        "cssStyleBorderRadius",
        "cssStyleElementShopifyQuantityLineHeight",
        "cssStyleSizeWidth",
        "cssStyleColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
