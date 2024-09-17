import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): [string, string, string] {
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

  return renderStyles({ v, vs, vd, styles }) as [string, string, string];
}
