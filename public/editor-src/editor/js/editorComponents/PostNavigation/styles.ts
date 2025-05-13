import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export const style = (data: DynamicStylesProps<Value>): OutputStyle => {
  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz && .brz-ui-ed-navigation-title": {
      standart: ["cssStyleElementPostNavigationSpacing"]
    },
    ".brz && .brz-ui-ed-navigation-title span": {
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
    ".brz && .brz-ui-ed-navigation-title span:hover": {
      standart: ["cssStyleElementPostNavigationColorTitle"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ui-ed-navigation .brz-ui-ed-typography": {
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
    ".brz && .brz-ui-ed-navigation .brz-ui-ed-typography:hover": {
      standart: ["cssStyleElementPostNavigationColorPost"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:before": {
      standart: [
        "cssStyleSizeHeight",
        "cssStyleElementPostNavigationShowSeparation"
      ]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleBgColor"],
      interval: ["cssStyleHoverTransition"]
    }
  };

  return renderStyles({ ...data, styles });
};
