import type { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  facebookType: string;
  facebookEmbedType: string;

  borderColorHex: string;
  borderColorPalette: string;
  boxShadowColorHex: string;
  boxShadowColorPalette: string;

  className: string;
  customCSS: string;
  pageTabs: string;
}

export interface AppData {
  appId: number;
  href: string;
  lang: string;
}

export type PageTabs = "timeline" | "events" | "messages";
