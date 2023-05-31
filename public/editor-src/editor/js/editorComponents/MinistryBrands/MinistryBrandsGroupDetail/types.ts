import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent";
import { WithClassName } from "visual/utils/options/attributes";
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
}
