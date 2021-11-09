import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidthPercent"]
    },
    ".brz && .brz-navigation-title": {
      standart: ["cssStyleElementPostNavigationSpacing"]
    },
    ".brz && .brz-navigation-title .brz-span:hover": {
      standart: [
        "cssStyleElementPostNavigationColorTitle",
        "cssStyleElementPostNavigation2TitleFontFamily",
        "cssStyleElementPostNavigation2TitleFontSize",
        "cssStyleElementPostNavigation2TitleLineHeight",
        "cssStyleElementPostNavigation2TitleFontWeight",
        "cssStyleElementPostNavigation2TitleLetterSpacing"
      ]
    },
    ".brz && .brz-navigation-title .brz-a:not(.brz-btn)[href]:hover": {
      standart: [
        "cssStyleElementPostNavigationColorTitle",
        "cssStyleElementPostNavigation2TitleFontFamily",
        "cssStyleElementPostNavigation2TitleFontSize",
        "cssStyleElementPostNavigation2TitleLineHeight",
        "cssStyleElementPostNavigation2TitleFontWeight",
        "cssStyleElementPostNavigation2TitleLetterSpacing"
      ]
    },
    ".brz && .brz-navigation .brz-a:not(.brz-btn)[href]:hover": {
      standart: [
        "cssStyleElementPostNavigationColorPost",
        "cssStyleElementPostNavigation2PostFontFamily",
        "cssStyleElementPostNavigation2PostFontSize",
        "cssStyleElementPostNavigation2PostLineHeight",
        "cssStyleElementPostNavigation2PostFontWeight",
        "cssStyleElementPostNavigation2PostLetterSpacing"
      ]
    },
    ".brz &&:hover:before": {
      standart: [
        "cssStyleElementPostNavigationShowSeparation",
        "cssStyleElementPostNavigationSeparationHeight",
        "cssStyleBgColor"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
