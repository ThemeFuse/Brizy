import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";
import type { Switch } from "../utils/types";

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
  recentEvents: string;
  showPreviousPage: Switch;
  dateFormat: string;
  showMetaIcons: Switch;
  showSubscribeToEvent: Switch;
  subscribeToEventButtonText: string;
}
