import { WithId } from "visual/utils/options/attributes";
import { DynamicContent } from "visual/global/Config/types/DynamicContent";
import { Pro } from "visual/global/Config/types/Pro";
import { User } from "visual/global/Config/types/User";
import { Urls } from "visual/global/Config/types/Urls";
import { Project } from "visual/global/Config/types/Project";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Config as Config_ } from "visual/global/Config/types";
import { Page, PageCollection } from "visual/types";
import { WhiteLabel } from "visual/component/LeftSidebar/components/Cms/types/WhiteLabel";
import { SupportLinks } from "visual/component/LeftSidebar/components/Cms/types/SupportLinks";
import { TemplateType } from "../TemplateType";
import { Role } from "visual/utils/membership";
import { Subscription } from "visual/global/Config/types/shopify/Subscription";
import { ShopifyTemplate } from "../shopify/ShopifyTemplate";

//#region Base
interface Base<Platform> extends ConfigCommon, WithId<number> {
  availableRoles: Role[];
  page: {
    id: string;
    isProtected: boolean;
    provider: "customers" | "collections";
    isCustomersPage: boolean;
    isResetPassPage: boolean;
  };
  container: {
    id: number;
  };
  tokenV2?: {
    access_token: string;
  };
  platform: Platform;
  dynamicContent: DynamicContent<"cloud">;
  pro: Pro<"cloud">;
  user: User<"cloud">;
  urls: Urls<"cloud">;
  project: Project<"cloud">;
  cms: {
    adminUrl: string;
    apiUrl: string;
    blogId: string;
    supportLinks: SupportLinks;
    customerEditorUrl: string;
    customerPreviewUrl: string;
    collectionPreviewUrl: string;
    translationsApiUrl: string;
  };
  whiteLabel?: WhiteLabel;
}

//#endregion

//#region CMS
export interface CMS extends Base<"cms"> {
  templateType?: TemplateType;
}

export const isCMS = (c: Cloud): c is CMS => c.platform === "cms";
//#endregion

//#region Shopify
export interface Shopify extends Base<"shopify"> {
  templates: { id: string }[];
  templateType: {
    id: string;
    type: ShopifyTemplate;
  };
  subscription: Subscription;
}

export const isShopify = (c: Cloud): c is Shopify => c.platform === "shopify";
//#endregion

//#region Provider
export const isCustomer = (c: CMS): boolean => c.page.provider === "customers";

export const isCollection = (c: CMS): boolean =>
  c.page.provider === "collections";
//#endregion

export type Cloud = CMS | Shopify;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isCloud = (config: Config_): config is Cloud =>
  TARGET === "Cloud" || TARGET === "Cloud-localhost";

//#region Page
export const isCollectionPage = (p: Page): p is PageCollection => {
  return "collectionType" in p;
};
//#endregion
