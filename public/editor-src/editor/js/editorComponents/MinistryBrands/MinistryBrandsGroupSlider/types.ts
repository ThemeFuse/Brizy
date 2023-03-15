import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent";
import { WithClassName } from "visual/utils/options/attributes";
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

  detailPageButton: string;
  detailPage: string;
  source: string;
  detailPageTitle: string;
}
