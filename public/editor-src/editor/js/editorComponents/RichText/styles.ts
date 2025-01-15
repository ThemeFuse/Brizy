import { ElementModel } from "visual/component/Elements/Types";
import { isEditor } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidth", "cssStyleBlendMode"]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleDC(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementRichTextAlign",
        "cssStyleElementRichTextFontFamily",
        "cssStyleElementRichTextFontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3TextTransform",
        "cssStyleElementRichTextDCUppercase"
      ]
    },
    ".brz &&:hover span": {
      standart: [
        "cssStyleElementRichTextDCColor",
        "cssStyleElementRichTextDCGradient",
        "cssStyleElementTitleTextShadow",
        "cssStyleElementRichTextBgImage",
        "cssStyleTypography3Script"
      ]
    },
    ".brz &&:hover span::before": {
      standart: [
        "cssStyleElementRichTextDCBackground",
        "cssStyleElementRichTextDCGradientBackground"
      ]
    },
    ".brz &&:hover *": {
      standart: ["cssStyleElementRichTextDCUppercase"]
    },
    ".brz &&:hover > .brz-a.brz-a:not(.brz-btn)": {
      standart: [
        "cssStyleColor",
        "cssStyleElementRichTextGradient",
        "cssStyleTextShadow"
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
    ".brz && *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(b):not(strong):not(i):not(span)":
      {
        standart: [
          "cssStyleElementRichTextFontFamily",
          "cssStyleElementRichTextFontSize",
          "cssStyleTypography3LineHeight",
          "cssStyleTypography3FontWeight",
          "cssStyleTypography3LetterSpacing",
          "cssStyleTypography3FontVariation",
          "cssStyleTypography3TextTransform"
        ]
      },
    ".brz && strong, .brz && b": {
      standart: [
        "cssStyleElementRichTextFontFamily",
        "cssStyleElementRichTextFontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3TextTransform"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleHeading(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const { renderContext } = data;
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleColor",
        ...(isEditor(renderContext) ? [] : ["cssStyleElementRichTextColor"]),
        "cssStyleElementRichTextMarginTop",
        "cssStyleElementRichTextMarginBottom",
        "cssStyleElementRichTextAlign",
        "cssStyleElementRichTextFontFamily",
        "cssStyleElementRichTextFontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3TextTransform",
        "cssStyleTypography3Script"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
