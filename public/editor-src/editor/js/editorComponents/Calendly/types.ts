import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/types/attributes";

export interface Value extends ElementModel {
  link: string;
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}
