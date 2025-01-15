import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz &&:hover .woocommerce-product-attributes-item": {
      standart: [
        "cssStyleElementWOOAttributesAttributesFontFamily",
        "cssStyleElementWOOAttributesAttributesFontSize",
        "cssStyleElementWOOAttributesAttributesFontWeight",
        "cssStyleElementWOOAttributesAttributesLetterSpacing",
        "cssStyleElementWOOAttributesAttributesFontVariation",
        "cssStyleElementWOOAttributesAttributesTextTransform",
        "cssStyleElementWOOAttributesAttributeColor"
      ]
    },
    ".brz &&:hover .woocommerce-product-attributes-item .woocommerce-product-attributes-item__label":
      {
        standart: [
          "cssStyleElementWOOAttributesAttributesLineHeight",
          "cssStyleElementWOOAttributesSpacing"
        ]
      },
    ".brz &&:hover .woocommerce-product-attributes-item .woocommerce-product-attributes-item__value":
      {
        standart: [
          "cssStyleElementWOOAttributesAttributesLineHeight",
          "cssStyleElementWOOAttributesSpacing"
        ]
      },
    ".brz &&:hover table th": {
      standart: ["cssStyleElementWOOAttributesBorder"]
    },
    ".brz &&:hover table td": {
      standart: ["cssStyleElementWOOAttributesBorder"]
    },
    ".brz && table tr:last-child th, .brz && table tr:last-child td": {
      standart: ["cssStyleElementWOOAttributesLastElementBorder"]
    },
    ".brz &&:hover h2": {
      standart: [
        "cssStyleElementWOOAdditionalTitleFontFamily",
        "cssStyleElementWOOAdditionalTitleFontSize",
        "cssStyleElementWOOAdditionalTitleLineHeight",
        "cssStyleElementWOOAdditionalTitleFontWeight",
        "cssStyleElementWOOAdditionalTitleLetterSpacing",
        "cssStyleElementWOOAdditionalTitleFontVariation",
        "cssStyleElementWOOAdditionalTitleTextTransform",
        "cssStyleElementWOOAdditionalTitleColor",
        "cssStyleElementWOOAdditionalTitleSpacing"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
