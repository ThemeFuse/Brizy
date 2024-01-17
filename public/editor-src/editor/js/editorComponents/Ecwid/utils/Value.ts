import { ElementModel } from "visual/component/Elements/Types";

export type Switch = "on" | "off";

export interface Value extends ElementModel {
  customCSS: string;
  productId: string;

  footerDisplay: Switch;

  addressDisplay?: Switch;
  breadcrumbs?: Switch;
  breadcrumbsDisplay?: Switch;
  collapseDesktop?: Switch;
  inputDisplay?: Switch;
  qtyDisplay?: Switch;
  signinLink?: Switch;
  skuDisplay?: Switch;
  weightDisplay?: Switch;
}
