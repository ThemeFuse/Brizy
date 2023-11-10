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
  detailPage: string;
  source: string;
  detailPageTitle: string;
  subscribeToCalendarText: string;

  numberOfMonths: number;
  visibleMonth: number;

  features: Switch;
  nonfeatures: Switch;

  showEventTime: Switch;
  showSubscribeToCalendarButton: Switch;
}
