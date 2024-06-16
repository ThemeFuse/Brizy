import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  type: string;
}

export interface ComponentItem {
  componentTitle: string;
  componentType: string;
}
