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
}

export interface ConfigDCItem extends BaseDCItem {
  optgroup?: ConfigDCItem[];
}

interface DCItemHandler {
  handler: (
    res: Response<BaseDCItem>,
    rej: Response<string>,
    extra?: { keyCode: string }
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
  liveInBuilder?: boolean;
  useCustomPlaceholder?: boolean;
  groups?: DCGroup<T>;
}
