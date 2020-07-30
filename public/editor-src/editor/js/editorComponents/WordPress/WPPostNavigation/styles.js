import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidthPercent"]
    },
    ".brz &&:hover .brz-navigation-title": {
      standart: ["cssStyleElementPostNavigationSpacing"]
    },
    ".brz &&:hover .brz-span": {
      standart: [
        "cssStyleElementPostNavigation2TitleFontFamily",
        "cssStyleElementPostNavigation2TitleFontSize",
        "cssStyleElementPostNavigation2TitleLineHeight",
        "cssStyleElementPostNavigation2TitleFontWeight",
        "cssStyleElementPostNavigation2TitleLetterSpacing"
      ]
    },
    ".brz && .brz-span:hover": {
      standart: ["cssStyleElementPostNavigationColorTitle"]
    },
    ".brz &&:hover .brz-a": {
      standart: [
        "cssStyleElementPostNavigation2PostFontFamily",
        "cssStyleElementPostNavigation2PostFontSize",
        "cssStyleElementPostNavigation2PostLineHeight",
        "cssStyleElementPostNavigation2PostFontWeight",
        "cssStyleElementPostNavigation2PostLetterSpacing"
      ]
    },
    ".brz &&:hover .brz-blocked .brz-navigation .brz-a": {
      standart: IS_EDITOR ? ["cssStyleElementPostNavigationColorPost"] : []
    },
    ".brz && .brz-navigation .brz-a:not(.brz-btn)[href]:hover": {
      standart: IS_PREVIEW ? ["cssStyleElementPostNavigationColorPost"] : []
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
