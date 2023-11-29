import { t } from "visual/utils/i18n";

export type Layout = {
  id: string;
  title: string;
};

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
