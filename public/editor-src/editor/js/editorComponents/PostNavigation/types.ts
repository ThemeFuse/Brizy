import { ElementModel } from "visual/component/Elements/Types";

type Switch = "on" | "off";

export interface Value extends ElementModel {
  showPost: Switch;
  showTitle: Switch;
  prevLabel: string;
  nextLabel: string;
  customCSS: string;
}
