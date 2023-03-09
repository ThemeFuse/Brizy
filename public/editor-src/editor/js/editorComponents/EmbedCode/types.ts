import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "../EditorComponent";

export interface Value extends ElementModel {
  code: string;
}

export interface Meta extends ComponentsMeta {
  patch: Partial<Value>;
}
