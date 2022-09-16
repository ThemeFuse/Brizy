import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  productId: string;
  customCSS: string;
  footerDisplay: "on" | "off";
  signinLink: "on" | "off";
  breadcrumbs: "on" | "off";
}
