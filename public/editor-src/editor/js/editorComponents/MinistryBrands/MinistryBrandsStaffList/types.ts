import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/types/attributes";
import { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  columnNumber: number;
  itemsNumber: number;
  showImages: Switch;
  showTitle: Switch;
  showMeta: Switch;
  showGroups: Switch;
  showMetaIcons: Switch;
  showPosition: Switch;
  showPhoneWork: Switch;
  showPhoneCell: Switch;
  showEmail: Switch;
  showFacebook: Switch;
  showTwitter: Switch;
  showWebsite: Switch;
  showInstagram: Switch;
  showFullEmail: Switch;
  showPagination: Switch;
  showRss: Switch;
  category: string;
  detailPageButton: string;
  detailPage: string;
  source: string;
  detailPageTitle: string;
}
