import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidth"]
    },

    ".brz && .flex-viewport:hover": {
      standart: ["cssStyleBoxShadow", "cssStyleBorder", "cssStyleBorderRadius"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz &&:hover .flex-control-thumbs": {
      standart: [
        "cssStyleElementWOOGalleryParrentSize",
        "cssStyleElementWOOGallerySpacing"
      ]
    },
    ".brz && .flex-control-thumbs li:hover": {
      standart: [
        "cssStyleElementWOOGalleryBetweenThumbnail",
        "cssStyleElementWOOGalleryThumbnailSize",
        "cssStyleElementWOOGalleryBoxShadowThumbnail",
        "cssStyleElementWOOGalleryBorderRadiusThumbnail",
        "cssStyleElementWOOGalleryBorderThumbnail"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
