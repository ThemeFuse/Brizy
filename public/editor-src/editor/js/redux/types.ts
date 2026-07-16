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

export interface ActiveElementMeta {
  id: string;
  type: string;
}

// WARNING: this is a work in progress.
// Types should be added as we go on
type ReduxStateBase = {
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
    storeGeneration: number;
    compiledGeneration: number;
    blocks: {
      [key: string]: BlocksHTML;
    };
    initialized: boolean;
  };
  fonts: Fonts;
  ui: {
    deviceMode: DeviceMode;
    activeElement: Element | null;
    activeElementMeta: ActiveElementMeta | null;
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
};

// The root reducer is wrapped in historyReducerEnhancer (redux/reducers/index.js),
// so `history` is always present on store state. The tracked keys must mirror
// `keysToTrack` in redux/reducers/index.js (it's untyped JS, so keep them in sync
// by hand until it's migrated to TS).
type StateWithHistory = HistoryEnhancerState<
  ReduxStateBase,
  | "blocksOrder"
  | "blocksData"
  | "currentStyleId"
  | "currentStyle"
  | "extraFontStyles"
  | "storeWasChanged"
  | "extraStyles"
  | "symbols"
>;

// Flattened via a mapped type: leaving ReduxState as an intersection breaks
// assignability from deferred generic prop reads (e.g. EditorComponent's
// Readonly<Props<M, P>>["reduxState"]).
export type ReduxState = {
  [K in keyof StateWithHistory]: StateWithHistory[K];
};
