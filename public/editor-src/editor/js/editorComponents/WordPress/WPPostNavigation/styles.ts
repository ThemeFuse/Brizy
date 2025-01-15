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
    ".brz && .brz-navigation-title .brz-span:hover": {
      standart: [
        "cssStyleElementPostNavigationColorTitle",
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
      standart: [
        "cssStyleElementPostNavigationColorTitle",
        "cssStyleElementPostNavigation2TitleFontFamily",
        "cssStyleElementPostNavigation2TitleFontSize",
        "cssStyleElementPostNavigation2TitleLineHeight",
        "cssStyleElementPostNavigation2TitleFontWeight",
        "cssStyleElementPostNavigation2TitleLetterSpacing",
        "cssStyleElementPostNavigation2TitleFontVariation",
        "cssStyleElementPostNavigationTitleTextTransform"
      ]
    },
    ".brz && .brz-navigation .brz-a:not(.brz-btn)[href]:hover": {
      standart: [
        "cssStyleElementPostNavigationColorPost",
        "cssStyleElementPostNavigation2PostFontFamily",
        "cssStyleElementPostNavigation2PostFontSize",
        "cssStyleElementPostNavigation2PostLineHeight",
        "cssStyleElementPostNavigation2PostFontWeight",
        "cssStyleElementPostNavigation2PostLetterSpacing",
        "cssStyleElementPostNavigation2PostFontVariation",
        "cssStyleElementPostNavigationPostTextTransform"
      ]
    },
    ".brz &&:hover:before": {
      standart: [
        "cssStyleElementPostNavigationShowSeparation",
        "cssStyleSizeHeight",
        "cssStyleBgColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
