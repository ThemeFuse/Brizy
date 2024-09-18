import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/types/attributes";
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
  showMetaIcons: Switch;

  groupFilterHeading: string;
  categoryFilterHeading: string;
  defaultCategory: string;
  seriesFilterHeading: string;
  speakerFilterHeading: string;
  searchFilterPlacehoder: string;
  parentCategory: string;
  groupSlug: string;
  searchValue: string;

  detailPage: string;
  detailPageButtonText: string;
  howmany: string;
}
