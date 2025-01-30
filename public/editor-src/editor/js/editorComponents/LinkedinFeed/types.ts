import { ElementModel } from "visual/component/Elements/Types";

type Switch = "on" | "off";

export interface Value extends ElementModel {
  embedUrl: string;
  placeholderSpinner: string;
  linkText: string;
  placeholderSpinnerDisabled: Switch;
  placeholderDisabled: Switch;
  customCSS: string;
}
