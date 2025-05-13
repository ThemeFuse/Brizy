import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz && .woocommerce-product-attributes-item": {
      standart: [
        "cssStyleElementWOOAttributesAttributesFontFamily",
        "cssStyleElementWOOAttributesAttributesFontSize",
        "cssStyleElementWOOAttributesAttributesFontWeight",
        "cssStyleElementWOOAttributesAttributesLetterSpacing",
        "cssStyleElementWOOAttributesAttributesFontVariation",
        "cssStyleElementWOOAttributesAttributesTextTransform"
      ]
    },
    ".brz &&:hover .woocommerce-product-attributes-item": {
      standart: ["cssStyleElementWOOAttributesAttributeColor"]
    },
    ".brz && .woocommerce-product-attributes-item .woocommerce-product-attributes-item__label, .brz && .woocommerce-product-attributes-item .woocommerce-product-attributes-item__value":
      {
        standart: [
          "cssStyleElementWOOAttributesAttributesLineHeight",
          "cssStyleElementWOOAttributesSpacing"
        ]
      },
    ".brz &&:hover table th, .brz &&:hover table td": {
      standart: ["cssStyleElementWOOAttributesBorder"]
    },
    ".brz && table tr:last-child th, .brz && table tr:last-child td": {
      standart: ["cssStyleElementWOOAttributesLastElementBorder"]
    },
    ".brz && h2": {
      standart: [
        "cssStyleElementWOOAdditionalTitleFontFamily",
        "cssStyleElementWOOAdditionalTitleFontSize",
        "cssStyleElementWOOAdditionalTitleLineHeight",
        "cssStyleElementWOOAdditionalTitleFontWeight",
        "cssStyleElementWOOAdditionalTitleLetterSpacing",
        "cssStyleElementWOOAdditionalTitleFontVariation",
        "cssStyleElementWOOAdditionalTitleTextTransform",
        "cssStyleElementWOOAdditionalTitleSpacing"
      ]
    },
    ".brz &&:hover h2": {
      standart: ["cssStyleElementWOOAdditionalTitleColor"]
    }
  };

  return renderStyles({ ...data, styles });
}
