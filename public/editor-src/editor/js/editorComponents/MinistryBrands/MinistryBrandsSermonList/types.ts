import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/utils/options/attributes";
import { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  columnNumber: number;
  itemsNumber: number;
  showImages: Switch;
  showDate: Switch;
  showTitle: Switch;
  showCategory: Switch;
  showGroup: Switch;
  showPreacher: Switch;
  showPassages: Switch;
  showMedia: Switch;
  showPreview: Switch;
  showVideo: Switch;
  showAudio: Switch;
  showSeries: Switch;
  showPagination: Switch;
  showMeta: Switch;
  showMetaIcons: Switch;
  group: string;
  category: string;
  series: string;
  detailPageButton: string;
  detailPage: string;
  source: string;
  detailPageTitle: string;
  features: Switch;
  nonfeatures: Switch;
}
