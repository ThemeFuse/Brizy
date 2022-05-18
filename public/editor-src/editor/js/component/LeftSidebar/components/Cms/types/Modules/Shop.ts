import { parse, or, mPipe, pass } from "fp-utilities";
import { EcwidStoreId } from "visual/global/Ecwid";
import { isNumber } from "visual/utils/math";
import { prop } from "visual/utils/object/get";

// region Disabled
export interface Disabled {
  disabled: true;
}

export const isDisabled = (v: Shop): v is Disabled => v.disabled;

export const disabledFromRecord = parse<Record<string, unknown>, Disabled>({
  disabled: e => (e.disabled === true ? true : undefined)
});
// endregion

// region Ecwid
export interface Ecwid {
  disabled: false;
  type: "ecwid";
  storeId: EcwidStoreId;
  daysLeft: number;
  subscriptionType: "pro" | "free";
}

export const isEcwid = (v: Shop): v is Ecwid =>
  !v.disabled && v.type === "ecwid";

export const ecwidFromRecord = parse<Record<string, unknown>, Ecwid>({
  disabled: e => (e.disabled === false ? false : undefined),
  type: e => (e.type === "ecwid" ? e.type : undefined),
  storeId: mPipe(prop("storeId"), pass(isNumber), v => v as EcwidStoreId),
  daysLeft: mPipe(prop("daysLeft"), pass(isNumber), v => v as number),
  subscriptionType: e =>
    e.subscriptionType === "free" || e.subscriptionType === "pro"
      ? e.subscriptionType
      : undefined
});
// endregion

export type Shop = Disabled | Ecwid;

export const shopFromRecord: (env: Record<string, unknown>) => Shop = or(
  ecwidFromRecord,
  disabledFromRecord,
  (): Disabled => ({ disabled: true })
);
