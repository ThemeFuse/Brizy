import { renderStyles } from "visual/utils/cssStyle";

export function styleWrapper(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: [
        "cssStyleDisplayBlock",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrBlock|||editor"
      ]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleContainer(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: ["cssStyleVisibleMode|||editor"],
      standart: [
        "cssStylePaddingFourFields",
        "cssStyleMargin",
        "cssStyleZIndex",
        "cssStyleFlexHorizontalAlign",
        "cssStylePositionMode"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
