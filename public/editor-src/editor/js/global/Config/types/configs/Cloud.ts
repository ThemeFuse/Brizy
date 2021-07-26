import { WithId } from "visual/utils/options/attributes";
import { DynamicContent } from "visual/global/Config/types/DynamicContent";
import { Pro } from "visual/global/Config/types/Pro";
import { User } from "visual/global/Config/types/User";
import { Urls } from "visual/global/Config/types/Urls";
import { Project } from "visual/global/Config/types/Project";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Config } from "visual/global/Config/types";

// region Base
interface Base<Platform> extends ConfigCommon, WithId<number> {
  page: {
    id: number;
    isProtected: boolean;
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
}

interface WithCMS {
  cms: {
    adminUrl: string;
    apiUrl: string;
    blogId: string;
  };
}

// endregion

// region Legacy
export type Legacy = Base<"legacy">;

export const isLegacy = (c: Cloud): c is Legacy => c.platform === "legacy";
// endregion

// region CMS
export interface CMS extends Base<"cms">, WithCMS {}

export const isCMS = (c: Cloud): c is CMS => c.platform === "cms";
// endregion

// region Shopify
export interface Shopify extends Base<"shopify">, WithCMS {}

export const isShopify = (c: Cloud): c is Shopify => c.platform === "shopify";
// endregion

export type Cloud = Legacy | CMS | Shopify;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isCloud = (config: Config): config is Cloud =>
  TARGET === "Cloud" || TARGET === "Cloud-localhost";
