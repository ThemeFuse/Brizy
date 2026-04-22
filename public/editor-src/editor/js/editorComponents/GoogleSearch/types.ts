import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  label: string;
  customCSS: string;
  searchStyle: "classic" | "minimal";
  engineId: string;
}
