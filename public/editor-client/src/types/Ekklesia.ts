import { Literal } from "utils/types";

export interface EkklesiaResponse {
  data: Partial<EkklesiaFields>;
}

export interface EkklesiaFields {
  groups: Record<string, Literal>;
  events: Record<string, Literal>;
  series: Record<string, Literal>;
  recentSermons: Record<string, Literal>;
  smallgroups: Record<string, Literal>;
  forms: Record<string, string>;
  sermon: Record<string, Literal>;
  event: Record<string, Literal>;
  smallgroup: Record<string, Literal>;
  eventsLvl: EkklesiaParentsChilds;
  smallgroupsLvl: EkklesiaParentsChilds;
}

export interface EkklesiaExtra {
  find_group?: string;
}

export interface EkklesiaParentsChilds {
  parents: Record<string, Literal>;
  childs: Record<string, Literal>;
}

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
