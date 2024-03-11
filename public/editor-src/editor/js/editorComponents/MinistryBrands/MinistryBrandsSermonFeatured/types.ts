import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/utils/options/attributes";
import { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  showImage: Switch;
  showVideo: Switch;
  showAudio: Switch;
  showTitle: Switch;
  showDate: Switch;
  showCategory: Switch;
  showGroup: Switch;
  showSeries: Switch;
  showPreacher: Switch;
  showPassage: Switch;
  showMetaHeadings: Switch;
  showContent: Switch;
  sermonLatest: Switch;
  sermonRecentList: string;
  sermonSlug: Switch;
  category: string;
  group: string;
  series: string;
  features: Switch;
  nonfeatures: Switch;
  showMediaLinks: Switch;
  showPreview: Switch;
  showMetaIcons: Switch;
  detailPageButtonText: string;
  detailPage: string;
  source: string;
  detailPageTitle: string;
}
