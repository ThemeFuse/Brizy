import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent";
import { WithClassName } from "visual/utils/options/attributes";
import { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  showImages: Switch;
  showPagination: Switch;
  showVideo: Switch;
  showAudio: Switch;
  showMediaLinks: Switch;
  showTitle: Switch;
  showDate: Switch;
  showCategory: Switch;
  showGroup: Switch;
  showSeries: Switch;
  showPreacher: Switch;
  showPassage: Switch;
  showMeta: Switch;
  showPreview: Switch;
  showGroupFilter: Switch;
  showCategoryFilter: Switch;
  showSeriesFilter: Switch;
  showSpeakerFilter: Switch;
  showSearchFilter: Switch;

  groupFilterHeading: string;
  categoryFilterHeading: string;
  defaultCategory: string;
  seriesFilterHeading: string;
  speakerFilterHeading: string;
  searchFilterPlacehoder: string;

  detailPage: string;
  detailPageButtonText: string;
  howmany: string;
}
