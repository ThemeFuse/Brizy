import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  postElements: string;
  customCSS: string;
}

export enum Slug {
  Author = "author",
  Time = "time",
  Date = "date"
}
