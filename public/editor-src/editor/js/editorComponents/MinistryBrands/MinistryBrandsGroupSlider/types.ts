import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/types/attributes";
import { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  category: string;
  group: string;

  howmany: number;
  slidesToShow: number;

  showArrows: Switch;
  showPagination: Switch;
  showImages: Switch;
  showMeetingDay: Switch;
  showMeetingTimes: Switch;
  showCategory: Switch;
  showGroup: Switch;
  showStatus: Switch;
  showChildcare: Switch;
  showResourceLink: Switch;
  showPreview: Switch;
  showMetaIcons: Switch;

  detailPageButton: string;
  detailPage: string;
  source: string;
  detailPageTitle: string;
  dateFormat: string;
}
