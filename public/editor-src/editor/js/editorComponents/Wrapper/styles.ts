import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";

export function styleWrapper(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
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
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): [string, string, string] {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleAnimation",
        "cssStyleAnimationDuration",
        "cssStyleAnimationDelay",
        "cssStyleAnimationIterationCount"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
