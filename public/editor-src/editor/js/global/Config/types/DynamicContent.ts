import { Dictionary } from "visual/types/utils";
import { Literal } from "visual/utils/types/Literal";
import { Response } from "./configs/common";

export enum DCTypes {
  image = "image",
  link = "link",
  richText = "richText",
  reference = "reference",
  multiReference = "multiReference"
}

interface BaseDCItem {
  label: string;
  placeholder: string;
  alias?: string;
  display?: "block" | "inline";
  attr?: Record<string, Literal>;
}

export interface ConfigDCItem extends BaseDCItem {
  optgroup?: ConfigDCItem[];
}

export interface DCItemHandler {
  handler: (
    res: Response<BaseDCItem>,
    rej: Response<string>,
    extra?: { keyCode?: string; placeholder: Literal }
  ) => void;
}

interface DCGroups {
  [DCTypes.image]: Array<ConfigDCItem> | DCItemHandler;
  [DCTypes.link]: Array<ConfigDCItem> | DCItemHandler;
  [DCTypes.richText]: Array<ConfigDCItem> | DCItemHandler;
}

export interface ConfigDCReference {
  title: string;
  slug: string;
  dynamicContent: DCGroups;
}

export interface DCGroupCloud extends DCGroups {
  [DCTypes.reference]: ConfigDCReference[];
  [DCTypes.multiReference]: ConfigDCReference[];
}

type Cnf = {
  cloud: DCGroupCloud;
  wp: DCGroups;
};

export type DCGroup<T extends "wp" | "cloud"> = Cnf[T];

export interface DynamicContent<T extends "wp" | "cloud"> {
  groups?: DCGroup<T>;
  handler?: (
    res: Response<ConfigDCItem[]>,
    rej: Response<string>,
    extraData: { entityType: string; groupType: DCTypes }
  ) => void;
  getPlaceholderData?: (
    res: Response<Dictionary<string[]>>,
    rej: Response<string>,
    extraData: { placeholders: unknown; signal: AbortSignal | undefined }
  ) => void;
}
