import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";
import type { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}
export interface Value extends ElementModel {
  showImage: Switch;
  showTitle: Switch;
  showCategory: Switch;
  showGroup: Switch;
  showMetaHeadings: Switch;
  showDay: Switch;
  showTimes: Switch;
  showStatus: Switch;
  showChildcare: Switch;
  showResourceLink: Switch;
  showContent: Switch;
  groupsRecent: string;
  showPreviousPage: Switch;
  showMetaIcons: Switch;
  dateFormat: string;
}
