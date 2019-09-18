import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      interval: ["cssStyleVisibleMode|||preview"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleWrap(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleZIndex", "cssStylePositionMode", "cssStyleMargin"],
      interval: ["cssStyleVisibleMode|||editor"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleContainer(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleFlexHorizontalAlign",
        "cssStylePadding",
        "cssStyleItemMargin"
      ]
    }
  };
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
