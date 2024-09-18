import { t } from "visual/utils/i18n";
import { MValue } from "visual/utils/value";

export enum Layout {
  Default = "default",
  Shopify = "shopify"
}

export const readLayout = (id: unknown): MValue<Layout> => {
  switch (id) {
    case Layout.Default:
    case Layout.Shopify:
      return id;
  }
};

export interface ThemeLayout {
  id: Layout;
  title: string;
}

export enum Tabs {
  settings = "settings-tab"
}

export const tabs = [
  {
    id: Tabs.settings,
    icon: "nc-settings",
    title: t("Settings")
  }
];

export interface TabType {
  id: Tabs;
  icon: string;
  title: string;
  active: boolean;
  onClick?: (id: Tabs) => void;
}
