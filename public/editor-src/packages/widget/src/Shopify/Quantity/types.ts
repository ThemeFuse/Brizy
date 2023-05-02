import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  customCSS: string;
  quantityStyle: string;
  sourceID: string;
  sourceType: string;
}

export enum Action {
  Increment = "increment",
  Decrement = "decrement"
}
