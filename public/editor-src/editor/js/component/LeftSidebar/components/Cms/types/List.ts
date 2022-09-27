import { Shop } from "visual/component/LeftSidebar/components/Cms/types/Modules/Shop";
import { ProjectId } from "visual/component/LeftSidebar/components/Cms/types/ProjectId";
import { SupportLinks } from "visual/component/LeftSidebar/components/Cms/types/SupportLinks";
import { Subscription } from "visual/global/Config/types/shopify/Subscription";
import { ActiveItem } from "./ActiveItem";
import { Authorize } from "./Authorize";
import { WithPayload } from "./Base";
import { Locale } from "./Locale";
import { WhiteLabel } from "./WhiteLabel";

interface Base {
  development: boolean;
  previewUrl: string;
  mediaUrl: string;
  customerPreviewUrl: string;
  activeItem: ActiveItem;
  projectId: ProjectId;
  userApi: Authorize;
  locale: Locale;
}

export interface Cloud extends Base {
  __type: "cloud";
  protectedPagePassword: string;
  domainUrl: string;
  settingsUrl: string;
  customersSlug: string;
  categoriesSlug: string;
  productsSlug: string;
  taxesInfoUrl: string;
  user: {
    isPro: boolean;
  };
  whiteLabel: WhiteLabel;
  projectApi: Authorize;
  appointmentsApi: Authorize;
  translationApi: Authorize;
  shop: Authorize;
  shopify: Authorize;
  square: Authorize;
  projectId: ProjectId;
  shopChannel: string;
  taxesMainCategoryId: string;
  notificationApi: Authorize;
  supportLinks: SupportLinks;
  customersEditorUrl: string;
  modules: {
    shop: Shop;
    users: {
      disabled: boolean;
    };
  };
}

export interface Shopify extends Base {
  __type: "shopify";
  subscription: Subscription;
  api: Authorize;
  appointmentsApi: Authorize;
  translationApi: Authorize;
  customersEditorUrl: string;
  updateEditorApi: Authorize;
  builderVersion: string;
}

export type Context = Cloud | Shopify;

export type List = WithPayload<"list", Context>;

export const list = (payload: Context): List => ({ type: "list", payload });
