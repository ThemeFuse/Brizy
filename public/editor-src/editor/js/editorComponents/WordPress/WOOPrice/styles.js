import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover .brz-price .price": {
      standart: ["cssStyleElementWOOPriceColumn"]
    },
    ".brz &&:hover .woocommerce-Price-amount": {
      standart: [
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
        "cssStyleElementWOOPriceSpacing"
      ]
    },
    ".brz &&:hover del": {
      standart: [
        "cssStyleElementWOOPriceSaleFontFamily",
        "cssStyleElementWOOPriceSaleFontSize",
        "cssStyleElementWOOPriceSaleLineHeight",
        "cssStyleElementWOOPriceSaleFontWeight",
        "cssStyleElementWOOPriceSaleLetterSpacing",
        "cssStyleElementWOOPriceColorSale"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
