import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";

export interface Value extends ElementModel {
  link: string;
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}
