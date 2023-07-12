import { ElementModel } from "visual/component/Elements/Types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { Dictionary } from "visual/types/utils";
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
}

export type ContextMenuItem = ContextMenuItemButton | ContextMenuItemGroup;

export interface ContextMenuProps<M extends ElementModel> {
  id: string;
  componentId: string;
  getItems: (v: M, c: Editor<M>) => ContextMenuItem[];
}

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
