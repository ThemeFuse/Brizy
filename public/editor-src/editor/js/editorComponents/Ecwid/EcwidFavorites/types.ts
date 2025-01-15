import type { ElementModel } from "visual/component/Elements/Types";
import type { Switch } from "../utils/Value";

export interface Value extends ElementModel {
  productId: string;
  customCSS: string;
  footerDisplay: Switch;
  signinLink: Switch;
  qtyDisplay: Switch;
  skuDisplay: Switch;
  weightDisplay: Switch;
  inputDisplay: Switch;
  addressDisplay: Switch;
  collapseDesktop: Switch;
  breadcrumbsDisplay: Switch;
}
