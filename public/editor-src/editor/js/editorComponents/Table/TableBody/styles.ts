import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      standart: []
    },
    ".brz &&:hover .brz-table__th.brz-table__th": {
      standart: [
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3TextTransform",
        "cssStyleBgColor",
        "cssStyleColor",
        "cssStyleBorder",
        "cssStylePaddingFourFields"
      ]
    },
    ".brz &&:hover .brz-table__tr:nth-child(even) .brz-table__th": {
      standart: [
        "cssStyleElementTableEvenBgColor",
        "cssStyleElementTableEvenColor"
      ]
    },
    ".brz && .brz-table__th--btn": {
      standart: [
        "cssStyleElementTableBtnIconPosition",
        "cssStyleElementTableCustomFlexHorizontalAlign",
        "cssStyleTextAlign"
      ]
    },
    ".brz && .brz-table__th .brz-icon-svg": {
      standart: ["cssStyleElementTableSpacing", "cssStyleSizeFontSizeIcon"]
    },
    ".brz && .brz-table__th .brz-icon-svg-custom": {
      standart: ["cssStyleCustomIconColor"]
    }
  };

  return renderStyles({ ...data, styles });
}
