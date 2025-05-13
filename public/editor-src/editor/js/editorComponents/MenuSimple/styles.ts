import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleElementMenuSimpleWidth"]
    },
    ".brz && .menu": {
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
    ".brz && .menu .menu-item a:hover": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover .menu > .menu-item:not(:last-child)": {
      standart: ["cssStyleElementMenuSimpleItemPadding"]
    },
    ".brz &&:hover .brz-menu-simple__icon--bars": {
      standart: ["cssStyleElementMenuSimpleColorBars", "cssStyleColor"]
    }
  };
  return renderStyles({ ...data, styles });
}
