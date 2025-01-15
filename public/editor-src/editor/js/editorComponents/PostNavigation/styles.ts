import { renderStyles } from "visual/utils/cssStyle";
import type { Value } from "./types";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export const style = (data: DynamicStylesProps<Value>): OutputStyle => {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz && .brz-ui-ed-navigation-title": {
      standart: ["cssStyleElementPostNavigationSpacing"]
    },
    ".brz && .brz-ui-ed-navigation-title span:hover": {
      standart: [
        "cssStyleElementPostNavigationColorTitle",
        "cssStyleElementPostNavigation2TitleFontFamily",
        "cssStyleElementPostNavigation2TitleFontSize",
        "cssStyleElementPostNavigation2TitleLineHeight",
        "cssStyleElementPostNavigation2TitleFontWeight",
        "cssStyleElementPostNavigation2TitleLetterSpacing",
        "cssStyleElementPostNavigation2TitleFontVariation",
        "cssStyleElementPostNavigationTitleTextTransform"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ui-ed-navigation .brz-ui-ed-typography:hover": {
      standart: [
        "cssStyleElementPostNavigationColorPost",
        "cssStyleElementPostNavigation2PostFontFamily",
        "cssStyleElementPostNavigation2PostFontSize",
        "cssStyleElementPostNavigation2PostLineHeight",
        "cssStyleElementPostNavigation2PostFontWeight",
        "cssStyleElementPostNavigation2PostLetterSpacing",
        "cssStyleElementPostNavigation2PostFontVariation",
        "cssStyleElementPostNavigationPostTextTransform"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover:before": {
      standart: [
        "cssStyleElementPostNavigationShowSeparation",
        "cssStyleSizeHeight",
        "cssStyleBgColor"
      ],
      interval: ["cssStyleHoverTransition"]
    }
  };

  return renderStyles({ ...data, styles });
};
