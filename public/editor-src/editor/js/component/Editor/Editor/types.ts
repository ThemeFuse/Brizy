import type { ElementModel } from "visual/component/Elements/Types";
import type { OnChangeMeta } from "visual/editorComponents/EditorComponent/types";

export type OnChange = (
  v: ElementModel | null,
  meta: OnChangeMeta<ElementModel>
) => void;
