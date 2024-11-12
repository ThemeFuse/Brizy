import { ElementModel } from "visual/component/Elements/Types";

type Switch = "on" | "off";

export interface Value extends ElementModel {
  embedUrl: string;
  placeholderSpinner: string;
  linkText: string;

  captioned: Switch;
  placeholderSpinnerDisabled: Switch;
  placeholderDisabled: Switch;
  scriptLoadDisabled: Switch;
}
