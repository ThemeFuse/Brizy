import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  address: string;
  zoom: number;
  customCSS: string;
}

export interface Patch {
  [k: string]: string;
}
