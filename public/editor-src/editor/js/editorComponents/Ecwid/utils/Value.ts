import type { ElementModel } from "visual/component/Elements/Types";
import type { OptionStyle } from "visual/utils/cssStyle/types";

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

export interface EcwidToolbarCSSData {
  [optionId: string]: {
    selector?: string;
    style?: OptionStyle;
  };
}
