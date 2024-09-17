import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/types/attributes";
import { Switch } from "../utils/types";

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
