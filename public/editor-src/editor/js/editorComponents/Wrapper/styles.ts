import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./index";

export function styleWrapper(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
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
    ".brz &&:hover .brz-hover-animation": {
      standart: ["cssStyleFlexHorizontalAlign"]
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

export function styleAnimation(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleAnimationAll"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
