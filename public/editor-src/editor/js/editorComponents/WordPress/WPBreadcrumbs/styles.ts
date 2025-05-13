import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz && .brz-breadcrumbs .brz-a": {
      standart: ["cssStyleSizeTextSpacing"]
    },
    ".brz && .brz-breadcrumbs .brz-li": {
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
    ".brz && .brz-breadcrumbs .brz-li:hover": {
      standart: ["cssStyleColor"]
    },
    ".brz && .brz-breadcrumbs .brz-icon-svg": {
      standart: ["cssStyleSizeTextSpacing"]
    },
    ".brz &&:hover .brz-breadcrumbs .brz-icon-svg": {
      standart: ["cssStyleElementBreadcrumbsColorArrows"]
    },
    ".brz && .brz-breadcrumbs > .brz-li:last-child .brz-a:hover": {
      standart: ["cssStyleElementBreadcrumbsColorActive"]
    }
  };

  return renderStyles({ ...data, styles });
}
