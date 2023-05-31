import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent";
import { WithClassName } from "visual/utils/options/attributes";
import { Switch } from "../utils/types";

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
  showPreacher: Switch;
  showPassage: Switch;
  showMetaHeadings: Switch;
  showPreview: Switch;
  recentSermons: string;
  showPreviousPage: Switch;
}
