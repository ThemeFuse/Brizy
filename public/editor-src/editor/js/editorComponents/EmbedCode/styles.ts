import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { isStory } from "visual/utils/models";
import Config from "visual/global/Config";
import { Value } from "./types";

export function style(v: Value, vs: Value, vd: Value): OutputStyle {
  const IS_STORY = isStory(Config.getAll());

  const sizeFns = IS_STORY
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

  return renderStyles({ v, vs, vd, styles });
}
