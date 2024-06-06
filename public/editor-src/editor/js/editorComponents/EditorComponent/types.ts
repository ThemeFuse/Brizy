import { ElementModel } from "visual/component/Elements/Types";
import { OptionName, OptionValue } from "visual/component/Options/types";
import {
  OptionDefinition,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import { Dictionary } from "visual/types/utils";
import { Choices, Handler } from "visual/utils/options/getDynamicContentOption";
import { TypeChoices } from "visual/utils/options/types";
import * as Responsive from "visual/utils/responsiveMode";
import * as State from "visual/utils/stateMode";
import { MValue } from "visual/utils/value";
import { Editor } from ".";
import {
  DCObjDetails,
  DCObjIncomplete,
  DCObjResult
} from "./DynamicContent/getDCObj";
import { EditorComponentContextValue } from "./EditorComponentContext";

export interface ECDC {
  pendingDCObjIncomplete?: DCObjIncomplete;
  keys?: DCObjDetails;
  lastCache?: DCObjResult;
}

export type ECKeyDCInfo = {
  key: string;
  hasDC: boolean;
  staticValue: unknown;
  dcValue: string;
  attr: Dictionary<unknown>;
  fallback: unknown;
  entityType?: unknown;
  entityId?: unknown;
};

export type Model<M> = M & {
  _id?: string;
  _styles?: string[];
  tabsState?: State.State;
};

export type Meta = MValue<{ [k: string]: unknown }>;

export type ContextGetItems<M extends ElementModel> = (
  v: M,
  c: Editor<M>
) => ContextMenuItem[];

export interface ContextMenuItemButton {
  id: string;
  type: "button";
  title: string;
  inactive?: boolean;
  helperText: (d: { isInSubMenu: boolean }) => string;
  onChange?: () => void;
}

export interface ContextMenuItemGroup {
  id: string;
  type: "group";
  title?: string;
  icon?: string;
  items?: ContextMenuItem[];
  disabled?: (item: ElementModel, meta: ComponentsMeta) => void;
}

export type ContextMenuItem = ContextMenuItemButton | ContextMenuItemGroup;

export interface ContextMenuProps<M extends ElementModel> {
  id: string;
  componentId: string;
  getItems: (v: M, c: Editor<M>) => ContextMenuItem[];
}

export type Getter = (key: string) => OptionValue<OptionName>;

export type Params<
  M extends ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any> = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string, any> = Record<string, unknown>
> = {
  v: M;
  component: Editor<M, P, S>;
  device: Responsive.ResponsiveMode;
  state: State.State;
  context: EditorComponentContextValue;
  getValue: Getter;
};

export type GetItems<
  M extends ElementModel = ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any> = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string, any> = Record<string, unknown>
> = (d: Params<M, P, S>) => ToolbarItemType[];

export type SidebarConfig<
  M extends ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any> = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string, any> = Record<string, unknown>
> = {
  getItems: GetItems<M, P, S>;
  title?: string | ((d: { v: M }) => string);
};

export type NewToolbarConfig<
  M extends ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any> = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string, any> = Record<string, unknown>
> = {
  getItems: GetItems<M, P, S>;
};

export type OnChangeMeta<M> = Meta & {
  patch?: Partial<Model<M>>;
  intent?: "replace_all" | "remove_all";
};

export type Rule = string | { rule: string; mapper: <T>(m: T) => void };

export type DefaultValueProcessed<T> = {
  defaultValueFlat: T;
  dynamicContentKeys: string[];
};

export type OldToolbarConfig<M> = {
  getItemsForDesktop: (v: M, context?: unknown) => ToolbarItemType[];
  getItemsForTablet: (v: M, context?: unknown) => ToolbarItemType[];
  getItemsForMobile: (v: M, context?: unknown) => ToolbarItemType[];
};

export type ToolbarExtend = {
  getItems: (device?: Responsive.ResponsiveMode) => OptionDefinition[];
  getSidebarItems: (device?: Responsive.ResponsiveMode) => OptionDefinition[];
  getSidebarTitle: () => string;
  onBeforeOpen?: () => void;
  onBeforeClose?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export interface ComponentsMeta {
  desktopW?: number;
  desktopWNoSpacing?: number;
  tabletW?: number;
  tabletWNoSpacing?: number;
  mobileW?: number;
  mobileWNoSpacing?: number;
  sectionPopup?: boolean;
  sectionPopup2?: boolean;
  [k: string]: unknown;
}

export interface ToolbarConfig {
  selector: string;
  toolbar?: ToolbarItemType[];
  sidebar?: ToolbarItemType[];
}

export interface ToolbarProps {
  getValue: Getter;
  getDCOption: (type: TypeChoices) => MValue<Handler | Choices>;
}

export interface ParsedToolbarData {
  dv: Record<string, unknown>;
  DCKeys: Array<string>;
}

export interface ConfigGetter {
  getConfig: ({ getValue, getDCOption }: ToolbarProps) => Array<ToolbarConfig>;
}
