import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing"
      ]
    },
    ".brz && .brz-breadcrumbs .brz-a:hover": {
      standart: ["cssStyleSizeTextSpacing"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-breadcrumbs .brz-li:hover": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover .brz-breadcrumbs .brz-icon-svg": {
      standart: [
        "cssStyleSizeTextSpacing",
        "cssStyleElementBreadcrumbsArrowSize",
        "cssStyleElementBreadcrumbsColorArrows"
      ]
    },
    ".brz && .brz-breadcrumbs > .brz-li:last-child .brz-a:hover": {
      standart: ["cssStyleElementBreadcrumbsColorActive"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
