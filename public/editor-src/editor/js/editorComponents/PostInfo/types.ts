import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  postElements: string;
}

export enum Slug {
  Author = "author",
  Time = "time",
  Date = "date"
}
