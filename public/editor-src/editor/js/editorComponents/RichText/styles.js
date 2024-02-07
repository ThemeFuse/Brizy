import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidth", "cssStyleBlendMode"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleDC(v, vs, vd) {
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
        "cssStyleElementRichTextDCUppercase"
      ]
    },
    ".brz &&:hover span": {
      standart: [
        "cssStyleElementRichTextDCColor",
        "cssStyleElementRichTextDCGradient",
        "cssStyleElementTitleTextShadow",
        "cssStyleElementRichTextBgImage"
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
        "cssStyleElementRichTextH1FontVariation"
      ]
    },
    ".brz && h2": {
      standart: [
        "cssStyleElementRichTextH2FontFamily",
        "cssStyleElementRichTextH2FontSize",
        "cssStyleElementRichTextH2LineHeight",
        "cssStyleElementRichTextH2FontWeight",
        "cssStyleElementRichTextH2LetterSpacing",
        "cssStyleElementRichTextH2FontVariation"
      ]
    },
    ".brz && h3": {
      standart: [
        "cssStyleElementRichTextH3FontFamily",
        "cssStyleElementRichTextH3FontSize",
        "cssStyleElementRichTextH3LineHeight",
        "cssStyleElementRichTextH3FontWeight",
        "cssStyleElementRichTextH3LetterSpacing",
        "cssStyleElementRichTextH3FontVariation"
      ]
    },
    ".brz && h4": {
      standart: [
        "cssStyleElementRichTextH4FontFamily",
        "cssStyleElementRichTextH4FontSize",
        "cssStyleElementRichTextH4LineHeight",
        "cssStyleElementRichTextH4FontWeight",
        "cssStyleElementRichTextH4LetterSpacing",
        "cssStyleElementRichTextH4FontVariation"
      ]
    },
    ".brz && h5": {
      standart: [
        "cssStyleElementRichTextH5FontFamily",
        "cssStyleElementRichTextH5FontSize",
        "cssStyleElementRichTextH5LineHeight",
        "cssStyleElementRichTextH5FontWeight",
        "cssStyleElementRichTextH5LetterSpacing",
        "cssStyleElementRichTextH5FontVariation"
      ]
    },
    ".brz && h6": {
      standart: [
        "cssStyleElementRichTextH6FontFamily",
        "cssStyleElementRichTextH6FontSize",
        "cssStyleElementRichTextH6LineHeight",
        "cssStyleElementRichTextH6FontWeight",
        "cssStyleElementRichTextH6LetterSpacing",
        "cssStyleElementRichTextH6FontVariation"
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
          "cssStyleTypography3FontVariation"
        ]
      },
    ".brz && strong, .brz && b": {
      standart: [
        "cssStyleElementRichTextFontFamily",
        "cssStyleElementRichTextFontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleHeading(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleColor",
        ...(IS_EDITOR ? [] : ["cssStyleElementRichTextColor"]),
        "cssStyleElementRichTextMarginTop",
        "cssStyleElementRichTextMarginBottom",
        "cssStyleElementRichTextAlign",
        "cssStyleElementRichTextFontFamily",
        "cssStyleElementRichTextFontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
