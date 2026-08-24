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
  shortcuts = "shortcuts",
  allowEmbedCode = "allowEmbedCode"
}

interface LeftSidebarMoreOptionBase {
  label: string;
  icon?: string;
  roles?: Array<string>;
}

// Navigates to a destination — the only variant that needs one.
export interface LeftSidebarMoreLinkOption extends LeftSidebarMoreOptionBase {
  type: LeftSidebarMoreOptionsIds.link;
  link: string;
  linkTarget?: "_blank" | "_self" | "_parent" | "_top";
}

// Act on the editor itself, so they carry no link: `shortcuts` opens the
// keyboard-shortcuts prompt and `allowEmbedCode` toggles whether embed code
// runs in the editor.
export interface LeftSidebarMoreActionOption extends LeftSidebarMoreOptionBase {
  type:
    | LeftSidebarMoreOptionsIds.shortcuts
    | LeftSidebarMoreOptionsIds.allowEmbedCode;
}

export type LeftSidebarMoreOptions =
  | LeftSidebarMoreLinkOption
  | LeftSidebarMoreActionOption;

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
