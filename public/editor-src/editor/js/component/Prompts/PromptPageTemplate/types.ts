import { ShopifyPage } from "visual/types";
import { Layout, Tabs } from "visual/component/Prompts/common/PromptPage/types";
import { Setters } from "./types/Setters";
import { Actions as _Actions } from "visual/component/Prompts/common/states/Classic/types/Actions";
import { State } from "visual/component/Prompts/common/states/Classic/types/State";

export interface Props {
  selectedLayout: ShopifyPage["layout"] | undefined;
  headTitle: string;
  pageTitle: string | undefined;
  opened: boolean;
  title: string;
  onClose: VoidFunction;
  onSave: () => Promise<unknown>;
  onCancel: VoidFunction;
}

export interface Invalid {
  activeTab: Tabs;
  title: string | undefined;
  layout: string;
  layouts: [Layout, ...Layout[]];
  error: string | undefined;
}

export interface Valid extends Invalid {
  title: string;
}

export type Actions = Setters | _Actions<Invalid>;

export type RulesState = State<Invalid, Valid>;
