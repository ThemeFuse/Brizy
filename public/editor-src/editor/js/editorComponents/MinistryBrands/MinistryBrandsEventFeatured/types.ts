import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/types/attributes";
import { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  showImage: Switch;
  showTitle: Switch;
  showDate: Switch;
  showCategory: Switch;
  showGroup: Switch;
  showMetaHeadings: Switch;
  showLocation: Switch;
  showRoom: Switch;
  showCoordinator: Switch;
  showCoordinatorEmail: Switch;
  showCoordinatorPhone: Switch;
  showCost: Switch;
  showWebsite: Switch;
  showRegistration: Switch;
  showDescription: Switch;
  showLatestEvents: Switch;
  features: Switch;
  nonfeatures: Switch;
  showPreview: Switch;

  detailPageButtonText: string;
  detailPage: string;
  source: string;
  detailPageTitle: string;
  eventSlug: string;
  recentEvents: string;
  category: string;
  group: string;
  dateFormat: string;
  showMetaIcons: Switch;
}
