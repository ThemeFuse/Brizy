import { WhiteLabel } from "./WhiteLabel";
import { Authorize } from "./Authorize";
import { WithPayload } from "./Base";
import { ProjectId } from "visual/component/LeftSidebar/components/Cms/types/ProjectId";
import { SupportLinks } from "visual/component/LeftSidebar/components/Cms/types/SupportLinks";
import { ActiveItem } from "./ActiveItem";

interface Base {
  development: boolean;
  previewUrl: string;
  mediaUrl: string;
  customerPreviewUrl: string;
  activeItem: ActiveItem;
  projectId: ProjectId;
}

export enum Subscription {
  Free = "free",
  Silver = "silver",
  Gold = "gold",
  Platinum = "platinum"
}

export interface Cloud extends Base {
  __type: "cloud";
  protectedPagePassword: string;
  domainUrl: string;
  settingsUrl: string;
  user: {
    isPro: boolean;
  };
  whiteLabel: WhiteLabel;
  projectApi: Authorize;
  userApi: Authorize;
  appointmentsApi: Authorize;
  translationApi: string;
  shop: Authorize;
  taxesInfoUrl: string;
  shopChannel: string;
  taxesMainCategoryId: string;
  notificationApi: Authorize;
  supportLinks: SupportLinks;
  customersEditorUrl: string;
}

export interface Shopify extends Base {
  __type: "shopify";
  subscription: Subscription;
  api: Authorize;
  appointmentsApi: Authorize;
  translationApi: Authorize;
  customersEditorUrl: string;
  updateEditorApi: Authorize;
}

export type Context = Cloud | Shopify;

export type List = WithPayload<"list", Context>;

export const list = (payload: Context): List => ({ type: "list", payload });
