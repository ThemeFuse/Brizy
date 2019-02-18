import { t } from "visual/utils/i18n";
import {
  toolbarElementImageGalleryGridColumn,
  toolbarElementImageGallerySpacing,
  toolbarElementImageGalleryLightBox
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";
  return [
    {
      id: "toolbarGallery",
      type: "popover",
      icon: "nc-gallery",
      title: t("Gallery"),
      position: 80,
      options: [
        toolbarElementImageGalleryGridColumn({ v, device }),
        toolbarElementImageGallerySpacing({ v, device }),
        toolbarElementImageGalleryLightBox({ v, device })
      ]
    }
  ];
}

export function getItemsForTablet(v) {
  const device = "tablet";
  return [
    {
      id: "tabletToolbarGallery",
      type: "popover",
      icon: "nc-gallery",
      title: t("Gallery"),
      position: 80,
      options: [
        toolbarElementImageGalleryGridColumn({ v, device }),
        toolbarElementImageGallerySpacing({ v, device })
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  const device = "mobile";
  return [
    {
      id: "mobileToolbarGallery",
      type: "popover",
      icon: "nc-gallery",
      title: t("Gallery"),
      position: 80,
      options: [
        toolbarElementImageGalleryGridColumn({ v, device }),
        toolbarElementImageGallerySpacing({ v, device })
      ]
    }
  ];
}
