import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: [
        "cssStyleDisplayFlex",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrFlex|||editor",
        "cssStyleCustomPosition",
        "cssStyleCustomWidth",
        "cssStyleOffset"
      ],
      standart: ["cssStyleZIndex", "cssStylePositionMode", "cssStyleMargin"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleContainer(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleFlexHorizontalAlign",
        "cssStylePaddingFourFields",
        "cssStyleItemMargin"
      ]
    }
  };

  if (IS_EDITOR) {
    styles[".brz &&:hover"].interval = ["cssStyleVisibleMode|||editor"];
  }

  return renderStyles({ v, vs, vd, styles });
}

export function styleItem(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleItemPadding"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleAnimation(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleAnimation",
        "cssStyleAnimationDuration",
        "cssStyleAnimationDelay"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
