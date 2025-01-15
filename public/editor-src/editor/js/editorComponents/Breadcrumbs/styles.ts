import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export const style = (data: DynamicStylesProps<Value>): OutputStyle => {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz && .brz-ui-ed-breadcrumbs li:hover": {
      standart: [
        "cssStyleSizeTextSpacing",
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
    ".brz && .brz-ui-ed-breadcrumbs li:not(li:last-child):hover": {
      standart: ["cssStyleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ui-ed-breadcrumbs .brz-ui-ed-breadcrumb-separator svg": {
      standart: ["cssStyleElementBreadcrumbsColorArrows"]
    },
    ".brz && .brz-ui-ed-breadcrumbs li:has(.brz-ui-ed-breadcrumb-link):nth-last-child(-n+2) ":
      {
        standart: ["cssStyleElementBreadcrumbsColorActive"]
      }
  };

  return renderStyles({ ...data, styles });
};
