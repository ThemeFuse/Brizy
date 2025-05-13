import { ElementModel } from "visual/component/Elements/Types";
import { OnChangeMeta } from "visual/editorComponents/EditorComponent/types";

export type OnChange = (
  v: ElementModel | null,
  meta: OnChangeMeta<ElementModel>
) => void;
