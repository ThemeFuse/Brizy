import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./index";

export function styleWrapper(v: Value, vs: Value, vd: Value): OutputStyle {
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

  if (IS_EDITOR) {
    styles[
      ".brz &&:hover > *:not(.brz-ed-border__inner):not(.brz-ed-border__button)"
    ] = {
      interval: ["cssStyleVisibleMode|||editor"]
    };
  }

  return renderStyles({ v, vs, vd, styles });
}

export function styleAnimation(v: Value, vs: Value, vd: Value): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: ["cssStyleAnimationAll"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
