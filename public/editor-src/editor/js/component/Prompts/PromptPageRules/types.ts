import type { Layout } from "visual/types/Layout";
import type { ShopifyPage } from "visual/types/Page";
import type { Rule } from "visual/utils/api/types";
import type { Tabs, ThemeLayout } from "../common/PromptPage/types";
import type { Actions as _Actions } from "../common/states/Classic/types/Actions";
import type { State } from "../common/states/Classic/types/State";
import type { Setters } from "./types/Setters";

export interface Props {
  headTitle: string;
  pageTitle: string | undefined;
  opened: boolean;
  selectedLayout: ShopifyPage["layout"] | undefined;
  onClose: VoidFunction;
  onSave: () => Promise<unknown>;
  onCancel: VoidFunction;
  onAfterSave?: VoidFunction;
}

export interface Item extends Rule {
  selected: boolean;
}

export interface Invalid {
  activeTab: Tabs;
  title: string | undefined;
  layout: Layout;
  layouts: [ThemeLayout, ...ThemeLayout[]];
  items: Item[];
  error: string | undefined;
}

export interface Valid extends Invalid {
  title: string;
  layout: Layout;
}

export type Actions = Setters | _Actions<Invalid>;

export type RulesState = State<Invalid, Valid>;
