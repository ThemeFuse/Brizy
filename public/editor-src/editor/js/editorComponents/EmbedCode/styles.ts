import { isStory } from "visual/providers/EditorModeProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { mode } = data.contexts;
  const _isStory = isStory(mode);

  const sizeFns = _isStory
    ? ["cssStyleSizeWidth"]
    : ["cssStyleSizeWidth", "cssStyleCustomHeight"];

  const styles: Styles = {
    ".brz &&:hover": {
      standart: sizeFns
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleBoxShadow", "cssStyleBorder", "cssStyleBorderRadius"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz && .brz-embed-content": {
      standart: [
        "cssStylePaddingBG",
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleElementEmbedCodeOverflow",
        "cssStyleBorderRadius"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
