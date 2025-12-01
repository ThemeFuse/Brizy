import type { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/types/attributes";
import type { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  showImages: Switch;
  showTitle: Switch;
  showPosition: Switch;
  showGroups: Switch;
  showPhoneWork: Switch;
  showPhoneCell: Switch;
  showEmail: Switch;
  showFacebook: Switch;
  showTwitter: Switch;
  showWebsite: Switch;
  showInstagram: Switch;
  showGroupFilter: Switch;
  showSearch: Switch;
  showRss: Switch;
  showMetaHeadings: Switch;
  showMetaIcons: Switch;
  showFullEmail: Switch;
  showPagination: Switch;
  howmany: number;
  searchPlaceholder: string;
  detailPageButtonText: string;
  detailPage: string;
  groupFilterHeading: string;
  series: string;
}
