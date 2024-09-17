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

  return renderStyles({ v, vs, vd, styles });
};
