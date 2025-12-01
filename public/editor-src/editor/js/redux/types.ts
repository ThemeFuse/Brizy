import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import type {
  Authorized,
  DeviceMode,
  Error,
  SyncAllowed,
  UserRole
} from "visual/types";
import type { Block, BlocksHTML } from "visual/types/Block";
import type { Fonts } from "visual/types/Fonts";
import type { GlobalBlock } from "visual/types/GlobalBlock";
import type { Page } from "visual/types/Page";
import type { Project } from "visual/types/Project";
import type { Screenshot } from "visual/types/Screenshot";
import type { ExtraFontStyle, Style } from "visual/types/Style";
import type { CSSSymbol, SymbolCSS } from "visual/types/Symbols";
import type { HistoryEnhancerState } from "./history/types";

export enum StoreChanged {
  pending = "pending",
  changed = "changed",
  unchanged = "unchanged"
}

export const allowedDrawerComponents = [
  LeftSidebarOptionsIds.addElements,
  LeftSidebarOptionsIds.globalStyle,
  LeftSidebarOptionsIds.reorderBlock,
  LeftSidebarOptionsIds.custom
] as const;

export type DrawerContentTypes = (typeof allowedDrawerComponents)[number];

export type SidebarAlign = "left" | "right";

// WARNING: this is a work in progress.
// Types should be added as we go on
export type ReduxState = {
  project: Project;
  page: Page;
  symbols: {
    element:
      | undefined
      | {
          uid: string;
          path: string[];
        };
    classes: CSSSymbol[];
  };
  symbolsCSS: SymbolCSS;
  globalBlocks: {
    [key: string]: GlobalBlock;
  };
  changedGBIds: string[];
  blocksOrder: string[];
  blocksData: {
    [key: string]: Block;
  };
  blocksHtml: {
    inProcessing: number;
    inPending: boolean;
    blocks: {
      [key: string]: BlocksHTML;
    };
    initialized: boolean;
  };
  fonts: Fonts;
  ui: {
    deviceMode: DeviceMode;
    activeElement: Element | null;
    leftSidebar: {
      drawerContentType: DrawerContentTypes | null;
    };
    rightSidebar: {
      type: "options" | "help";
      isOpen: boolean;
      lock: "manual" | "auto" | undefined;
      alignment: SidebarAlign;
      activeTab: string | undefined;
      expanded: boolean;
    };
    showHiddenElements: boolean;
    currentRole: UserRole;
    currentLanguage: string;
  };
  styles: Style[];
  extraStyles: Style[];
  extraFontStyles: ExtraFontStyle[];
  authorized: Authorized;
  syncAllowed: SyncAllowed;
  copiedElement: {
    path: (string | number)[];
    value: {
      items: Block[];
    };
  };
  storeWasChanged: StoreChanged;
  error: null | Error;
  currentStyleId: string;
  currentStyle: Style;
  screenshots: {
    _published: Record<string, Screenshot>;
    [k: string]: Screenshot | Record<string, Screenshot>;
  };

  // below any are temporary and needed for ReduxStateWithHistory
  // they will be removed once we finish with ReduxState types
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  pageBlocks: any;
  globalBlocksUpdates: any;
  /* eslint-enable  @typescript-eslint/no-explicit-any */
};

// this is temporary and will be automatically infered after
// we move all the reducers to ts and finish with all ReduxState types
export type ReduxStateWithHistory = HistoryEnhancerState<
  ReduxState,
  | "pageBlocks"
  | "currentStyleId"
  | "currentStyle"
  | "extraFontStyles"
  | "globalBlocksUpdates"
>;
