import { Layout, Tabs } from "visual/component/Prompts/common/PromptPage/types";
import { Setters } from "./types/Setters";
import { Actions as _Actions } from "visual/component/Prompts/common/states/Classic/types/Actions";
import { State } from "visual/component/Prompts/common/states/Classic/types/State";
import { BlogSourceItem } from "visual/utils/api/types";
import { ShopifyPage } from "visual/types";

export interface Props {
  headTitle: string;
  pageTitle: string | undefined;
  opened: boolean;
  selectedLayout: ShopifyPage["layout"] | undefined;
  onClose: VoidFunction;
  onSave: () => Promise<unknown>;
  onCancel: VoidFunction;
}

export interface Invalid {
  activeTab: Tabs;
  title: string | undefined;
  layout: string;
  layouts: [Layout, ...Layout[]];
  items: [BlogSourceItem, ...BlogSourceItem[]];
  selected: BlogSourceItem | undefined;
  error: string | undefined;
}

export interface Valid extends Invalid {
  title: string;
  selected: BlogSourceItem;
}

export type Actions = Setters | _Actions<Invalid>;

export type RulesState = State<Invalid, Valid>;
