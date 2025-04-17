import { ElementModel } from "visual/component/Elements/Types";
import { Switch } from "../../utils/Value";

export enum EcwidCartCheckoutStep {
  Cart = "cart",
  Address = "checkout/address",
  Shipping = "checkout/delivery",
  Payment = "checkout/payment"
}

export interface Value extends ElementModel {
  productId: string;
  customCSS: string;

  footerDisplay: Switch;
  qtyDisplay: Switch;
  skuDisplay: Switch;
  weightDisplay: Switch;
  collapseDesktop: Switch;
  prefilledCart: Switch;

  step: EcwidCartCheckoutStep;
}
