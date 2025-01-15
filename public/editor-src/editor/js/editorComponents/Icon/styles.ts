import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleFontSizeIconOldOption",
        "cssStyleElementIconBgColor",
        "cssStyleElementIconBgGradient",
        "cssStyleElementIconPadding",
        "cssStyleStrokeWidth",
        "cssStyleBorderRadiusType"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementIconPropertyHoverTransition",
        "cssStyleVisibleMode|||editor",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrFlex|||editor"
      ]
    },
    ".brz &&:hover .brz-icon-svg-custom": {
      standart: ["cssStyleCustomIconColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementIconPropertyHoverTransition"
      ]
    }
  };
  return renderStyles({ ...data, styles });
}

export function styleWrapper(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
      standart: ["cssStyleElementIconSizeStory"]
    }
  };
  return renderStyles({ ...data, styles });
}
