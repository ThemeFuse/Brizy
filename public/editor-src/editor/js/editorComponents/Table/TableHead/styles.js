import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleBgColor", "cssStyleColor"]
    },
    ".brz && .brz-table__th--btn": {
      standart: [
        "cssStyleElementTableBtnIconPosition",
        "cssStyleElementTableCustomFlexHorizontalAlign"
      ]
    },
    ".brz && .brz-table__th.brz-table__th": {
      standart: [
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleBorder",
        "cssStylePaddingFourFields"
      ]
    },
    ".brz && .brz-table__th:nth-child(even)": {
      standart: [
        "cssStyleElementTableEvenBgColor",
        "cssStyleElementTableEvenColor"
      ]
    },
    ".brz && .brz-table__th .brz-icon-svg": {
      standart: ["cssStyleElementTableSpacing", "cssStyleElementTableIconSize"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
