import type {
  Tabs,
  ThemeLayout
} from "visual/component/Prompts/common/PromptPage/types";
import type { Actions as _Actions } from "visual/component/Prompts/common/states/Classic/types/Actions";
import type { State } from "visual/component/Prompts/common/states/Classic/types/State";
import type { Layout } from "visual/types/Layout";
import type { ShopifyPage } from "visual/types/Page";
import type { Setters } from "./types/Setters";

export interface Props {
  selectedLayout: ShopifyPage["layout"] | undefined;
  headTitle: string;
  pageTitle: string | undefined;
  opened: boolean;
  title: string;
  pageId: string;
  onClose: VoidFunction;
  onSave: () => Promise<unknown>;
  onCancel: VoidFunction;
  onAfterSave?: VoidFunction;
}

export interface Invalid {
  activeTab: Tabs;
  title: string | undefined;
  layout: Layout;
  layouts: [ThemeLayout, ...ThemeLayout[]];
  error: string | undefined;
  isHomePage: boolean;
}

export interface Valid extends Invalid {
  title: string;
}

export type Actions = Setters | _Actions<Invalid>;

export type RulesState = State<Invalid, Valid>;
