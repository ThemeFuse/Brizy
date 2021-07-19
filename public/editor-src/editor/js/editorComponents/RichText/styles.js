import { renderStyles } from "visual/utils/cssStyle";

// TODO: cssStyleContentAlign - check this function

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidth"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleDC(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleTextShadow",
        "cssStyleContentAlign",
        "cssStyleElementRichTextGradient",
        "cssStyleElementRichTextFontFamily",
        "cssStyleElementRichTextFontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleElementRichTextBgImage"
      ]
    },
    ".brz &&:hover > .brz-a.brz-a:not(.brz-btn)": {
      standart: [
        "cssStyleColor",
        "cssStyleElementRichTextGradient",
        "cssStyleTextShadow"
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
