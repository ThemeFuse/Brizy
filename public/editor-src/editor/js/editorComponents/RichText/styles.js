import { renderStyles } from "visual/utils/cssStyle";

// TODO: cssStyleContentAlign - check this function

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
        "cssStyleElementRichTextDCColor",
        "cssStyleElementRichTextDCGradient",
        "cssStyleElementTitleTextShadow",
        "cssStyleContentAlign",
        "cssStyleElementRichTextFontFamily",
        "cssStyleElementRichTextFontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleElementRichTextBgImage",
        "cssStyleElementRichTextDCUppercase"
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
        "cssStyleElementRichTextH1LetterSpacing"
      ]
    },
    ".brz && h2": {
      standart: [
        "cssStyleElementRichTextH2FontFamily",
        "cssStyleElementRichTextH2FontSize",
        "cssStyleElementRichTextH2LineHeight",
        "cssStyleElementRichTextH2FontWeight",
        "cssStyleElementRichTextH2LetterSpacing"
      ]
    },
    ".brz && h3": {
      standart: [
        "cssStyleElementRichTextH3FontFamily",
        "cssStyleElementRichTextH3FontSize",
        "cssStyleElementRichTextH3LineHeight",
        "cssStyleElementRichTextH3FontWeight",
        "cssStyleElementRichTextH3LetterSpacing"
      ]
    },
    ".brz && h4": {
      standart: [
        "cssStyleElementRichTextH4FontFamily",
        "cssStyleElementRichTextH4FontSize",
        "cssStyleElementRichTextH4LineHeight",
        "cssStyleElementRichTextH4FontWeight",
        "cssStyleElementRichTextH4LetterSpacing"
      ]
    },
    ".brz && h5": {
      standart: [
        "cssStyleElementRichTextH5FontFamily",
        "cssStyleElementRichTextH5FontSize",
        "cssStyleElementRichTextH5LineHeight",
        "cssStyleElementRichTextH5FontWeight",
        "cssStyleElementRichTextH5LetterSpacing"
      ]
    },
    ".brz && h6": {
      standart: [
        "cssStyleElementRichTextH6FontFamily",
        "cssStyleElementRichTextH6FontSize",
        "cssStyleElementRichTextH6LineHeight",
        "cssStyleElementRichTextH6FontWeight",
        "cssStyleElementRichTextH6LetterSpacing"
      ]
    },
    ".brz && *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(b):not(strong):not(i):not(span)":
      {
        standart: [
          "cssStyleElementRichTextFontFamily",
          "cssStyleElementRichTextFontSize",
          "cssStyleTypography3LineHeight",
          "cssStyleTypography3FontWeight",
          "cssStyleTypography3LetterSpacing"
        ]
      },
    ".brz && strong, .brz && b": {
      standart: [
        "cssStyleElementRichTextFontFamily",
        "cssStyleElementRichTextFontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3LetterSpacing"
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
        "cssStyleElementRichTextMartinTop",
        "cssStyleElementRichTextMartinBottom",
        "cssStyleContentAlign",
        "cssStyleElementRichTextFontFamily",
        "cssStyleElementRichTextFontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
