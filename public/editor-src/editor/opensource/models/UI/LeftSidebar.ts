export enum BaseElementTypes {
  Columns2 = "Columns2",
  Row2 = "Row2"
}

export enum LeftSidebarOptionsIds {
  addElements = "addElements",
  reorderBlock = "reorderBlock",
  globalStyle = "globalStyle",
  deviceMode = "deviceMode",
  more = "more",
  cms = "cms"
}

export interface LeftSidebarOptionBase {
  id: string;
  icon?: string;
  title?: string;
}

interface LeftSidebarCommonOption extends LeftSidebarOptionBase {
  type:
    | LeftSidebarOptionsIds.cms
    | LeftSidebarOptionsIds.reorderBlock
    | LeftSidebarOptionsIds.globalStyle
    | LeftSidebarOptionsIds.deviceMode
    | LeftSidebarOptionsIds.more;
}

export interface LeftSidebarAddElementsType extends LeftSidebarOptionBase {
  type: LeftSidebarOptionsIds.addElements;
  elements: {
    label: string;
    moduleNames: Array<BaseElementTypes>;
  }[];
}

export type LeftSidebarOption =
  | LeftSidebarCommonOption
  | LeftSidebarAddElementsType;

export enum LeftSidebarMoreOptionsIds {
  link = "link",
  shortcuts = "shortcuts"
}

export interface LeftSidebarMoreOptions {
  type: LeftSidebarMoreOptionsIds;
  label: string;
  link: string;
  icon?: string;
  linkTarget?: "_blank" | "_self" | "_parent" | "_top";
  roles?: Array<string>;
}

export interface LeftSidebar {
  topTabsOrder?: Array<LeftSidebarOption>;
  bottomTabsOrder?: Array<LeftSidebarOption>;

  [LeftSidebarOptionsIds.more]?: {
    options?: Array<LeftSidebarMoreOptions>;
  };

  [LeftSidebarOptionsIds.cms]?: {
    onOpen: (onClose: VoidFunction) => void;
    onClose: VoidFunction;
    icon?: string;
  };
}
