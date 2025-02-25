import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export interface TemplateIconData {
  type: string;
  iconName: string;
  filename?: string;
  suffix?: string;
  config: ConfigCommon;
}

export interface CustomIconOptions {
  pattern: string;
  baseUrl: string;
  uid: string;
  fileName?: string;
}
