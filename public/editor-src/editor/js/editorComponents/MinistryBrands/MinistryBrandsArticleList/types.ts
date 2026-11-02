import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";
import type { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  category: string;
  group: string;
  series: string;
  itemsNumber: number;
  showPagination: Switch;
  features: Switch;
  nonfeatures: Switch;
  showImages: Switch;
  showVideo: Switch;
  showAudio: Switch;
  showMediaLinks: Switch;
  showTitle: Switch;
  showDate: Switch;
  showCategory: Switch;
  showGroup: Switch;
  showSeries: Switch;
  showAuthor: Switch;
  showMetaHeadings: Switch;
  showPreview: Switch;
  detailPageButtonText: string;
  detailPage: string;
  showMetaIcons: Switch;
}
