import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  productId: string;
  customCSS: string;
  ratio:
    | "PORTRAIT_0667"
    | "PORTRAIT_075"
    | "SQUARE"
    | "LANDSCAPE_1333"
    | "LANDSCAPE_15";
  productName: "SHOW" | "HIDE" | "SHOW_ON_HOVER";
  productSKU: "SHOW" | "HIDE" | "SHOW_ON_HOVER";
  productPrice: "SHOW" | "HIDE" | "SHOW_ON_HOVER";
  buyNowButton: "SHOW" | "HIDE" | "SHOW_ON_HOVER";
  productSubtitle: "SHOW" | "HIDE" | "SHOW_ON_HOVER";
  horizontalAlign: "CENTER" | "LEFT" | "RIGHT" | "JUSTIFY";
  galleryWidth: "SMALL" | "MEDIUM" | "LARGE";
  displayMode: "AUTO" | "COVER" | "FIT";
  productCardFrame: "on" | "off";
  mainProductImage: "on" | "off";
  darkenImage: "on" | "off";
  additionalImage: "on" | "off";
  footerDisplay: "on" | "off";
}
