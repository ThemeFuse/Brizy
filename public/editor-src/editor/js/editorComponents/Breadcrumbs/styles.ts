import { renderStyles } from "visual/utils/cssStyle";
import type { Value } from "./types";

export const style = (
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] => {
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
        "cssStyleTypography2FontVariation"
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

  return renderStyles({ v, vs, vd, styles });
};
