import { t } from "visual/utils/i18n";

export type Layout = {
  id: string;
  title: string;
};

export enum Tabs {
  page = "page-tab",
  settings = "settings-tab"
}

export const tabs = [
  {
    id: Tabs.page,
    icon: "nc-eye-17",
    title: t("Page")
  },
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
