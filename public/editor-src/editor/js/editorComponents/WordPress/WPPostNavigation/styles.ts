import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz && .brz-navigation-title": {
      standart: ["cssStyleElementPostNavigationSpacing"]
    },
    ".brz && .brz-navigation-title .brz-span": {
      standart: [
        "cssStyleElementPostNavigation2TitleFontFamily",
        "cssStyleElementPostNavigation2TitleFontSize",
        "cssStyleElementPostNavigation2TitleLineHeight",
        "cssStyleElementPostNavigation2TitleFontWeight",
        "cssStyleElementPostNavigation2TitleLetterSpacing",
        "cssStyleElementPostNavigation2TitleFontVariation",
        "cssStyleElementPostNavigationTitleTextTransform"
      ]
    },
    ".brz && .brz-navigation-title .brz-span:hover": {
      standart: ["cssStyleElementPostNavigationColorTitle"]
    },
    ".brz && .brz-navigation-title .brz-a:not(.brz-btn)[href]": {
      standart: [
        "cssStyleElementPostNavigation2TitleFontFamily",
        "cssStyleElementPostNavigation2TitleFontSize",
        "cssStyleElementPostNavigation2TitleLineHeight",
        "cssStyleElementPostNavigation2TitleFontWeight",
        "cssStyleElementPostNavigation2TitleLetterSpacing",
        "cssStyleElementPostNavigation2TitleFontVariation",
        "cssStyleElementPostNavigationTitleTextTransform"
      ]
    },
    ".brz && .brz-navigation-title .brz-a:not(.brz-btn)[href]:hover": {
      standart: ["cssStyleElementPostNavigationColorTitle"]
    },
    ".brz && .brz-navigation .brz-a:not(.brz-btn)[href]": {
      standart: [
        "cssStyleElementPostNavigation2PostFontFamily",
        "cssStyleElementPostNavigation2PostFontSize",
        "cssStyleElementPostNavigation2PostLineHeight",
        "cssStyleElementPostNavigation2PostFontWeight",
        "cssStyleElementPostNavigation2PostLetterSpacing",
        "cssStyleElementPostNavigation2PostFontVariation",
        "cssStyleElementPostNavigationPostTextTransform"
      ]
    },
    ".brz && .brz-navigation .brz-a:not(.brz-btn)[href]:hover": {
      standart: ["cssStyleElementPostNavigationColorPost"]
    },
    ".brz &&:before": {
      standart: [
        "cssStyleElementPostNavigationShowSeparation",
        "cssStyleSizeHeight"
      ]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleBgColor"]
    }
  };

  return renderStyles({ ...data, styles });
}
