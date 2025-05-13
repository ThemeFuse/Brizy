import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz && > div > p.price": {
      standart: [
        "cssStyleElementWOOPriceColumn",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms"
      ]
    },
    ".brz &&:hover > div > p.price": {
      standart: ["cssStyleColor"]
    },
    ".brz && ins": {
      standart: [
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms",
        "cssStyleElementWOOPriceSpacingLast"
      ]
    },
    ".brz && del": {
      standart: [
        "cssStyleElementWOOPriceSaleFontFamily",
        "cssStyleElementWOOPriceSaleFontSize",
        "cssStyleElementWOOPriceSaleLineHeight",
        "cssStyleElementWOOPriceSaleFontWeight",
        "cssStyleElementWOOPriceSaleLetterSpacing",
        "cssStyleElementWOOPriceSaleFontVariation",
        "cssStyleElementWOOPriceSaleTextTransform",
        "cssStyleElementWOOPriceSpacingFirst"
      ]
    },
    ".brz &&:hover del": {
      standart: ["cssStyleElementWOOPriceColorSale"]
    },
    ".brz && .amount:first-child": {
      standart: ["cssStyleElementWOOPriceSpacingFirst"]
    },
    ".brz && .amount:nth-child(2)": {
      standart: ["cssStyleElementWOOPriceSpacingLast"]
    }
  };

  return renderStyles({ ...data, styles });
}
