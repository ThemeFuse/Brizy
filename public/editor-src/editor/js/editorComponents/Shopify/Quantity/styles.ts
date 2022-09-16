import { renderStyles } from "visual/utils/cssStyle";
import { ElementModel } from "visual/component/Elements/Types";

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
