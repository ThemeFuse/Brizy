import { renderStyles } from "visual/utils/cssStyle";
import { ElementModel } from "visual/component/Elements/Types";

export function styleWrapper(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): string {
  const styles = {
    ".brz &&:hover": {
      interval: [
        "cssStyleDisplayBlock",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrBlock|||editor",
        "cssStyleZIndex",
        "cssStyleCustomPosition",
        "cssStyleCustomWidth",
        "cssStyleWrapperFixedFlex",
        "cssStyleOffset"
      ]
    },
    ".brz && > .brz-ed-border": {
      interval: ["cssStyleWrapperBorderFlex|||editor"]
    }
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return renderStyles({ v, vs, vd, styles });
}

export function styleContainer(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): string {
  const styles = {
    ".brz &&:hover": {
      interval: ["cssStyleVisibleMode|||editor"],
      standart: [
        "cssStylePaddingFourFields",
        "cssStyleMargin",
        "cssStyleFlexHorizontalAlign",
        "cssStylePositionMode",
        "cssStyleWrapperContainerFlex"
      ]
    },
    ".brz &&:before": {
      interval: ["cssStyleVisibleMode|||editor"]
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return renderStyles({ v, vs, vd, styles });
}

export function styleAnimation(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): string {
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
