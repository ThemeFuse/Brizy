import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { Switch } from "visual/editorComponents/MinistryBrands/utils/types";
import type { WithClassName } from "visual/types/attributes";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  showImage: Switch;
  showVideo: Switch;
  showAudio: Switch;
  showMediaLinksVideo: Switch;
  showMediaLinksAudio: Switch;
  showMediaLinksDownload: Switch;
  showMediaLinksNotes: Switch;
  showTitle: Switch;
  showDate: Switch;
  showCategory: Switch;
  showGroup: Switch;
  showSeries: Switch;
  showAuthor: Switch;
  showMetaHeadings: Switch;
  showContent: Switch;
  recentArticles: string;
  showPreviousPage: Switch;
  showMetaIcons: Switch;
}
