import { WithEditorMode, isStory } from "visual/global/EditorModeContext";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function style(
  data: DynamicStylesProps<Value> & WithEditorMode
): OutputStyle {
  const { editorMode } = data;
  const _isStory = isStory(editorMode);

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
