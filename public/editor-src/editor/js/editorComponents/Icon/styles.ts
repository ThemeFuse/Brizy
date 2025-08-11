import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { getTooltipStyles } from "../tools/Tooltip/styles";
import { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: [
        "cssStyleFontSizeIconOldOption",
        "cssStyleElementIconPadding",
        "cssStyleBorderRadiusType",
        "cssStyleStrokeWidth"
      ],
      interval: [
        "cssStyleVisibleMode|||editor",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrFlex|||editor"
      ]
    },
    ".brz &&:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleElementIconBgColor",
        "cssStyleElementIconBgGradient"
      ]
    },
    ".brz &&:hover .brz-icon-svg-custom": {
      standart: ["cssStyleCustomIconColor"]
    },
    ".brz &&, .brz && .brz-icon-svg-custom": {
      standart: [
        "cssStyleHoverTransition",
        "cssStyleElementIconPropertyHoverTransition"
      ]
    }
  };
  return renderStyles({ ...data, styles });
}

export function styleWrapper(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleElementIconSizeStory"]
    }
  };
  return renderStyles({ ...data, styles });
}

export function styleTooltip(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = getTooltipStyles();
  return renderStyles({ ...data, styles });
}
