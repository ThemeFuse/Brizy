import { ChoicesSync } from "visual/component/Options/types/dev/Select/types";
import { Response } from "visual/global/Config/types/configs/common";
import { EcwidProductId, EcwidStoreId } from "visual/global/Ecwid/types";

export interface Ecwid {
  type: "ecwid";
  storeId: EcwidStoreId;
  defaultProductId: EcwidProductId;
  productId?: EcwidProductId;
  subscriptionType: "free" | "pro";
  daysLeft: number;
  userSessionUrl: string;
  apiUrl: string;
  productCollectionTypeSlug: string;
  categoryCollectionTypeSlug: string;
  ecwidCategoryTypeId?: string;
  api?: {
    getEcwidProducts?: {
      handler?: (res: Response<ChoicesSync>, rej: Response<string>) => void;
    };
  };
}
