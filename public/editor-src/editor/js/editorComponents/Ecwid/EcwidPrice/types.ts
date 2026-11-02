import type { PriceStyle } from "@brizy/widget/src/Shopify/Price/types";
import type { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  priceStyle: PriceStyle;
  sourceID: number;
  sourceType: string;
  customCSS: string;
  entityId: string;
}
