import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  footerDisplay: "on" | "off";
  sidebarAlign: "LEFT" | "RIGHT";
}
