import {
  Layout,
  Tabs,
  ThemeLayout
} from "visual/component/Prompts/common/PromptPage/types";
import { Actions as _Actions } from "visual/component/Prompts/common/states/Classic/types/Actions";
import { State } from "visual/component/Prompts/common/states/Classic/types/State";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ShopifyPage } from "visual/types";
import { BlogSourceItem } from "visual/utils/api/types";
import { Setters } from "./types/Setters";

export interface Props {
  headTitle: string;
  pageTitle: string | undefined;
  opened: boolean;
  selectedLayout: ShopifyPage["layout"] | undefined;
  onClose: VoidFunction;
  onSave: () => Promise<unknown>;
  onCancel: VoidFunction;
  onAfterSave?: VoidFunction;
  config: ConfigCommon;
}

export interface Invalid {
  activeTab: Tabs;
  title: string | undefined;
  layout: Layout;
  layouts: [ThemeLayout, ...ThemeLayout[]];
  items: BlogSourceItem[];
  selected: BlogSourceItem | undefined;
  error: string | undefined;
}

export interface Valid extends Invalid {
  title: string;
  selected: BlogSourceItem;
}

export type Actions = Setters | _Actions<Invalid>;

export type RulesState = State<Invalid, Valid>;
