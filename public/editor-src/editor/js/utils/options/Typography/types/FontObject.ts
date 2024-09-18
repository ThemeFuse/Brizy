import { VariationFont } from "visual/types";
import { Weight } from "visual/utils/fonts/Weight";

export interface FontObject {
  brizyId?: string;
  family: string;
  id: string;
  title: string;
  weights: Weight[];
  variations?: VariationFont[];
}
