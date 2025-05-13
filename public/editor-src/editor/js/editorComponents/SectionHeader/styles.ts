import { isEditor } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./type";

export function styleSection(data: DynamicStylesProps<Value>): OutputStyle {
  const { renderContext } = data.contexts;
  const styles: Styles = {
    ".brz &&": {
      interval: ["cssStyleVisibleMode|||preview"]
    },
    ".brz &&:hover": {
      interval: [
        "cssStyleDisplayBlock",
        "cssStyleVisibleEditorDisplayNoneOrBlock|||editor"
      ]
    }
  };

  if (isEditor(renderContext)) {
    styles[".brz &&:hover"].interval?.push("cssStyleShowBlock");

    styles[".brz && .brz-container"] = {
      interval: ["cssStyleVisibleMode|||editor"]
    };
    styles[".brz && > .brz-section__menu-item > .brz-bg"] = {
      interval: ["cssStyleVisibleMode|||editor"]
    };
    styles[".brz && > .brz-section__header-sticky-item > .brz-bg"] = {
      interval: ["cssStyleVisibleMode|||editor"]
    };
  }

  return renderStyles({ ...data, styles });
}

export function styleAnimation(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleAnimationAll"]
    }
  };

  return renderStyles({ ...data, styles });
}
