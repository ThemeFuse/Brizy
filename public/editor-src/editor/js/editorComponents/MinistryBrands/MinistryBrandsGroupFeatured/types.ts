import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";
import type { Switch } from "../utils/types";

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
