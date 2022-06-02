import { EcwidStoreId } from "visual/global/Ecwid";
import * as Authorize from "../Authorize";

// region Disabled
export interface Disabled {
  disabled: true;
}

export const isDisabled = (v: Shop): v is Disabled => v.disabled;
// endregion

// region Ecwid
export interface Ecwid {
  disabled: false;
  subscriptionType: "free" | "pro";
  daysLeft: number;
  type: "ecwid";
  storeId: EcwidStoreId;
  authorize: Authorize.Authorize;
  adminPanelUrl: string;
}

export const isEcwid = (v: Shop): v is Ecwid =>
  !v.disabled && v.type === "ecwid";

export type Shop = Disabled | Ecwid;
