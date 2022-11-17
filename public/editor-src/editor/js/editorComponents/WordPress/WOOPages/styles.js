import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: IS_PREVIEW
        ? [
            "cssStyleSizeWidth",
            "cssStylePaddingBG",
            "cssStyleBgColor",
            "cssStyleBgGradient",
            "cssStyleBorder",
            "cssStyleBorderRadius",
            "cssStyleBoxShadow"
          ]
        : ["cssStyleSizeWidth"]
    },
    ".brz &&:hover .brz-woo-page": {
      standart: IS_EDITOR
        ? [
            "cssStylePaddingBG",
            "cssStyleBgColor",
            "cssStyleBgGradient",
            "cssStyleBorder",
            "cssStyleBorderRadius",
            "cssStyleBoxShadow"
          ]
        : []
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
