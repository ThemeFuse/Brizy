import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  productId: string;
  customCSS: string;
  footerDisplay: "on" | "off";
  qtyDisplay: "on" | "off";
  skuDisplay: "on" | "off";
  weightDisplay: "on" | "off";
  inputDisplay: "on" | "off";
  addressDisplay: "on" | "off";
  collapse: "on" | "off";
  collapseDesktop: "on" | "off";
  breadcrumbsDisplay: "on" | "off";
}
