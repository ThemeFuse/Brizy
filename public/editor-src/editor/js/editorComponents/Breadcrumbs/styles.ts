import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export const style = (data: DynamicStylesProps<Value>): OutputStyle => {
  const styles: Styles = {
    ".brz && .brz-ui-ed-breadcrumbs li": {
      standart: [
        "cssStyleSizeTextSpacing",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms"
      ]
    },
    ".brz && .brz-ui-ed-breadcrumbs li:not(li:last-child):hover": {
      standart: ["cssStyleColor"]
    },
    ".brz && .brz-ui-ed-breadcrumbs .brz-ui-ed-breadcrumb-separator svg": {
      standart: ["cssStyleElementBreadcrumbsColorArrows"]
    },
    ".brz && .brz-ui-ed-breadcrumbs li:has(.brz-ui-ed-breadcrumb-link):nth-last-child(-n+2) ":
      {
        standart: ["cssStyleElementBreadcrumbsColorActive"]
      },
    ".brz && .brz-ui-ed-breadcrumbs li, .brz && .brz-ui-ed-breadcrumbs li:not(li:last-child)":
      {
        standart: ["cssStyleHoverTransition"]
      }
  };

  return renderStyles({ ...data, styles });
};
