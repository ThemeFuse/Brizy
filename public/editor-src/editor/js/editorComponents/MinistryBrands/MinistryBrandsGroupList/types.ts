import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";
import type { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}
export interface Value extends ElementModel {
  columnNumber: number;
  itemsNumber: number;
  showCategory: Switch;
  showGroup: Switch;
  showCoordinator: Switch;
  category: string;
  group: string;
  showPreview: Switch;
  detailPageButtonText: string;
  detailPage: string;
  source: string;
  detailPageTitle: string;
  showPagination: Switch;
  showImages: Switch;
  showDay: Switch;
  showTimes: Switch;
  showStatus: Switch;
  showChildcare: Switch;
  showResourceLink: Switch;
  showMetaIcons: Switch;
  dateFormat: string;
}
