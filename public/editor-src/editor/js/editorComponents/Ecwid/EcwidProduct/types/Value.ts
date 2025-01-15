import { ElementModel } from "visual/component/Elements/Types";
import { Switch } from "../../utils/Value";

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

  positionName: number;
  positionPrice: number;
  positionAddToBag: number;
  positionDescription: number;
  positionTitle2: number;
  positionShareTitle: number;

  attributesDisplay: Switch;
  carouselImage: Switch;
  cutProductDescription: Switch;
  descriptionDisplay: Switch;
  favoritesButtonsDisplay: Switch;
  footerDisplay: Switch;
  galleryHoverZoom: Switch;
  nameDisplay: Switch;
  nameFirstMobile: Switch;
  numberInStockDisplay: Switch;
  optionsDisplay: Switch;
  priceDisplay: Switch;
  previewAdditionalImages: Switch;
  quantityDisplay: Switch;
  shareButtonsDisplay: Switch;
  showFacebookShareBtn: Switch;
  showPinterestShareBtn: Switch;
  showTwitterShareBtn: Switch;
  showVkShareBtn: Switch;
  skuDisplay: Switch;
  stockLabelDisplay: Switch;
  subtitleDisplay: Switch;
  wholesalePricesDisplay: Switch;
  weightDisplay: Switch;

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

  columns:
    | EcwidProductColumns.TwoLeft
    | EcwidProductColumns.TwoRight
    | EcwidProductColumns.ThreeRight
    | EcwidProductColumns.ThreeLeft;
}
