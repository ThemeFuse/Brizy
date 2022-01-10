import { ShopifyPage } from "visual/types";
import { State } from "../common/states/Classic/types/State";
import { Layout, Tabs } from "../common/PromptPage/types";
import { Setters } from "visual/component/Prompts/PromptPageRules/types/Setters";
import { Actions as _Actions } from "visual/component/Prompts/common/states/Classic/types/Actions";
import { Rule } from "visual/utils/api/types";

export interface Props {
  headTitle: string;
  pageTitle: string | undefined;
  opened: boolean;
  selectedLayout: ShopifyPage["layout"] | undefined;
  onClose: VoidFunction;
  onSave: () => Promise<unknown>;
  onCancel: VoidFunction;
}

export interface Item extends Rule {
  selected: boolean;
}

export interface Invalid {
  activeTab: Tabs;
  title: string | undefined;
  layout: string;
  layouts: [Layout, ...Layout[]];
  items: [Item, ...Item[]];
  error: string | undefined;
}

export interface Valid extends Invalid {
  title: string;
  layout: string;
}

export type Actions = Setters | _Actions<Invalid>;

export type RulesState = State<Invalid, Valid>;
