import { DragEndEvent } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { FC, ReactNode } from "react";
import { Props as OptionProps } from "visual/component/Options/Type";
import { ToolbarItemsInstance } from "visual/component/Toolbar/ToolbarItems";
import {
  OptionDefinition,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";

//#region Addable Model
export interface GroupBase {
  id: string;
  title: string;
}

export interface Model {
  value: Array<GroupBase>;
}

export interface OptionGroup extends GroupBase {
  options: Array<OptionDefinition>;
}

interface Props extends OptionProps<Model> {
  id: string;
  shape: Array<ToolbarItemType>;
  optionGroups: Array<OptionGroup>;
  config?: {
    title?: string;
    icon?: string;
    showCount?: boolean;
    optionGroupTitle?: string;
    sidebarHeadTitle?: string;
    addNewGroupTitle?: string;
    emptyMessage?: string;
    className?: string;
    extraLabel?: string;
  };
}

export type Component = FC<Props>;
//#endregion

export type ActiveGroup = {
  groupId: string;
  isOpen: boolean;
};
type SetActiveGroup = (activeGroup: ActiveGroup) => void;
type RemoveGroupHandler = (groupId: string) => void;

export interface AddableState {
  optionGroups: Array<OptionGroup>;
  activeGroup: ActiveGroup | null;
  sidebar: {
    isOpen: boolean;
    alignment: SidebarAlignment;
  };
}

//#region Addable Groups Type
export interface SortableProps {
  activeGroup: ActiveGroup | null;
  optionGroups: Array<OptionGroup>;
  onDragEnd: (e: DragEndEvent) => void;
  setActiveGroup: SetActiveGroup;
  onRemove: (groupID: string) => void;
  overlayRenderNode: HTMLElement;
  onRename: ({ groupId, title }: { groupId: string; title: string }) => void;
  toolbar?: ToolbarItemsInstance;
}

export interface SortableGroupProps
  extends Omit<GroupProps, "style" | "onRemove" | "onRename"> {
  groupId: string;
  setActiveGroup: SetActiveGroup;
  onRemove: RemoveGroupHandler;
  overlayRenderNode: HTMLElement;
  onRename: ({ groupId, title }: { groupId: string; title: string }) => void;
}

export interface GroupProps
  extends GroupBodyProps,
    Omit<GroupHeadProps, "title"> {
  isActive?: boolean;
  title: string;
  style?: { transform?: string; transition?: string };
}

export interface GroupTitleProps {
  title: string;
  onRename?: (title: string) => void;
}

export interface GroupHeadProps extends GroupTitleProps {
  dragDisabled?: boolean;
  isOpen?: boolean;
  listeners?: SyntheticListenerMap;
  onOpen?: VoidFunction;
  onRemove?: VoidFunction;
}

export interface GroupBodyProps {
  options: Array<OptionDefinition>;
  toolbar?: ToolbarItemsInstance;
}

//#endregion

//#region Sidebar Types
type SidebarAlignment = "left" | "right";

export interface SidebarProps extends SidebarHeadProps, SidebarContentProps {
  isOpen: boolean;
  children: ReactNode;
  renderNode: HTMLElement | undefined;
  onClickOutside: VoidFunction;
  className?: string;
}

export interface SidebarHeadProps {
  align: SidebarAlignment;
  onAlign: VoidFunction;
  sidebarHeadTitle?: string;
}

export interface SidebarContentProps {
  children: ReactNode;
  onAddGroup: VoidFunction;
  addNewGroupTitle?: string;
}

//#endregion

//#region Addable reducer Types
export enum AddableActions {
  REMOVE = "ADDABLE/REMOVE",
  REORDER = "ADDABLE/REORDER",
  TOGGLE_SIDEBAR_ALIGNMENT = "ADDABLE/TOGGLE_SIDEBAR_ALIGNMENT",
  TOGGLE_SIDEBAR = "ADDABLE/TOGGLE_SIDEBAR",
  CLOSE_SIDEBAR = "ADDABLE/CLOSE_SIDEBAR",
  SET_ACTIVE_GROUP = "ADDABLE/SET_ACTIVE_GROUP",
  SET_OPTION_GROUPS = "ADDABLE/SET_OPTION_GROUPS",
  SET_GROUP_TITLE = "ADDABLE/SET_GROUP_TITLE"
}

export interface Remove {
  type: AddableActions.REMOVE;
  payload: {
    groupId: string;
  };
}

export interface Reorder {
  type: AddableActions.REORDER;
  payload: {
    oldIndex: number;
    newIndex: number;
  };
}

export interface ToggleSidebarAlignment {
  type: AddableActions.TOGGLE_SIDEBAR_ALIGNMENT;
}

export interface ToggleSidebar {
  type: AddableActions.TOGGLE_SIDEBAR;
}

export interface CloseSidebar {
  type: AddableActions.CLOSE_SIDEBAR;
}

export interface SetActiveId {
  type: AddableActions.SET_ACTIVE_GROUP;
  payload: ActiveGroup;
}

export interface SetOptionGroups {
  type: AddableActions.SET_OPTION_GROUPS;
  payload: {
    optionGroups: Array<OptionGroup>;
  };
}

export interface SetGroupTitle {
  type: AddableActions.SET_GROUP_TITLE;
  payload: {
    groupId: string;
    title: string;
  };
}

export type Actions =
  | Remove
  | Reorder
  | ToggleSidebarAlignment
  | ToggleSidebar
  | SetActiveId
  | SetOptionGroups
  | SetGroupTitle
  | CloseSidebar;

//#endregion
