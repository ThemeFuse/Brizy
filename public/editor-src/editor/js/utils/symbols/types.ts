import type { ElementModel } from "visual/component/Elements/Types";
import { CSS_MODEL_KEY } from ".";

export interface ElementModelWithSymbols extends ElementModel {
  [CSS_MODEL_KEY]: string[];
}
