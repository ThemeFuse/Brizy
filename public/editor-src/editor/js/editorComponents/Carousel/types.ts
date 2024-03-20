import { ElementModel } from "visual/component/Elements/Types";

export interface Action {
  columns: number;
}

export interface Value extends ElementModel {
  columns: number;
  slidesToShow: number;
}
