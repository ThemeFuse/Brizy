import { UploadedFont } from "visual/types";

interface Font extends UploadedFont {
  uid?: string;
}
export interface Response {
  data: Font;
}

interface Range {
  min: number;
  max: number;
}

export interface VariationAxes {
  [tag: string]: Range;
}
