import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleBgColor", "cssStyleColor"]
    },
    ".brz && .brz-table__th--btn": {
      standart: [
        "cssStyleElementTableBtnIconPosition",
        "cssStyleElementTableCustomFlexHorizontalAlign",
        "cssStyleTextAlign"
      ]
    },
    ".brz && .brz-table__th.brz-table__th": {
      standart: [
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3TextTransform",
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
      standart: ["cssStyleElementTableSpacing", "cssStyleSizeFontSizeIcon"]
    },
    ".brz && .brz-table__th--btn .brz-icon-svg-custom": {
      standart: ["cssStyleCustomIconColor"]
    }
  };

  return renderStyles({ ...data, styles });
}
