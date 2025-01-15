import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";



export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz && .brz-breadcrumbs .brz-a:hover": {
      standart: ["cssStyleSizeTextSpacing"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-breadcrumbs .brz-li:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms"
      ]
    },
    ".brz &&:hover .brz-breadcrumbs .brz-icon-svg": {
      standart: [
        "cssStyleSizeTextSpacing",
        "cssStyleElementBreadcrumbsColorArrows"
      ]
    },
    ".brz && .brz-breadcrumbs > .brz-li:last-child .brz-a:hover": {
      standart: ["cssStyleElementBreadcrumbsColorActive"]
    }
  };

  return renderStyles({ ...data, styles });
}
