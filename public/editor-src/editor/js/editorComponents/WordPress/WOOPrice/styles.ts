import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&:hover > div > p.price": {
      standart: [
        "cssStyleElementWOOPriceColumn",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms",
        "cssStyleColor"
      ]
    },
    ".brz &&:hover ins": {
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
    ".brz &&:hover del": {
      standart: [
        "cssStyleElementWOOPriceSaleFontFamily",
        "cssStyleElementWOOPriceSaleFontSize",
        "cssStyleElementWOOPriceSaleLineHeight",
        "cssStyleElementWOOPriceSaleFontWeight",
        "cssStyleElementWOOPriceSaleLetterSpacing",
        "cssStyleElementWOOPriceColorSale",
        "cssStyleElementWOOPriceSaleFontVariation",
        "cssStyleElementWOOPriceSaleTextTransform",
        "cssStyleElementWOOPriceSpacingFirst"
      ]
    },
    ".brz &&:hover .amount:first-child": {
      standart: ["cssStyleElementWOOPriceSpacingFirst"]
    },
    ".brz &&:hover .amount:nth-child(2)": {
      standart: ["cssStyleElementWOOPriceSpacingLast"]
    }
  };

  return renderStyles({ ...data, styles });
}
