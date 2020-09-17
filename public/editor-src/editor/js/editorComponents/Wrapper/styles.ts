import { renderStyles } from "visual/utils/cssStyle";
import { ElementModel } from "visual/component/Elements/Types";

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
        "cssStylePositionMode",
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
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
        "cssStyleAnimationDelay"
      ]
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return renderStyles({ v, vs, vd, styles });
}
