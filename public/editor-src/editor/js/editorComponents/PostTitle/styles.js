import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleContentAlign"]
    },
    ".brz &&:hover *": {
      standart: [
        "cssStyleColor",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleElementTitleTextShadow"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    // :not(.brz-btn) was added to win specificity battle
    // with standard .brz-a styles
    ".brz &&:hover > .brz-a.brz-a:not(.brz-btn)": {
      standart: ["cssStyleColor"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
