import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";

export interface Value extends ElementModel {
  code: string;
  customCSS: string;
}

export interface Meta extends ComponentsMeta {
  patch: Partial<Value>;
}
