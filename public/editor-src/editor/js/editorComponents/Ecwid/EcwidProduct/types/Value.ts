import { ElementModel } from "visual/component/Elements/Types";

export enum EcwidProductThumb {
  ImgFeed = "IMAGE_FEED",
  ImgThumbHorizontal = "IMAGE_SINGLE_THUMBNAILS_HORIZONTAL",
  ImgThumbVertical = "IMAGE_SINGLE_THUMBNAILS_VERTICAL"
}

export enum EcwidProductColumns {
  TwoLeft = "TWO_COLUMNS_SIDEBAR_ON_THE_LEFT",
  TwoRight = "TWO_COLUMNS_SIDEBAR_ON_THE_RIGHT",
  ThreeRight = "THREE_COLUMNS_SIDEBAR_ON_THE_RIGHT",
  ThreeLeft = "THREE_COLUMNS_SIDEBAR_ON_THE_LEFT"
}

export interface Value extends ElementModel {
  productId: string;
  customCSS: string;
  nameDisplay: "on" | "off";
  breadcrumbsDisplay: "on" | "off";
  skuDisplay: "on" | "off";
  priceDisplay: "on" | "off";
  subtitleDisplay: "on" | "off";
  optionsDisplay: "on" | "off";
  stockLabelDisplay: "on" | "off";
  numberInStockDisplay: "on" | "off";
  quantityDisplay: "on" | "off";
  wholesalePricesDisplay: "on" | "off";
  attributesDisplay: "on" | "off";
  weightDisplay: "on" | "off";
  descriptionDisplay: "on" | "off";
  favoritesButtonsDisplay: "on" | "off";
  shareButtonsDisplay: "on" | "off";
  footerDisplay: "on" | "off";
  descriptionPosition: "belowImage" | "besideImage";
  thumbnailAspectRatio:
    | "AUTO"
    | "PORTRAIT_0667"
    | "PORTRAIT_075"
    | "SQUARE_1"
    | "LANDSCAPE_1333"
    | "LANDSCAPE_15";
  thumbStyle:
    | EcwidProductThumb.ImgFeed
    | EcwidProductThumb.ImgThumbHorizontal
    | EcwidProductThumb.ImgThumbVertical;
  nameFirstMobile: "on" | "off";
  galleryHoverZoom: "on" | "off";
  positionName: number;
  positionBreadcrumbs: number;
  positionPrice: number;
  positionAddToBag: number;
  positionDescription: number;
  positionTitle2: number;
  positionShareTitle: number;
  columns:
    | EcwidProductColumns.TwoLeft
    | EcwidProductColumns.TwoRight
    | EcwidProductColumns.ThreeRight
    | EcwidProductColumns.ThreeLeft;
  showFacebookShareBtn: "on" | "off";
  showPinterestShareBtn: "on" | "off";
  showTwitterShareBtn: "on" | "off";
  showVkShareBtn: "on" | "off";
  carouselImage: "on" | "off";
  cutProductDescription: "on" | "off";
  previewAdditionalImages: "on" | "off";
}
