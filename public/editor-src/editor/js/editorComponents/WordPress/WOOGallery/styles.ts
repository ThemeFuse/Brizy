import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz && .woocommerce-product-gallery > .flex-viewport": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz && .woocommerce-product-gallery > .flex-viewport:hover": {
      standart: ["cssStyleBoxShadow", "cssStyleBorder"],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz && .woocommerce-product-gallery > .woocommerce-product-gallery__wrapper":
      {
        standart: ["cssStyleBorderRadius"]
      },
    ".brz && .woocommerce-product-gallery > .woocommerce-product-gallery__wrapper:hover":
      {
        standart: ["cssStyleBoxShadow", "cssStyleBorder"],
        interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
      },
    ".brz && .flex-control-thumbs": {
      standart: [
        "cssStyleElementWOOGalleryParentSize",
        "cssStyleElementWOOGallerySpacing",
        "cssStyleElementWOOGallerySpacingStyleLeftRigth",
        "cssStyleElementWOOGalleryChildStyle"
      ]
    },
    ".brz && .flex-control-thumbs li": {
      standart: [
        "cssStyleElementWOOGalleryBetweenThumbnail",
        "cssStyleElementWOOGalleryBorderRadiusThumbnail",
        "cssStyleElementWOOGalleryThumbnailSize"
      ]
    },
    ".brz && .flex-control-thumbs li:hover": {
      standart: [
        "cssStyleElementWOOGalleryBoxShadowThumbnail",
        "cssStyleElementWOOGalleryBorderThumbnail"
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz && .woocommerce-product-gallery__trigger": {
      standart: ["cssStyleElementWOOGalleryZoomReposition"]
    }
  };

  return renderStyles({ ...data, styles });
}
