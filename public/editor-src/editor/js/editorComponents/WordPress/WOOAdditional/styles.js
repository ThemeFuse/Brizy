import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover > div > .brz-additional-information > .brz-wooadditional__title": {
      standart: [
        "cssStyleElementWOOAdditionalTitleFontFamily",
        "cssStyleElementWOOAdditionalTitleFontSize",
        "cssStyleElementWOOAdditionalTitleLineHeight",
        "cssStyleElementWOOAdditionalTitleFontWeight",
        "cssStyleElementWOOAdditionalTitleLetterSpacing",
        "cssStyleElementWOOAdditionalTitleColor",
        "cssStyleElementWOOAdditionalSpacing"
      ]
    },
    ".brz &&:hover > div > .brz-additional-information > .brz-wooadditional": {
      standart: [
        "cssStyleElementWOOAdditionalBorderColor",
        "cssStyleElementWOOAdditionalBorderWidth"
      ]
    },
    ".brz &&:hover > div > .brz-additional-information > .brz-wooadditional > .woocommerce-product-attributes-item": {
      standart: [
        "cssStyleElementWOOAdditionalBorderColor",
        "cssStyleElementWOOAdditionalBorderWidth",
        "cssStyleElementWOOAdditionalAttributesFontFamily",
        "cssStyleElementWOOAdditionalAttributesFontSize",
        "cssStyleElementWOOAdditionalAttributesLineHeight",
        "cssStyleElementWOOAdditionalAttributesFontWeight",
        "cssStyleElementWOOAdditionalAttributesLetterSpacing",
        "cssStyleElementWOOAdditionalAttributeColor"
      ]
    },
    ".brz &&:hover > div > .brz-additional-information > .brz-wooadditional > .woocommerce-product-attributes-item > .brz-wooadditional__item": {
      standart: ["cssStyleElementWOOAdditionalSpacing"]
    },
    ".brz &&:hover > div > .brz-additional-information > .brz-wooadditional > .woocommerce-product-attributes-item > .brz-wooadditional__label": {
      standart: [
        "cssStyleElementWOOAdditionalBorderColor",
        "cssStyleElementWOOAdditionalBorderWidth"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
