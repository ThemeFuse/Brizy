import { Dictionary } from "visual/types/utils";

//#region common

type Switch = "on" | "off";

type V_ = {
  type: string;
  gridRow: number;
  gridColumn: number;
  source: string;
  querySource: string;
  offset: number;
  orderBy: string;
  order: string;
  symbols: Dictionary<string>;
  component: string;
  excludeCurrentProduct: Switch;
  excludeCurrentProductOption?: boolean;
  field?: string;
  [k: string]: unknown; // this is done to cover when symbols are being added to v
};
export type V = { [K in keyof V_]?: V_[K] | null };

export type VDecoded = {
  type: string;
  gridRow: number;
  gridColumn: number;
  source: string;
  querySource: string;
  offset: number;
  orderBy: string;
  order: string;
  symbols: Dictionary<string[]>;
  component?: string;
  excludeCurrentProduct?: Switch;
  excludeCurrentProductOption?: boolean;
  field?: string;
};

//#endregion

//#region cloud
export type CloudTagsQuery = Record<string, unknown>;

export interface CloudComponentConfig {
  exclude?: boolean;
  includeQueryMultiOptions?: boolean;
  querySource?: boolean;
  collectionFilters?: string;
  getManualId?: (source?: string) => boolean;
  getIncludeDisabledValue?: (source: string) => boolean;
}
//#endregion
