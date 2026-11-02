import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";
import type { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  recentStaff: string;
  showImage: Switch;
  showTitle: Switch;
  showPosition: Switch;
  showGroups: Switch;
  showPhoneWork: Switch;
  showPhoneCell: Switch;
  showEmail: Switch;
  showFacebook: Switch;
  showTwitter: Switch;
  showInstagram: Switch;
  showWebsite: Switch;
  showRss: Switch;
  showMetaHeadings: Switch;
  showAboutText: Switch;
  showMetaIcons: Switch;
  showFullEmail: Switch;
  showPreviousPage: Switch;
  staffSlug: string;
  group: string;
  detailPageButtonText: string;
  detailPage: string;
}
