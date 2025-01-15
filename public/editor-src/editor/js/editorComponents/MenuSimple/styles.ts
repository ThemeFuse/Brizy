import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
      standart: ["cssStyleElementMenuSimpleWidth"]
    },
    ".brz &&:hover .menu": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms"
      ],
      interval: ["cssStyleHoverTransition"]
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
