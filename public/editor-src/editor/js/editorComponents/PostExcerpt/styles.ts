import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: [
        "cssStyleContentAlign",
        "cssStyleElementPostExcerptNumberOfLines"
      ]
    },
    ".brz && h1": {
      standart: [
        "cssStyleElementRichTextH1FontFamily",
        "cssStyleElementRichTextH1FontSize",
        "cssStyleElementRichTextH1LineHeight",
        "cssStyleElementRichTextH1FontWeight",
        "cssStyleElementRichTextH1LetterSpacing",
        "cssStyleElementRichTextH1FontVariation",
        "cssStyleElementRichTextH1TextTransform",
        "cssStyleElementRichTextH1Script"
      ]
    },
    ".brz && h2": {
      standart: [
        "cssStyleElementRichTextH2FontFamily",
        "cssStyleElementRichTextH2FontSize",
        "cssStyleElementRichTextH2LineHeight",
        "cssStyleElementRichTextH2FontWeight",
        "cssStyleElementRichTextH2LetterSpacing",
        "cssStyleElementRichTextH2FontVariation",
        "cssStyleElementRichTextH2TextTransform",
        "cssStyleElementRichTextH2Script"
      ]
    },
    ".brz && h3": {
      standart: [
        "cssStyleElementRichTextH3FontFamily",
        "cssStyleElementRichTextH3FontSize",
        "cssStyleElementRichTextH3LineHeight",
        "cssStyleElementRichTextH3FontWeight",
        "cssStyleElementRichTextH3LetterSpacing",
        "cssStyleElementRichTextH3FontVariation",
        "cssStyleElementRichTextH3TextTransform",
        "cssStyleElementRichTextH3Script"
      ]
    },
    ".brz && h4": {
      standart: [
        "cssStyleElementRichTextH4FontFamily",
        "cssStyleElementRichTextH4FontSize",
        "cssStyleElementRichTextH4LineHeight",
        "cssStyleElementRichTextH4FontWeight",
        "cssStyleElementRichTextH4LetterSpacing",
        "cssStyleElementRichTextH4FontVariation",
        "cssStyleElementRichTextH4TextTransform",
        "cssStyleElementRichTextH4Script"
      ]
    },
    ".brz && h5": {
      standart: [
        "cssStyleElementRichTextH5FontFamily",
        "cssStyleElementRichTextH5FontSize",
        "cssStyleElementRichTextH5LineHeight",
        "cssStyleElementRichTextH5FontWeight",
        "cssStyleElementRichTextH5LetterSpacing",
        "cssStyleElementRichTextH5FontVariation",
        "cssStyleElementRichTextH5TextTransform",
        "cssStyleElementRichTextH5Script"
      ]
    },
    ".brz && h6": {
      standart: [
        "cssStyleElementRichTextH6FontFamily",
        "cssStyleElementRichTextH6FontSize",
        "cssStyleElementRichTextH6LineHeight",
        "cssStyleElementRichTextH6FontWeight",
        "cssStyleElementRichTextH6LetterSpacing",
        "cssStyleElementRichTextH6FontVariation",
        "cssStyleElementRichTextH6TextTransform",
        "cssStyleElementRichTextH6Script"
      ]
    },
    ".brz && *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(strong):not(b)":
      {
        standart: [
          "cssStyleTypography2FontFamily",
          "cssStyleTypography2FontSize",
          "cssStyleTypography2LineHeight",
          "cssStyleTypography2FontWeight",
          "cssStyleTypography2LetterSpacing",
          "cssStyleTypography2FontVariation",
          "cssStyleTextTransforms"
        ]
      },
    ".brz &&:hover *": {
      standart: ["cssStyleColor"]
    },
    ".brz && > .brz-a.brz-a:not(.brz-btn):hover": {
      standart: ["cssStyleColor"]
    }
  };
  return renderStyles({ ...data, styles });
}
