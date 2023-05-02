import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  priceStyle: PriceStyle;
  sourceID: number;
  sourceType: string;
}

export enum PriceStyle {
  S1 = "style-1",
  S2 = "style-2",
  S3 = "style-3"
}
