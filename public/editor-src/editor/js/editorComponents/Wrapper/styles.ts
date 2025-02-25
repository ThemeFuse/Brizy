import { isEditor } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./index";

export function styleWrapper(data: DynamicStylesProps<Value>): OutputStyle {
  const { renderContext } = data.contexts;
  const styles: Styles = {
    ".brz &&:hover": {
      interval: [
        "cssStyleDisplayFlex",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrFlex|||editor",
        "cssStyleZIndex",
        "cssStyleCustomPosition",
        "cssStyleCustomWidth",
        "cssStyleWrapperFixedFlex",
        "cssStyleOffset"
      ],
      standart: [
        "cssStylePaddingFourFields",
        "cssStyleMargin",
        "cssStyleFlexHorizontalAlign",
        "cssStylePositionRelative",
        "cssStyleWrapperContainerFlex",
        "cssStyleWrapperBorderFlex"
      ]
    },
    ".brz && .brz-wrapper-transform": {
      standart: ["cssStyleTransform"]
    }
  };

  if (isEditor(renderContext)) {
    styles[
      ".brz &&:hover > *:not(.brz-ed-border__inner):not(.brz-ed-border__button)"
    ] = {
      interval: ["cssStyleVisibleMode|||editor"]
    };
  }

  return renderStyles({ ...data, styles });
}

export function styleAnimation(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: ["cssStyleAnimationAll"]
    }
  };

  return renderStyles({ ...data, styles });
}
