import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/utils/options/attributes";
import { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}
export interface Value extends ElementModel {
  showTitle: Switch;
  showImage: Switch;
  showCategory: Switch;
  showGroup: Switch;
  showDay: Switch;
  showTimes: Switch;
  showStatus: Switch;
  showChildcare: Switch;
  showResourceLink: Switch;
  showPreview: Switch;
  groupLatest: Switch;
  showMetaIcons: Switch;
  groupRecentList: string;
  groupSlug: string;
  category: string;
  group: string;
  detailPageButtonText: string;
  detailPage: string;
  source: string;
  detailPageTitle: string;
  slug: string;
  dateFormat: string;
}
