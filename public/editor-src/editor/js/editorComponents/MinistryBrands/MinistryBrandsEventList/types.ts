import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent";
import { WithClassName } from "visual/utils/options/attributes";
import { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  columnNumber: number;
  itemsNumber: number;
  showImage: Switch;
  showTitle: Switch;
  showDate: Switch;
  showCategory: Switch;
  showGroup: Switch;
  showPreview: Switch;
  showPagination: Switch;
  showMeta: Switch;
  group: string;
  category: string;
  detailPage: string;
  source: string;
  detailPageTitle: string;
  detailPageButtonText: string;
  features: Switch;
  nonfeatures: Switch;
  showLocation: Switch;
  showRegistration: Switch;
}
