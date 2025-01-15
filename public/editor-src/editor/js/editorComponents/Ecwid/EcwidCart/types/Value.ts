import { ElementModel } from "visual/component/Elements/Types";
import { Switch } from "../../utils/Value";

export interface Value extends ElementModel {
  productId: string;
  customCSS: string;

  footerDisplay: Switch;
  qtyDisplay: Switch;
  skuDisplay: Switch;
  weightDisplay: Switch;
  inputDisplay: Switch;
  addressDisplay: Switch;
  collapseDesktop: Switch;
}
