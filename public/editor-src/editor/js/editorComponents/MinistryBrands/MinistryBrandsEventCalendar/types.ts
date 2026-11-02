import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";
import type { Switch } from "../utils/types";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface Value extends ElementModel {
  category: string;
  group: string;
  detailPage: string;
  source: string;
  detailPageTitle: string;
  subscribeToCalendarText: string;

  numberOfMonths: number;
  visibleMonth: number;

  features: Switch;
  nonfeatures: Switch;

  showEventTime: Switch;
  timeFormat: "12" | "24";
  showSubscribeToCalendarButton: Switch;
}
