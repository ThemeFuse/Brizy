import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz && .woocommerce-product-details__short-description *": {
      standart: ["cssStyleElementWPPostContentExcerptAlign"]
    },
    ".brz && h1": {
      standart: [
        "cssStyleElementWPPostContentTypography2H1FontFamily",
        "cssStyleElementWPPostContentTypography2H1FontSize",
        "cssStyleElementWPPostContentTypography2H1LineHeight",
        "cssStyleElementWPPostContentTypography2H1FontWeight",
        "cssStyleElementWPPostContentTypography2H1LetterSpacing",
        "cssStyleElementWPPostContentTypography2H1FontVariation",
        "cssStyleElementWPPostContentH1TextTransform"
      ]
    },
    ".brz && h1:hover": {
      standart: ["cssStyleElementWPPostContentH1Color"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && h2": {
      standart: [
        "cssStyleElementWPPostContentTypography2H2FontFamily",
        "cssStyleElementWPPostContentTypography2H2FontSize",
        "cssStyleElementWPPostContentTypography2H2LineHeight",
        "cssStyleElementWPPostContentTypography2H2FontWeight",
        "cssStyleElementWPPostContentTypography2H2LetterSpacing",
        "cssStyleElementWPPostContentTypography2H2FontVariation",
        "cssStyleElementWPPostContentH2TextTransform"
      ]
    },
    ".brz && h2:hover": {
      standart: ["cssStyleElementWPPostContentH2Color"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && h3": {
      standart: [
        "cssStyleElementWPPostContentTypography2H3FontFamily",
        "cssStyleElementWPPostContentTypography2H3FontSize",
        "cssStyleElementWPPostContentTypography2H3LineHeight",
        "cssStyleElementWPPostContentTypography2H3FontWeight",
        "cssStyleElementWPPostContentTypography2H3LetterSpacing",
        "cssStyleElementWPPostContentTypography2H3FontVariation",
        "cssStyleElementWPPostContentH3TextTransform"
      ]
    },
    ".brz && h3:hover": {
      standart: ["cssStyleElementWPPostContentH3Color"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && h4": {
      standart: [
        "cssStyleElementWPPostContentTypography2H4FontFamily",
        "cssStyleElementWPPostContentTypography2H4FontSize",
        "cssStyleElementWPPostContentTypography2H4LineHeight",
        "cssStyleElementWPPostContentTypography2H4FontWeight",
        "cssStyleElementWPPostContentTypography2H4LetterSpacing",
        "cssStyleElementWPPostContentTypography2H4FontVariation",
        "cssStyleElementWPPostContentH4TextTransform"
      ]
    },
    ".brz && h4:hover": {
      standart: ["cssStyleElementWPPostContentH4Color"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && h5": {
      standart: [
        "cssStyleElementWPPostContentTypography2H5FontFamily",
        "cssStyleElementWPPostContentTypography2H5FontSize",
        "cssStyleElementWPPostContentTypography2H5LineHeight",
        "cssStyleElementWPPostContentTypography2H5FontWeight",
        "cssStyleElementWPPostContentTypography2H5LetterSpacing",
        "cssStyleElementWPPostContentTypography2H5FontVariation",
        "cssStyleElementWPPostContentH5TextTransform"
      ]
    },
    ".brz && h5:hover": {
      standart: ["cssStyleElementWPPostContentH5Color"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && h6": {
      standart: [
        "cssStyleElementWPPostContentTypography2H6FontFamily",
        "cssStyleElementWPPostContentTypography2H6FontSize",
        "cssStyleElementWPPostContentTypography2H6LineHeight",
        "cssStyleElementWPPostContentTypography2H6FontWeight",
        "cssStyleElementWPPostContentTypography2H6LetterSpacing",
        "cssStyleElementWPPostContentTypography2H6FontVariation",
        "cssStyleElementWPPostContentH6TextTransform"
      ]
    },
    ".brz && h6:hover": {
      standart: ["cssStyleElementWPPostContentH6Color"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && strong, .brz && b": {
      standart: [
        "cssStyleElementWPPostContentTypography2ParagraphFontFamily",
        "cssStyleElementWPPostContentTypography2ParagraphFontSize",
        "cssStyleElementWPPostContentTypography2ParagraphLineHeight",
        "cssStyleElementWPPostContentTypography2ParagraphLetterSpacing",
        "cssStyleElementWPPostContentTypography2ParagraphFontWeight",
        "cssStyleElementWPPostContentTypography2ParagraphFontVariation",
        "cssStyleElementWPPostContentParagraphTextTransform"
      ]
    },
    ".brz &&:hover strong, .brz &&:hover b": {
      standart: ["cssStyleElementWPPostContentParagraphColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(b):not(strong):not(i):not(span)":
      {
        standart: [
          "cssStyleElementWPPostContentTypography2ParagraphFontFamily",
          "cssStyleElementWPPostContentTypography2ParagraphFontSize",
          "cssStyleElementWPPostContentTypography2ParagraphLineHeight",
          "cssStyleElementWPPostContentTypography2ParagraphFontWeight",
          "cssStyleElementWPPostContentTypography2ParagraphLetterSpacing",
          "cssStyleElementWPPostContentTypography2ParagraphFontVariation",
          "cssStyleElementWPPostContentParagraphTextTransform"
        ]
      },
    ".brz && *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(b):not(strong):not(i):not(span):hover":
      {
        standart: ["cssStyleElementWPPostContentParagraphColor"],
        interval: ["cssStyleHoverTransition"]
      }
  };

  return renderStyles({ ...data, styles });
}
