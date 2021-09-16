import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover > div > p.price": {
      standart: [
        "cssStyleElementWOOPriceColumn",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleColor"
      ]
    },
    ".brz &&:hover ins": {
      standart: [
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
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

  return renderStyles({ v, vs, vd, styles });
}
