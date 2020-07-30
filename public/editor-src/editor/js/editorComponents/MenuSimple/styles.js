import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleElementMenuSimpleWidth"]
    },
    ".brz &&:hover .menu": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .menu .menu-item a:hover": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover .menu .menu-item.current-menu-item > a": {
      standart: ["cssStyleElementMenuSimpleActiveColor"]
    },
    ".brz &&:hover .menu .menu-item:first-child > a": {
      standart: [...(IS_EDITOR ? ["cssStyleElementMenuSimpleActiveColor"] : [])]
    },
    ".brz &&:hover .menu .menu-item:not(:last-child)": {
      standart: ["cssStyleElementMenuSimpleItemPadding"]
    },
    ".brz &&:hover .brz-menu-simple__icon--bars": {
      standart: ["cssStyleElementMenuSimpleColorBars"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}
