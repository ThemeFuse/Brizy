import { isEditor } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { Value } from "./type";

export function styleSection(data: DynamicStylesProps<Value>): OutputStyle {
  const { renderContext } = data;
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
      interval: [
        "cssStyleDisplayBlock",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrBlock|||editor"
      ]
    }
  };

  if (isEditor(renderContext)) {
    styles[".brz &&:hover"].interval?.push("cssStyleShowBlock");

    styles[".brz &&:hover .brz-container"] = {
      interval: ["cssStyleVisibleMode|||editor"]
    };
    styles[".brz &&:hover > .brz-section__menu-item > .brz-bg"] = {
      interval: ["cssStyleVisibleMode|||editor"]
    };
    styles[".brz &&:hover > .brz-section__header-sticky-item > .brz-bg"] = {
      interval: ["cssStyleVisibleMode|||editor"]
    };
  }

  return renderStyles({ ...data, styles });
}

export function styleAnimation(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleAnimationAll"]
    }
  };

  return renderStyles({ ...data, styles });
}
