import {
  EkklesiaFields,
  EkklesiaParentsChilds
} from "visual/global/Config/types/configs/modules/ekklesia/Ekklesia";

export type Switch = "on" | "off";

export interface EkklesiaChoiceParams<
  T extends keyof EkklesiaFields = keyof EkklesiaFields
> {
  key: T;
  url?: string;
}

export interface EkklesiaChoiceParamsWithSubKey<
  T extends keyof EkklesiaFields = keyof EkklesiaFields
> extends EkklesiaChoiceParams {
  subKey: keyof EkklesiaFields[T];
}

export type EkklesiaParams<
  T extends keyof EkklesiaFields = keyof EkklesiaFields
> = EkklesiaFields[T] extends EkklesiaParentsChilds
  ? EkklesiaChoiceParamsWithSubKey<T>
  : EkklesiaChoiceParams<T>;
