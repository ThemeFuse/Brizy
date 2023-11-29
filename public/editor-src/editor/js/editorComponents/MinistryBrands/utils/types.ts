import {
  EkklesiaFields,
  EkklesiaParentsChilds
} from "visual/global/Config/types/configs/modules/ekklesia/Ekklesia";

export type Switch = "on" | "off";

export interface EkklesiaChoiceParams<
  T extends keyof EkklesiaFields = keyof EkklesiaFields
> {
  key: T;
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

export interface EkklesiaKeys {
  [key: string]: string;
}

export type EkklesiaFieldMap = {
  [K in keyof EkklesiaFields]: EkklesiaModuleFields<K>;
};

export interface EkklesiaModuleFields<
  T extends keyof EkklesiaFields = keyof EkklesiaFields
> {
  value: Record<string, string>;
  module: EkklesiaParams<T>;
}
