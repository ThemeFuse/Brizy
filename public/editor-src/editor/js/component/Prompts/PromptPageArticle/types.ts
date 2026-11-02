import type {
  Tabs,
  ThemeLayout
} from "visual/component/Prompts/common/PromptPage/types";
import type { Actions as _Actions } from "visual/component/Prompts/common/states/Classic/types/Actions";
import type { State } from "visual/component/Prompts/common/states/Classic/types/State";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { Layout } from "visual/types/Layout";
import type { ShopifyPage } from "visual/types/Page";
import type { BlogSourceItem } from "visual/utils/api/types";
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
