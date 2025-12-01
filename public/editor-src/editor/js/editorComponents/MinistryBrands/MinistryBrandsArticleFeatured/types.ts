import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/types/attributes";
import { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  showImage: Switch;
  showVideo: Switch;
  showAudio: Switch;
  showMediaLinks: Switch;
  showTitle: Switch;
  showDate: Switch;
  showCategory: Switch;
  showGroup: Switch;
  showAuthor: Switch;
  showSeries: Switch;
  showMetaHeadings: Switch;
  showMetaIcons: Switch;
  showLatestArticles: Switch;
  features: Switch;
  nonfeatures: Switch;
  showPreview: Switch;
  showContent: Switch;
  detailPageButtonText: string;
  detailPage: string;
  source: string;
  detailPageTitle: string;
  articleSlug: string;
  recentArticles: string;
  category: string;
  group: string;
}
