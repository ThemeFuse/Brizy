import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&:hover .woocommerce-product-details__short-description *": {
      standart: ["cssStyleElementWPPostContentExcerptAlign"]
    },
    ".brz && h1:hover": {
      standart: [
        "cssStyleElementWPPostContentH1Color",
        "cssStyleElementWPPostContentTypography2H1FontFamily",
        "cssStyleElementWPPostContentTypography2H1FontSize",
        "cssStyleElementWPPostContentTypography2H1LineHeight",
        "cssStyleElementWPPostContentTypography2H1FontWeight",
        "cssStyleElementWPPostContentTypography2H1LetterSpacing",
        "cssStyleElementWPPostContentTypography2H1FontVariation",
        "cssStyleElementWPPostContentH1TextTransform"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && h2:hover": {
      standart: [
        "cssStyleElementWPPostContentH2Color",
        "cssStyleElementWPPostContentTypography2H2FontFamily",
        "cssStyleElementWPPostContentTypography2H2FontSize",
        "cssStyleElementWPPostContentTypography2H2LineHeight",
        "cssStyleElementWPPostContentTypography2H2FontWeight",
        "cssStyleElementWPPostContentTypography2H2LetterSpacing",
        "cssStyleElementWPPostContentTypography2H2FontVariation",
        "cssStyleElementWPPostContentH2TextTransform"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && h3:hover": {
      standart: [
        "cssStyleElementWPPostContentH3Color",
        "cssStyleElementWPPostContentTypography2H3FontFamily",
        "cssStyleElementWPPostContentTypography2H3FontSize",
        "cssStyleElementWPPostContentTypography2H3LineHeight",
        "cssStyleElementWPPostContentTypography2H3FontWeight",
        "cssStyleElementWPPostContentTypography2H3LetterSpacing",
        "cssStyleElementWPPostContentTypography2H3FontVariation",
        "cssStyleElementWPPostContentH3TextTransform"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && h4:hover": {
      standart: [
        "cssStyleElementWPPostContentH4Color",
        "cssStyleElementWPPostContentTypography2H4FontFamily",
        "cssStyleElementWPPostContentTypography2H4FontSize",
        "cssStyleElementWPPostContentTypography2H4LineHeight",
        "cssStyleElementWPPostContentTypography2H4FontWeight",
        "cssStyleElementWPPostContentTypography2H4LetterSpacing",
        "cssStyleElementWPPostContentTypography2H4FontVariation",
        "cssStyleElementWPPostContentH4TextTransform"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && h5:hover": {
      standart: [
        "cssStyleElementWPPostContentH5Color",
        "cssStyleElementWPPostContentTypography2H5FontFamily",
        "cssStyleElementWPPostContentTypography2H5FontSize",
        "cssStyleElementWPPostContentTypography2H5LineHeight",
        "cssStyleElementWPPostContentTypography2H5FontWeight",
        "cssStyleElementWPPostContentTypography2H5LetterSpacing",
        "cssStyleElementWPPostContentTypography2H5FontVariation",
        "cssStyleElementWPPostContentH5TextTransform"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && h6:hover": {
      standart: [
        "cssStyleElementWPPostContentH6Color",
        "cssStyleElementWPPostContentTypography2H6FontFamily",
        "cssStyleElementWPPostContentTypography2H6FontSize",
        "cssStyleElementWPPostContentTypography2H6LineHeight",
        "cssStyleElementWPPostContentTypography2H6FontWeight",
        "cssStyleElementWPPostContentTypography2H6LetterSpacing",
        "cssStyleElementWPPostContentTypography2H6FontVariation",
        "cssStyleElementWPPostContentH6TextTransform"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover strong, .brz &&:hover b": {
      standart: [
        "cssStyleElementWPPostContentParagraphColor",
        "cssStyleElementWPPostContentTypography2ParagraphFontFamily",
        "cssStyleElementWPPostContentTypography2ParagraphFontSize",
        "cssStyleElementWPPostContentTypography2ParagraphLineHeight",
        "cssStyleElementWPPostContentTypography2ParagraphLetterSpacing",
        "cssStyleElementWPPostContentTypography2ParagraphFontWeight",
        "cssStyleElementWPPostContentTypography2ParagraphFontVariation",
        "cssStyleElementWPPostContentParagraphTextTransform"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(b):not(strong):not(i):not(span):hover":
      {
        standart: [
          "cssStyleElementWPPostContentParagraphColor",
          "cssStyleElementWPPostContentTypography2ParagraphFontFamily",
          "cssStyleElementWPPostContentTypography2ParagraphFontSize",
          "cssStyleElementWPPostContentTypography2ParagraphLineHeight",
          "cssStyleElementWPPostContentTypography2ParagraphFontWeight",
          "cssStyleElementWPPostContentTypography2ParagraphLetterSpacing",
          "cssStyleElementWPPostContentTypography2ParagraphFontVariation",
          "cssStyleElementWPPostContentParagraphTextTransform"
        ],
        interval: ["cssStyleHoverTransition"]
      }
  };

  return renderStyles({ ...data, styles });
}
