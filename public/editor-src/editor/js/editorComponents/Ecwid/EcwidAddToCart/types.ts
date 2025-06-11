import type { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  iconName: string;
  iconType: string;
  iconFilename?: string;
  entityId: string;
  customCSS: string;
}
