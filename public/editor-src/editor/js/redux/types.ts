import {
  PageWP,
  PageCloud,
  GlobalBlock,
  SavedBlock,
  GoogleFont,
  UploadedFont
} from "visual/types";

// WARNING: this is a work in progress.
// Types should be added as we go on
export type ReduxState = {
  page: PageWP | PageCloud;
  globalBlocks: {
    [key: string]: GlobalBlock;
  };
  savedBlocks: {
    [key: string]: SavedBlock;
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
    deviceMode: "desktop" | "tablet" | "mobile";
    leftSidebar: {
      isOpen: boolean;
      drawerContentType: string; // TODO: converted to a union of actual drawer type later
    };
    rightSidebar: {
      isOpen: boolean;
      lock: "manual" | "auto" | undefined;
      alignment: "right" | "left";
    };
    showHiddenElements: boolean;
  };
};
