import type {
  ElementModel,
  ElementModelType2
} from "visual/component/Elements/Types";
import type {
  ComponentsMeta,
  NewToolbarConfig,
  SidebarConfig
} from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";

export type CookieBannerView = "banner" | "badge" | "preferences";

export type CookieBannerBadgePosition = "bottomLeft" | "bottomRight";

export type CookieBannerCategoryKey =
  | "necessary"
  | "preferences"
  | "statistics"
  | "marketing"
  | "other";

export interface Value extends ElementModel {
  items: ElementModelType2[];
  currentView: CookieBannerView;

  acceptButtonText: string;
  rejectButtonText: string;
  customizeButtonText: string;

  badgePosition: CookieBannerBadgePosition;

  dialogAcceptButtonText: string;
  saveButtonText: string;
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface ButtonSpec {
  modifier: string;
  textId: string;
  cc: string;
  toolbar: NewToolbarConfig<Value, Props>;
  sidebar: SidebarConfig<Value, Props>;
}
