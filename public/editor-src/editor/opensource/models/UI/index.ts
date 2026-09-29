import type { LeftSidebar } from "./LeftSidebar";
import type { Publish } from "./Publish";
import type { Theme } from "./Theme";

export interface UI {
  // Available only when mode is Popup
  popupSettings?: {
    displayCondition?: boolean;
    deletePopup?: boolean;
    embedded?: boolean;
    horizontalAlign?: boolean;
    verticalAlign?: boolean;
    backgroundPreviewUrl?: string;
    scrollPageBehind?: boolean;
    clickOutsideToClose?: boolean;
  };

  // Theme
  theme?: Theme;

  // LeftSidebar
  leftSidebar?: LeftSidebar;

  // Publish
  publish?: Publish;
}
