export interface TemplateIconData {
  type: string;
  iconName: string;
  filename?: string;
  suffix?: string;
}

export interface CustomIconOptions {
  pattern: string;
  baseUrl: string;
  uid: string;
  fileName?: string;
}
