import { EcwidProductId, EcwidStoreId } from "visual/global/Ecwid";

export interface Ecwid {
  type: "ecwid";
  storeId: EcwidStoreId;
  defaultProductId: EcwidProductId;
  subscriptionType: "free" | "pro";
  daysLeft: number;
  userSessionUrl: string;
  apiUrl: string;
}
