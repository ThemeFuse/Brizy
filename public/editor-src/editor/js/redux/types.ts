import {
  Page,
  GlobalBlock,
  GoogleFont,
  UploadedFont,
  Authorized,
  DeviceMode,
  Block,
  SyncAllowed,
  Style
} from "visual/types";
import { HistoryEnhancerState } from "./history/types";

// WARNING: this is a work in progress.
// Types should be added as we go on
export type ReduxState = {
  project: {};
  page: Page;
  globalBlocks: {
    [key: string]: GlobalBlock;
  };
  changedGBIds: string[];
  blocksOrder: string[];
  blocksData: {
    [key: string]: Block;
  };
  fonts: {
    config?: {
      data: GoogleFont[];
    };
    blocks?: {
      data: GoogleFont[];
    };
    google?: {
      data: GoogleFont[];
    };
    upload?: {
      data: UploadedFont[];
    };
  };
  ui: {
    deviceMode: DeviceMode;
    leftSidebar: {
      isOpen: boolean;
      drawerContentType: string | null | undefined; // TODO: converted to a union of actual drawer type later
    };
    rightSidebar: {
      isOpen: boolean;
      lock: "manual" | "auto" | undefined;
      alignment: "right" | "left";
    };
    showHiddenElements: boolean;
    currentRole: string;
  };
  styles: Style[];

  // below any are temporary and needed for ReduxStateWithHistory
  // they will be removed once we finish with ReduxState types
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  pageBlocks: any;
  currentStyleId: any;
  currentStyle: any;
  globalBlocksUpdates: any;
  /* eslint-enable  @typescript-eslint/no-explicit-any */
  extraFontStyles: Array<{ id: string }>;
  authorized: Authorized;
  syncAllowed: SyncAllowed;
  copiedElement: {
    path: [];
    value: {};
  };
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
