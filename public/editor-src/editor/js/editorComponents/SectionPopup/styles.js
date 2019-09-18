import { renderStyles } from "visual/utils/cssStyle";

export function styleCloseButton(v, vs, vd) {
  const styles = {
    ".brz && > .brz-popup__close:hover": {
      standart: ["cssStyleColor"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleBg(v, vs, vd) {
  const styles = {
    ".brz &&:hover > .brz-bg-media": {
      standart: ["cssStyleBorder", "cssStyleBorderRadius"]
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-image": {
      standart: ["cssStyleBgImage", "cssStyleBgImagePosition"]
    },
    ".brz &&:hover > .brz-bg-media > .brz-bg-color": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleContainer(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleBorderTransparentColor"],
      interval: ["cssStyleSizeMaxWidthContainer"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleContainerWrap(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSectionPopupContainerWrap"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
