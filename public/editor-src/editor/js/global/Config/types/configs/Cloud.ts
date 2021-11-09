import { WithId } from "visual/utils/options/attributes";
import { DynamicContent } from "visual/global/Config/types/DynamicContent";
import { Pro } from "visual/global/Config/types/Pro";
import { User } from "visual/global/Config/types/User";
import { Urls } from "visual/global/Config/types/Urls";
import { Project } from "visual/global/Config/types/Project";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Config } from "visual/global/Config/types";
import { WhiteLabel } from "visual/component/LeftSidebar/components/Cms/types/WhiteLabel";

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
  cms: {
    adminUrl: string;
    apiUrl: string;
    blogId: string;
  };
  whiteLabel?: WhiteLabel;
}

// endregion

// region CMS
export type CMS = Base<"cms">;

export const isCMS = (c: Cloud): c is CMS => c.platform === "cms";
// endregion

// region Shopify
export type Shopify = Base<"shopify">;

export const isShopify = (c: Cloud): c is Shopify => c.platform === "shopify";
// endregion

export type Cloud = CMS | Shopify;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isCloud = (config: Config): config is Cloud =>
  TARGET === "Cloud" || TARGET === "Cloud-localhost";
