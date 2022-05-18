import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { WithId } from "visual/utils/options/attributes";
import { Role } from "visual/utils/membership";
import { DynamicContent } from "visual/global/Config/types/DynamicContent";
import { Pro } from "visual/global/Config/types/Pro";
import { User } from "visual/global/Config/types/User";
import { Urls } from "visual/global/Config/types/Urls";
import { Project } from "visual/global/Config/types/Project";
import { SupportLinks } from "visual/component/LeftSidebar/components/Cms/types/SupportLinks";
import { WhiteLabel } from "visual/component/LeftSidebar/components/Cms/types/WhiteLabel";
import { Ecwid } from "visual/global/Config/types/configs/modules/shop/Ecwid";

export type ShopModules = undefined | Ecwid;

export interface Base<Platform> extends ConfigCommon, WithId<number> {
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
  tokenV1?: string;
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
    notificationsApiUrl: string;
    translationsApiUrl: string;
    modules?: {
      users?: {
        disabled?: boolean;
      };
    };
  };
  whiteLabel?: WhiteLabel;
  modules?: {
    shop: ShopModules;
  };
}
